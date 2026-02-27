"use server"

import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"
import { revalidatePath } from "next/cache"
import crypto from "crypto"
import { sendWhatsAppMessage, templates } from "@/lib/evolution"

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
                _count: {
                    select: { numbers: { where: { status: "PAID" } } }
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

        // Check if it reached min percentage (Make it optional for manual draw)
        // const progress = Math.round((rifa._count.numbers / rifa.totalNumbers) * 100)
        // if (progress < rifa.minPercentToRaffle) {
        //     return { error: `A campanha não atingiu a meta mínima de ${rifa.minPercentToRaffle}% para ser finalizada.` }
        // }

        if (rifa.numbers.length === 0) {
            return { error: "Não há apoios registrados para realizar a premiação." }
        }

        // Evitar que o mesmo número ganhe mais de um prêmio na mesma campanha (opcional)
        // Por enquanto vamos permitir, mas podemos filtrar futuramente se o usuário pedir.
        // Se quisermos evitar ganhadores repetidos:
        // const alreadyWinningNumbers = rifa.prizes.map(p => p.winnerNumber).filter(n => n !== null) as number[]
        // const availableTickets = rifa.numbers.filter(t => !alreadyWinningNumbers.includes(t.number))

        const availableTickets = rifa.numbers

        if (availableTickets.length === 0) {
            return { error: "Não há mais bilhetes disponíveis para premiação." }
        }

        // Algoritmo de premiação criptográfica segura
        const maxIndex = availableTickets.length - 1
        const randomBuffer = crypto.randomBytes(4)
        const randomNumber = randomBuffer.readUInt32LE(0)
        const winningIndex = randomNumber % (maxIndex + 1)

        const winningTicket = availableTickets[winningIndex]

        // Update Prize with winner
        await prisma.prize.update({
            where: { id: prizeId },
            data: {
                winnerId: winningTicket.buyerId,
                winnerNumber: winningTicket.number,
                drawnAt: new Date()
            }
        })

        // Se todos os prêmios foram sorteados, podemos marcar a rifa como DRAWN
        const remainingPrizes = await prisma.prize.count({
            where: { rifaId, winnerId: null }
        })

        if (remainingPrizes === 0) {
            await prisma.rifa.update({
                where: { id: rifaId },
                data: { status: "DRAWN" }
            })
        }

        // Send WhatsApp notification to winner
        if (winningTicket.buyer?.whatsapp) {
            const message = templates.winner(
                winningTicket.buyer.name,
                rifa.title,
                winningTicket.number
            )
            await sendWhatsAppMessage(winningTicket.buyer.whatsapp, message)
        }

        revalidatePath(`/dashboard/rifas/${rifaId}`)
        revalidatePath(`/r/${rifa.slug}`)
        revalidatePath(`/sorteio/${rifaId}`)
        revalidatePath("/dashboard")

        return {
            success: true,
            winnerNumber: winningTicket.number,
            winnerName: winningTicket.buyer?.name
        }
    } catch (error) {
        console.error("Draw error:", error)
        return { error: "Erro ao finalizar a campanha." }
    }
}
