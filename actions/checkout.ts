"use server"

import { prisma } from "@/lib/prisma"
import { z, ZodError } from "zod"
import { PaymentService } from "@/services/payment"
import { NotificationService } from "@/services/notification"

const checkoutSchema = z.object({
    rifaId: z.string(),
    name: z.string().min(3, "O nome deve ter pelo menos 3 caracteres"),
    whatsapp: z.string()
        .transform(v => {
            // Strip everything except digits
            const digits = v.replace(/\D/g, "")
            // Add country code 55 if not present
            return digits.startsWith("55") ? digits : `55${digits}`
        })
        .refine(v => v.length >= 12 && v.length <= 13, {
            message: "WhatsApp inválido. Informe DDD + número completo."
        }),
    email: z.string().email("E-mail inválido").optional().or(z.literal("")),
    numbers: z.array(z.number()).min(1, "Selecione pelo menos um número"),
    paymentMethod: z.enum(["PIX", "PIX_MANUAL", "CREDIT_CARD", "BOLETO"]),
})

export async function processCheckoutAction(data: z.infer<typeof checkoutSchema>) {
    try {
        const validated = checkoutSchema.parse(data)

        const rifa = await prisma.rifa.findUnique({
            where: { id: validated.rifaId },
            include: { user: true }
        })

        if (!rifa) throw new Error("Campanha não encontrada")
        if (rifa.status === ("DELETED" as any)) throw new Error("Esta rifa não está mais disponível.")

        if (rifa.user?.isBlocked) {
            return { error: "Esta campanha está temporariamente indisponível. Entre em contato com o suporte." }
        }

        // Validar limites por comprador
        if (rifa.maxPerBuyer && validated.numbers.length > rifa.maxPerBuyer) {
            return { error: `Você só pode comprar no máximo ${rifa.maxPerBuyer} cotas nesta campanha.` }
        }

        // Validar se os números estão no intervalo correto (ex: 0 a totalNumbers - 1)
        const invalidNumbers = validated.numbers.filter(n => n < 0 || n >= rifa.totalNumbers)
        if (invalidNumbers.length > 0) {
            return { error: "Alguns números selecionados são inválidos para esta campanha." }
        }

        const ownerAccessToken = rifa.user?.mercadoPagoAccessToken
        const ownerPixKey = (rifa.user as any)?.pixKey
        const ownerPixQrCodeImage = (rifa.user as any)?.pixQrCodeImage

        // PIX_MANUAL não precisa de token do MP
        if (validated.paymentMethod !== "PIX_MANUAL") {
            if (!ownerAccessToken) {
                console.log(`[Checkout] Error: Owner ${rifa.userId} has no MP token.`)
                return { error: "O organizador da campanha ainda não configurou os recebimentos. Tente novamente mais tarde." }
            }
        }

        // 1. Transaction to reserve numbers, create buyer and determine destination
        const checkoutResult = await prisma.$transaction(async (tx) => {
            // Find Rifa within transaction
            const rifaTx = await tx.rifa.findUnique({
                where: { id: validated.rifaId },
                include: { user: true }
            })

            if (!rifaTx) throw new Error("Campanha não encontrada")

            // Create or find buyer
            let buyer = await tx.buyer.findFirst({
                where: {
                    whatsapp: validated.whatsapp,
                    rifaId: validated.rifaId
                }
            })

            if (!buyer) {
                buyer = await tx.buyer.create({
                    data: {
                        name: validated.name,
                        whatsapp: validated.whatsapp,
                        email: validated.email,
                        rifaId: validated.rifaId
                    }
                })
            }

            // Verify numbers are available
            const availableNumbers = await tx.rifaNumber.findMany({
                where: {
                    rifaId: validated.rifaId,
                    number: { in: validated.numbers },
                    status: "AVAILABLE"
                }
            })

            if (availableNumbers.length !== validated.numbers.length) {
                throw new Error("Alguns números já foram vendidos ou reservados.")
            }

            // Reserve numbers
            await tx.rifaNumber.updateMany({
                where: {
                    rifaId: validated.rifaId,
                    number: { in: validated.numbers }
                },
                data: {
                    status: "RESERVED",
                    buyerId: buyer.id
                }
            })

            const amount = Number(rifaTx.numberPrice) * validated.numbers.length

            // --- Atomic Destination Logic ---
            let destination: 'PLATFORM' | 'ORGANIZER' = 'ORGANIZER'
            let provider: 'STRIPE' | 'MERCADO_PAGO' = 'MERCADO_PAGO'

            const goal = Number(rifaTx.quotaCommissionGoal || 0)
            const reserved = Number(rifaTx.quotaCommissionReserved || 0)
            const percent = Number(rifaTx.quotaCommissionPercent || 0.05)

            // Se ainda não reservamos o suficiente para atingir a meta
            if (reserved < goal) {
                const raffleChance = Math.random()
                if (raffleChance <= percent) {
                    destination = 'PLATFORM'
                    provider = 'STRIPE'

                    // Incrementamos o reserved
                    await (tx.rifa as any).update({
                        where: { id: (rifaTx as any).id },
                        data: {
                            quotaCommissionReserved: { increment: amount }
                        }
                    })
                }
            }

            // PIX_MANUAL: só permitido se o destino for ORGANIZER
            if (validated.paymentMethod === "PIX_MANUAL") {
                if (destination === 'PLATFORM') {
                    // Se o sistema decidiu que esta venda é para a plataforma, bloqueamos o manual
                    throw new Error("Este método de pagamento não está disponível para esta transação. Por favor, escolha outra opção.")
                }

                const transactionRecord = await tx.transaction.create({
                    data: {
                        amount,
                        status: "PENDING",
                        method: "PIX",
                        buyerId: buyer.id,
                        rifaId: rifaTx.id,
                        numbers: validated.numbers,
                        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24h para PIX manual
                        provider: "MANUAL" as any,
                        destination: "ORGANIZER"
                    }
                })
                return { transactionRecord, buyer, amount, provider: "MANUAL" as any, destination: "ORGANIZER" as any, isManualPix: true }
            }

            // Create Transaction record for automated methods
            const transactionRecord = await tx.transaction.create({
                data: {
                    amount,
                    status: "PENDING",
                    method: validated.paymentMethod,
                    buyerId: buyer.id,
                    rifaId: rifaTx.id,
                    numbers: validated.numbers,
                    expiresAt: new Date(Date.now() + 30 * 60 * 1000), // 30 min expiration
                    provider,
                    destination
                }
            })

            return { transactionRecord, buyer, amount, provider, destination }
        })

        const provider = checkoutResult.provider
        const destination = checkoutResult.destination
        const accessToken = provider === 'STRIPE' ? undefined : ownerAccessToken

        if (validated.paymentMethod === "PIX") {
            const paymentResult = await PaymentService.createPixPayment({
                amount: checkoutResult.amount,
                description: `Compra Rifa ${rifa.title} - ${validated.numbers.length} números`,
                externalReference: checkoutResult.transactionRecord.id,
                buyer: checkoutResult.buyer,
                accessToken: accessToken || undefined,
                rifaId: rifa.id,
                provider
            })
            console.log(`[Checkout] Payment created with ID: ${paymentResult.id}`)

            // Update transaction with External ID
            await prisma.transaction.update({
                where: { id: checkoutResult.transactionRecord.id },
                data: {
                    externalId: paymentResult.id,
                    pixQrCode: paymentResult.qrCode,
                    pixQrCodeText: paymentResult.qrCodeCopy
                }
            })

            // 3. Send WhatsApp notification via NotificationService
            const appUrl = process.env.NEXT_PUBLIC_APP_URL || ''
            const checkoutUrl = `${appUrl}/checkout/pedido/${checkoutResult.transactionRecord.id}`
            await NotificationService.sendReservationConfirm({
                whatsapp: validated.whatsapp,
                buyerName: validated.name,
                rifaTitle: rifa.title,
                numbers: validated.numbers,
                amount: checkoutResult.amount,
                checkoutUrl
            })

            // 4. Optionally notify organizer
            if ((rifa as any).notifyOrganizer && (rifa as any).organizerWhatsapp) {
                NotificationService.sendOrganizerAlert({
                    whatsapp: (rifa as any).organizerWhatsapp,
                    buyerName: validated.name,
                    rifaTitle: rifa.title,
                    numbers: validated.numbers,
                    amount: checkoutResult.amount,
                    type: 'RESERVATION'
                }).catch(err => console.error("[Organizer-Alert] Error:", err))
            }

            console.log(`[Checkout] Success! QR Code exists: ${!!paymentResult.qrCode}, Copy text exists: ${!!paymentResult.qrCodeCopy}`)

            return {
                success: true,
                qrCode: paymentResult.qrCode,
                qrCodeCopy: paymentResult.qrCodeCopy,
                transactionId: checkoutResult.transactionRecord.id
            }
        }

        // PIX_MANUAL: retornar dados PIX do organizador
        if (validated.paymentMethod === "PIX_MANUAL") {
            const appUrl = process.env.NEXT_PUBLIC_APP_URL || ''
            const checkoutUrl = `${appUrl}/checkout/pedido/${checkoutResult.transactionRecord.id}`
            await NotificationService.sendReservationConfirm({
                whatsapp: validated.whatsapp,
                buyerName: validated.name,
                rifaTitle: rifa.title,
                numbers: validated.numbers,
                amount: checkoutResult.amount,
                checkoutUrl,
                isManual: true
            }).catch(() => { })

            if ((rifa as any).notifyOrganizer && (rifa as any).organizerWhatsapp) {
                NotificationService.sendOrganizerAlert({
                    whatsapp: (rifa as any).organizerWhatsapp,
                    buyerName: validated.name,
                    rifaTitle: rifa.title,
                    numbers: validated.numbers,
                    amount: checkoutResult.amount,
                    type: 'RESERVATION'
                }).catch(() => { })
            }

            return {
                success: true,
                type: 'PIX_MANUAL' as const,
                transactionId: checkoutResult.transactionRecord.id,
                pixKey: ownerPixKey || null,
                pixQrCodeImage: ownerPixQrCodeImage || null,
            }
        }

        return { error: "Forma de pagamento não suportada por enquanto" }

    } catch (error: any) {
        console.error("Checkout error:", error)

        if (error instanceof ZodError) {
            return { error: error.issues[0].message }
        }

        return { error: error.message || "Erro ao processar checkout" }
    }
}

