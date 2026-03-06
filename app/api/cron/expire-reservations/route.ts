import { prisma } from "@/lib/prisma"
import { NotificationService } from "@/services/notification"

export async function GET(request: Request) {
    // Check authorization header if you want to secure this endpoint
    // const authHeader = request.headers.get("authorization")
    // if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    //   return Response.json({ error: "Unauthorized" }, { status: 401 })
    // }

    try {
        const expiredTransactions = await prisma.transaction.findMany({
            where: {
                status: "PENDING",
                expiresAt: {
                    lt: new Date()
                }
            }
        })

        if (expiredTransactions.length === 0) {
            return Response.json({ success: true, message: "No expired reservations found." })
        }

        let freedCount = 0

        // Using transaction for atomic updates
        for (const trx of expiredTransactions) {
            await prisma.$transaction(async (tx) => {
                // Update transaction to CANCELLED
                await tx.transaction.update({
                    where: { id: trx.id },
                    data: { status: "CANCELLED" }
                })

                // Free up numbers
                const updated = await tx.rifaNumber.updateMany({
                    where: {
                        rifaId: trx.rifaId,
                        number: { in: trx.numbers },
                        status: "RESERVED"
                    },
                    data: {
                        status: "AVAILABLE",
                        buyerId: null
                    }
                })

                freedCount += updated.count
            })
        }

        // --- NEW: Delayed Payment Reminders for Manual Pix ---
        const fifteenMinutesAgo = new Date(Date.now() - 15 * 60 * 1000)
        const remindersToTarget = await (prisma.transaction as any).findMany({
            where: {
                status: "PENDING",
                provider: "MANUAL",
                manualPixReminderSent: false,
                createdAt: {
                    lt: fifteenMinutesAgo
                }
            },
            include: {
                buyer: true,
                rifa: true
            }
        })

        for (const trx of remindersToTarget) {
            try {
                const appUrl = (process.env.NEXT_PUBLIC_APP_URL || "").replace(/\/$/, "")
                const checkoutUrl = `${appUrl}/checkout/pedido/${trx.id}`

                await NotificationService.sendPaymentReminder({
                    whatsapp: (trx as any).buyer.whatsapp,
                    buyerName: (trx as any).buyer.name,
                    rifaTitle: (trx as any).rifa.title,
                    numbers: trx.numbers,
                    checkoutUrl
                })

                await (prisma.transaction as any).update({
                    where: { id: trx.id },
                    data: { manualPixReminderSent: true }
                })
            } catch (err) {
                console.error(`[Cron] Error sending reminder for transaction ${trx.id}:`, err)
            }
        }

        return Response.json({
            success: true,
            cancelledTransactions: expiredTransactions.length,
            freedNumbers: freedCount,
            remindersSent: remindersToTarget.length
        })

    } catch (error) {
        console.error("Cron Error:", error)
        return Response.json({ error: "Failed to process expired reservations" }, { status: 500 })
    }
}
