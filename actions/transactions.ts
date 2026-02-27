"use server"

import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"
import { revalidatePath } from "next/cache"
import { sendWhatsAppMessage, templates } from "@/lib/evolution"

export async function confirmPaymentAction(transactionId: string) {
    const session = await auth()
    if (!session?.user?.id) return { error: "Não autorizado" }

    try {
        const transaction = await prisma.transaction.findUnique({
            where: { id: transactionId },
            include: {
                buyer: true,
                rifa: true
            }
        })

        if (!transaction) return { error: "Transação não encontrada" }

        // Verify ownership
        if (transaction.rifa.userId !== session.user.id) {
            return { error: "Você não tem permissão para confirmar esta transação" }
        }

        if (transaction.status === "PAID") {
            return { error: "Esta transação já foi confirmada" }
        }

        // Atomic update
        await prisma.$transaction(async (tx) => {
            // 1. Update Transaction
            await tx.transaction.update({
                where: { id: transactionId },
                data: {
                    status: "PAID",
                    paidAt: new Date()
                }
            })

            // 2. Update associated numbers
            await tx.rifaNumber.updateMany({
                where: {
                    rifaId: transaction.rifaId,
                    number: { in: transaction.numbers }
                },
                data: { status: "PAID" }
            })

            // 3. Update Rifa total raised
            await tx.rifa.update({
                where: { id: transaction.rifaId },
                data: {
                    totalRaised: {
                        increment: transaction.amount
                    }
                }
            })
        })

        // 4. Send WhatsApp confirmation (Async, don't block)
        if (transaction.buyer.whatsapp) {
            try {
                const message = templates.paymentConfirmed(
                    transaction.buyer.name,
                    transaction.rifa.title,
                    transaction.numbers
                )
                await sendWhatsAppMessage(transaction.buyer.whatsapp, message)
            } catch (wsError) {
                console.error("WhatsApp Error:", wsError)
            }
        }

        revalidatePath(`/dashboard/rifas/${transaction.rifaId}`)
        return { success: true }

    } catch (error) {
        console.error("Manual confirm error:", error)
        return { error: "Erro ao confirmar pagamento" }
    }
}

export async function cancelTransactionAction(transactionId: string) {
    const session = await auth()
    if (!session?.user?.id) return { error: "Não autorizado" }

    try {
        const transaction = await prisma.transaction.findUnique({
            where: { id: transactionId },
            include: {
                rifa: true
            }
        })

        if (!transaction) return { error: "Transação não encontrada" }

        // Verify ownership
        if (transaction.rifa.userId !== session.user.id) {
            return { error: "Você não tem permissão para cancelar esta transação" }
        }

        if (transaction.status === "PAID") {
            return { error: "Não é possível cancelar uma transação já paga por aqui" }
        }

        await prisma.$transaction(async (tx) => {
            // 1. Update Transaction
            await tx.transaction.update({
                where: { id: transactionId },
                data: { status: "CANCELLED" }
            })

            // 2. Free numbers
            await tx.rifaNumber.updateMany({
                where: {
                    rifaId: transaction.rifaId,
                    number: { in: transaction.numbers },
                    status: "RESERVED"
                },
                data: {
                    status: "AVAILABLE",
                    buyerId: null,
                    reservedAt: null
                }
            })
        })

        revalidatePath(`/dashboard/rifas/${transaction.rifaId}`)
        return { success: true }

    } catch (error) {
        console.error("Manual cancel error:", error)
        return { error: "Erro ao cancelar transação" }
    }
}