export async function checkPaymentStatusAction(transactionId: string) {
    try {
        const transaction = await prisma.transaction.findUnique({
            where: { id: transactionId },
            select: { status: true }
        })

        if (!transaction) return { error: "Transação não encontrada" }

        return { status: transaction.status }
    } catch (error) {
        console.error("Error checking payment status:", error)
        return { error: "Erro ao verificar status" }
    }
}

export async function getTransactionDetailsAction(transactionId: string) {
    try {
        const transaction = await prisma.transaction.findUnique({
            where: { id: transactionId },
            include: {
                rifa: {
                    include: {
                        user: {
                            select: {
                                id: true,
                                mercadoPagoAccessToken: true
                            }
                        }
                    }
                },
                buyer: {
                    select: {
                        name: true,
                        whatsapp: true,
                        email: true
                    }
                }
            }
        })

        if (!transaction) return { error: "Transação não encontrada" }

        // Se o pagamento for pendente mas não tiver os dados do PIX (bug anterior), tentamos gerar agora
        if (transaction.status === "PENDING" && !transaction.pixQrCodeText) {
            const isStripe = transaction.provider === 'STRIPE'
            const ownerAccessToken = (transaction.rifa as any).user?.mercadoPagoAccessToken

            console.log(`[Checkout] Missing PIX data for transaction ${transactionId}. Provider: ${transaction.provider}. Regenerating...`)

            // Stripe usa a chave global do sistema, MP precisa do token do dono
            if (isStripe || ownerAccessToken) {
                try {
                    const paymentResult = await PaymentService.createPixPayment({
                        amount: Number(transaction.amount),
                        description: `Pagamento Rifa ${transaction.rifa.title}`,
                        externalReference: transaction.id,
                        buyer: {
                            name: (transaction.buyer as any).name,
                            email: (transaction.buyer as any).email || `${(transaction.buyer as any).whatsapp}@myrifa.com.br`
                        },
                        accessToken: isStripe ? undefined : ownerAccessToken,
                        rifaId: transaction.rifaId,
                        provider: transaction.provider as any
                    })

                    // Atualiza o registro com os novos dados
                    const updatedTx = await prisma.transaction.update({
                        where: { id: transactionId },
                        data: {
                            pixQrCode: paymentResult.qrCode,
                            pixQrCodeText: paymentResult.qrCodeCopy,
                            externalId: paymentResult.id
                        }
                    })

                    // Retorna a transação atualizada
                    return {
                        success: true,
                        transaction: {
                            ...transaction,
                            pixQrCode: updatedTx.pixQrCode,
                            pixQrCodeText: updatedTx.pixQrCodeText,
                            externalId: updatedTx.externalId
                        }
                    }
                } catch (regError) {
                    console.error("[Checkout] Error regenerating PIX:", regError)
                }
            }
        }

        return { success: true, transaction }
    } catch (error) {
        console.error("Error fetching transaction details:", error)
        return { error: "Erro ao carregar detalhes do pedido" }
    }
}

