"use server"

import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"
import { revalidatePath } from "next/cache"
import crypto from "crypto"
import { sendWhatsAppMessage, templates } from "@/lib/evolution"

export async function drawRifaAction(rifaId: string) {
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
                }
            }
        })

        if (!rifa) return { error: "Rifa não encontrada" }
        if (rifa.status === "DRAWN") return { error: "A premiação desta campanha já foi realizada!" }

        // Check if it reached min percentage
        const progress = Math.round((rifa._count.numbers / rifa.totalNumbers) * 100)
        if (progress < rifa.minPercentToRaffle) {
            return { error: `A campanha não atingiu a meta mínima de ${rifa.minPercentToRaffle}% para ser finalizada.` }
        }

        if (rifa.numbers.length === 0) {
            return { error: "Não há apoios registrados para realizar a premiação." }
        }

        // Algoritmo de premiação criptográfica segura
        const maxIndex = rifa.numbers.length - 1
        const randomBuffer = crypto.randomBytes(4)
        const randomNumber = randomBuffer.readUInt32LE(0)
        const winningIndex = randomNumber % (maxIndex + 1)

        const winningTicket = rifa.numbers[winningIndex]

        // Update Rifa with winner
        await prisma.rifa.update({
            where: { id: rifaId },
            data: {
                status: "DRAWN",
                winnerId: winningTicket.buyerId,
                winnerNumber: winningTicket.number,
                drawnAt: new Date()
            }
        })

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
