import { prisma } from "@/lib/prisma"

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

        return Response.json({
            success: true,
            cancelledTransactions: expiredTransactions.length,
            freedNumbers: freedCount
        })

    } catch (error) {
        console.error("Cron Error:", error)
        return Response.json({ error: "Failed to process expired reservations" }, { status: 500 })
    }
}
