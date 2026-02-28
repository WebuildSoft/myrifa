"use server"

import { prisma } from "@/lib/prisma"
import { z } from "zod"
import { PaymentService } from "@/services/payment"
import { NotificationService } from "@/services/notification"

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

        if (!rifa) throw new Error("Campanha não encontrada")
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

            // Create Transaction record
            const amount = Number(rifa.numberPrice) * validated.numbers.length
            const transactionRecord = await tx.transaction.create({
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

            return { transactionRecord, buyer, amount }
        })

        // 2. Generate Payment via PaymentService
        if (validated.paymentMethod === "PIX") {
            const paymentResult = await PaymentService.createPixPayment({
                amount: checkoutResult.amount,
                description: `Compra Rifa ${rifa.title} - ${validated.numbers.length} números`,
                externalReference: checkoutResult.transactionRecord.id,
                buyer: checkoutResult.buyer
            })

            // Update transaction with External ID
            await prisma.transaction.update({
                where: { id: checkoutResult.transactionRecord.id },
                data: { externalId: paymentResult.id }
            })

            // 3. Send WhatsApp notification via NotificationService
            const appUrl = process.env.NEXT_PUBLIC_APP_URL || ''
            const checkoutUrl = `${appUrl}/r/${rifa.slug}/checkout/${checkoutResult.transactionRecord.id}`

            await NotificationService.sendReservationConfirm({
                whatsapp: validated.whatsapp,
                buyerName: validated.name,
                rifaTitle: rifa.title,
                numbers: validated.numbers,
                amount: checkoutResult.amount,
                checkoutUrl
            })

            return {
                success: true,
                qrCode: paymentResult.qrCode,
                qrCodeCopy: paymentResult.qrCodeCopy,
                transactionId: checkoutResult.transactionRecord.id
            }
        }

        return { error: "Forma de pagamento não suportada por enquanto" }

    } catch (error: any) {
        console.error("Checkout error:", error)
        return { error: error.message || "Erro ao processar checkout" }
    }
}
