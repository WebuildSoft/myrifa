"use server"

import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"
import { NotificationService } from "@/services/notification"
import { sendWhatsAppMessage, templates } from "@/lib/evolution"

/**
 * Comprador clica em "Já Paguei" — muda transaction para PENDING
 * gera um token de confirmação e notifica o organizador com link direto.
 */
export async function buyerConfirmPaymentAction(transactionId: string) {
    try {
        const transaction = await prisma.transaction.findUnique({
            where: { id: transactionId },
            include: {
                rifa: {
                    include: { user: true }
                },
                buyer: true
            }
        })

        if (!transaction) return { error: "Transação não encontrada" }
        if (transaction.status !== "PENDING") {
            return { error: "Esta transação não está aguardando pagamento" }
        }

        // Gerar token único para confirmação rápida
        const confirmationToken = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)

        // Atualizar status e salvar token
        await prisma.transaction.update({
            where: { id: transactionId },
            data: {
                status: "PENDING",
                confirmationToken
            }
        })

        // Notificar organizador via WhatsApp
        const rifa = transaction.rifa as any
        if (rifa.notifyOrganizer && rifa.organizerWhatsapp) {
            const appUrl = process.env.NEXT_PUBLIC_APP_URL || ''
            const dashUrl = `${appUrl}/dashboard/rifas/${rifa.id}/compradores`
            const confirmUrl = `${appUrl}/confirmar-pagamento/${confirmationToken}`

            NotificationService.sendOrganizerAlert({
                whatsapp: rifa.organizerWhatsapp,
                buyerName: (transaction.buyer as any).name,
                rifaTitle: rifa.title,
                numbers: transaction.numbers as number[],
                amount: Number(transaction.amount),
                type: 'REPORTED',
                dashUrl,
                confirmUrl
            }).catch(console.error)
        }

        return { success: true }
    } catch (error: any) {
        console.error("Error confirming payment:", error)
        return { error: error.message || "Erro ao confirmar pagamento" }
    }
}

/**
 * Organizador confirma o pagamento manual no dashboard.
 */
export async function organizerConfirmPaymentAction(transactionId: string) {
    try {
        const session = await auth()
        if (!session?.user?.id) return { error: "Não autorizado" }

        const transaction = await prisma.transaction.findUnique({
            where: { id: transactionId },
            include: {
                rifa: true,
                buyer: true
            }
        })

        if (!transaction) return { error: "Transação não encontrada" }
        if (transaction.rifa.userId !== session.user.id) return { error: "Não autorizado" }
        if (transaction.status === "PAID") return { error: "Pagamento já confirmado" }

        // Confirmar pagamento e marcar números como PAID
        await prisma.$transaction(async (tx) => {
            await tx.transaction.update({
                where: { id: transactionId },
                data: {
                    status: "PAID",
                    paidAt: new Date()
                }
            })

            await tx.rifaNumber.updateMany({
                where: {
                    rifaId: transaction.rifaId,
                    number: { in: transaction.numbers as number[] }
                },
                data: { status: "PAID", paidAt: new Date() }
            })

            await tx.rifa.update({
                where: { id: transaction.rifaId },
                data: {
                    totalRaised: { increment: transaction.amount }
                }
            })
        })

        // Notificar comprador via WhatsApp
        const buyerWhatsapp = (transaction.buyer as any).whatsapp
        if (buyerWhatsapp) {
            const message = await templates.paymentConfirmed(
                (transaction.buyer as any).name,
                transaction.rifa.title,
                transaction.numbers as number[]
            )
            await sendWhatsAppMessage(buyerWhatsapp, message).catch(console.error)
        }

        return { success: true }
    } catch (error: any) {
        console.error("Error confirming organizer payment:", error)
        return { error: error.message || "Erro ao confirmar pagamento" }
    }
}

/**
 * Confirmação de pagamento via Link Mágico (sem login).
 */
export async function confirmPaymentWithTokenAction(token: string) {
    try {
        const transaction = await prisma.transaction.findUnique({
            where: { confirmationToken: token },
            include: {
                rifa: true,
                buyer: true
            }
        })

        if (!transaction) return { error: "Link de confirmação inválido ou já utilizado." }
        if (transaction.status === "PAID") return { error: "Este pagamento já foi confirmado anteriormente." }

        // Confirmar pagamento e limpar o token para não ser reusado
        await prisma.$transaction(async (tx) => {
            await tx.transaction.update({
                where: { id: transaction.id },
                data: {
                    status: "PAID",
                    paidAt: new Date(),
                    confirmationToken: null // Invalidar token após uso
                }
            })

            await tx.rifaNumber.updateMany({
                where: {
                    rifaId: transaction.rifaId,
                    number: { in: transaction.numbers as number[] }
                },
                data: { status: "PAID", paidAt: new Date() }
            })

            await tx.rifa.update({
                where: { id: transaction.rifaId },
                data: {
                    totalRaised: { increment: transaction.amount }
                }
            })
        })

        // Notificar comprador via WhatsApp
        const buyerWhatsapp = (transaction.buyer as any).whatsapp
        if (buyerWhatsapp) {
            const message = await templates.paymentConfirmed(
                (transaction.buyer as any).name,
                transaction.rifa.title,
                transaction.numbers as number[]
            )
            await sendWhatsAppMessage(buyerWhatsapp, message).catch(console.error)
        }

        return {
            success: true,
            data: {
                buyerName: (transaction.buyer as any).name,
                rifaTitle: transaction.rifa.title,
                amount: Number(transaction.amount)
            }
        }
    } catch (error: any) {
        console.error("Error confirming payment with token:", error)
        return { error: "Erro interno ao confirmar pagamento." }
    }
}
