"use server"

import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"
import { revalidatePath } from "next/cache"
import { sendWhatsAppMessage, templates } from "@/lib/evolution"
import { DrawService } from "@/services/draw"

export async function drawRifaAction(rifaId: string, prizeId: string) {
    const session = await auth()
    if (!session?.user?.id) return { error: "Não autorizado" }

    try {
        const rifa = await prisma.rifa.findUnique({
            where: { id: rifaId, userId: session.user.id },
            include: {
                numbers: {
                    where: { status: "PAID" },
                    include: { buyer: true }
                },
                prizes: true
            }
        })

        if (!rifa) return { error: "Campanha não encontrada" }

        const prize = await prisma.prize.findUnique({
            where: { id: prizeId, rifaId: rifa.id }
        })

        if (!prize) return { error: "Prêmio não encontrado" }
        if (prize.winnerId) return { error: "A premiação deste prêmio já foi realizada!" }

        const eligibleTickets = rifa.numbers.map(n => ({
            number: n.number,
            buyerId: n.buyerId as string,
            buyer: n.buyer
        }))

        const drawResult = DrawService.selectWinner(eligibleTickets)

        // Log attempt for auditability
        await DrawService.logDrawAttempt(rifaId, prizeId, drawResult)

        if (!drawResult.success || !drawResult.winningTicket) {
            return { error: drawResult.error || "Falha ao selecionar vencedor" }
        }

        const winner = drawResult.winningTicket

        // Update Prize and Rifa Status in DB
        await prisma.$transaction(async (tx) => {
            await tx.prize.update({
                where: { id: prizeId },
                data: {
                    winnerId: winner.buyerId,
                    winnerNumber: winner.number,
                    drawnAt: new Date()
                }
            })

            const remainingPrizes = await tx.prize.count({
                where: { rifaId, winnerId: null }
            })

            if (remainingPrizes === 0) {
                await tx.rifa.update({
                    where: { id: rifaId },
                    data: { status: "DRAWN" }
                })
            }
        })

        // Notify Winner via WhatsApp
        if (winner.buyer?.whatsapp) {
            const message = templates.winner(
                winner.buyer.name,
                rifa.title,
                winner.number
            )
            await sendWhatsAppMessage(winner.buyer.whatsapp, message)
        }

        // Revalidate Cache
        revalidatePath(`/dashboard/rifas/${rifaId}`)
        revalidatePath(`/r/${rifa.slug}`)
        revalidatePath(`/sorteio/${rifaId}`)
        revalidatePath("/dashboard")

        return {
            success: true,
            winnerNumber: winner.number,
            winnerName: winner.buyer?.name
        }
    } catch (error) {
        console.error("Draw error:", error)
        return { error: "Erro ao finalizar a campanha." }
    }
}
