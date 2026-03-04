"use server"

import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"
import { NotificationService } from "@/services/notification"

/**
 * Comprador clica em "Já Paguei" — muda transaction para PENDING_CONFIRMATION
 * e notifica o organizador via WhatsApp (se configurado).
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

        // Atualizar status para aguardando confirmação do organizador
        await prisma.transaction.update({
            where: { id: transactionId },
            data: { status: "PENDING" } // mantemos PENDING; usaremos paidAt = null como indicador
        })

        // Notificar organizador via WhatsApp
        const rifa = transaction.rifa as any
        if (rifa.notifyOrganizer && rifa.organizerWhatsapp) {
            const appUrl = process.env.NEXT_PUBLIC_APP_URL || ''
            const dashUrl = `${appUrl}/dashboard/rifas/${rifa.id}/compradores`

            NotificationService.sendOrganizerAlert({
                whatsapp: rifa.organizerWhatsapp,
                buyerName: (transaction.buyer as any).name,
                rifaTitle: rifa.title,
                numbers: transaction.numbers as number[],
                amount: Number(transaction.amount),
                type: 'PAYMENT'
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
        const appUrl = process.env.NEXT_PUBLIC_APP_URL || ''
        const checkoutUrl = `${appUrl}/checkout/pedido/${transactionId}`
        await NotificationService.sendReservationConfirm({
            whatsapp: (transaction.buyer as any).whatsapp,
            buyerName: (transaction.buyer as any).name,
            rifaTitle: transaction.rifa.title,
            numbers: transaction.numbers as number[],
            amount: Number(transaction.amount),
            checkoutUrl
        }).catch(console.error)

        return { success: true }
    } catch (error: any) {
        console.error("Error confirming organizer payment:", error)
        return { error: error.message || "Erro ao confirmar pagamento" }
    }
}
