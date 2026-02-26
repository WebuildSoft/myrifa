"use server"

import { prisma } from "@/lib/prisma"
import { MercadoPagoConfig, Payment } from "mercadopago"
import { z } from "zod"
import { sendWhatsAppMessage, templates } from "@/lib/evolution"

const checkoutSchema = z.object({
    rifaId: z.string(),
    name: z.string().min(3),
    whatsapp: z.string().min(10),
    email: z.string().email().optional().or(z.literal("")),
    numbers: z.array(z.number()).min(1),
    paymentMethod: z.enum(["PIX", "CREDIT_CARD", "BOLETO"]),
})

export async function processCheckoutAction(data: z.infer<typeof checkoutSchema>) {
    try {
        const validated = checkoutSchema.parse(data)

        const rifa = await prisma.rifa.findUnique({
            where: { id: validated.rifaId }
        })

        if (!rifa) throw new Error("Rifa not found")
        if (rifa.status === ("DELETED" as any)) throw new Error("Esta rifa não está mais disponível.")

        // 1. Transaction to reserve numbers and create buyer
        const checkoutResult = await prisma.$transaction(async (tx) => {
            // Create or find buyer
            let buyer = await tx.buyer.findFirst({
                where: { whatsapp: validated.whatsapp }
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

            // Create Transaction
            const amount = Number(rifa.numberPrice) * validated.numbers.length
            const transaction = await tx.transaction.create({
                data: {
                    amount,
                    status: "PENDING",
                    method: validated.paymentMethod,
                    buyerId: buyer.id,
                    rifaId: rifa.id,
                    numbers: validated.numbers,
                    expiresAt: new Date(Date.now() + 30 * 60 * 1000) // 30 min expiration
                }
            })

            return { transaction, buyer, amount }
        })

        // 2. Generate Payment via MercadoPago
        if (validated.paymentMethod === "PIX") {
            const client = new MercadoPagoConfig({ accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN || '' })
            const payment = new Payment(client)

            const mpResponse = await payment.create({
                body: {
                    transaction_amount: checkoutResult.amount,
                    description: `Compra Rifa ${rifa.title} - ${validated.numbers.length} números`,
                    payment_method_id: 'pix',
                    payer: {
                        email: checkoutResult.buyer.email || "contato@rifaonline.com.br", // MP requires email sometimes
                        first_name: checkoutResult.buyer.name.split(" ")[0],
                        last_name: checkoutResult.buyer.name.split(" ").slice(1).join(" ") || "Silva",
                        identification: { type: 'CPF', number: '19119119100' } // Placeholder for MP sandbox
                    },
                    external_reference: checkoutResult.transaction.id
                }
            })

            // Update transaction with MP ID
            await prisma.transaction.update({
                where: { id: checkoutResult.transaction.id },
                data: { externalId: mpResponse.id?.toString() }
            })

            // 3. Send WhatsApp notification
            const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
            const checkoutUrl = `${appUrl}/r/${rifa.slug}/checkout/${checkoutResult.transaction.id}`

            const message = templates.newReservation(
                validated.name,
                rifa.title,
                validated.numbers,
                new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(checkoutResult.amount),
                checkoutUrl
            )

            await sendWhatsAppMessage(validated.whatsapp, message)

            return {
                success: true,
                qrCode: mpResponse.point_of_interaction?.transaction_data?.qr_code_base64,
                qrCodeCopy: mpResponse.point_of_interaction?.transaction_data?.qr_code,
                transactionId: checkoutResult.transaction.id
            }
        }

        return { error: "Forma de pagamento não suportada por enquanto" }

    } catch (error: any) {
        console.error("Checkout error:", error)
        return { error: error.message || "Erro ao processar checkout" }
    }
}