export async function getAvailablePaymentMethodsAction(rifaId: string) {
    try {
        const rifa = await prisma.rifa.findUnique({
            where: { id: rifaId },
            include: { user: true }
        })

        if (!rifa) throw new Error("Campanha não encontrada")

        const goal = Number((rifa as any).quotaCommissionGoal || 0)
        const reserved = Number((rifa as any).quotaCommissionReserved || 0)
        const percent = Number((rifa as any).quotaCommissionPercent || 0.05)

        console.log(`[Method-Selector] Goal: ${goal}, Reserved: ${reserved}, Percent: ${percent}`)

        // Se ainda não atingiu a meta, sorteia se esta venda vai para a PLATAFORMA
        if (reserved < goal) {
            const raffleChance = Math.random()
            console.log(`[Method-Selector] Raffle Chance: ${raffleChance.toFixed(4)} vs ${percent}`)

            if (raffleChance <= percent) {
                console.log(`[Method-Selector] SELECTED: PLATFORM (Stripe forced)`)
                return {
                    destination: 'PLATFORM',
                    methods: ["STRIPE" as const],
                    hasManualPix: false,
                    hasMercadoPago: false,
                }
            }
        }

        console.log(`[Method-Selector] SELECTED: ORGANIZER (All options)`)
        return {
            destination: 'ORGANIZER',
            methods: ["PIX", "PIX_MANUAL", "CREDIT_CARD", "BOLETO"] as const,
            hasManualPix: !!((rifa.user as any)?.pixKey || (rifa.user as any)?.pixQrCodeImage),
            hasMercadoPago: !!(rifa.user?.mercadoPagoAccessToken),
        }

    } catch (error) {
        console.error("Error getting payment methods:", error)
        return { error: "Erro ao carregar métodos de pagamento" }
    }
}
