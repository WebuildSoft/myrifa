"use server"

import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"
import { revalidatePath } from "next/cache"
import { RifaStatus } from "@prisma/client"

export async function publishRifaAction(rifaId: string) {
    const session = await auth()
    if (!session?.user?.id) return { error: "Não autorizado" }

    try {
        await prisma.rifa.update({
            where: { id: rifaId, userId: session.user.id },
            data: { status: RifaStatus.ACTIVE }
        })
        revalidatePath("/dashboard")
        revalidatePath("/dashboard/rifas")
        revalidatePath(`/dashboard/rifas/${rifaId}`)
        return { success: true }
    } catch (error) {
        return { error: "Não foi possível publicar a rifa" }
    }
}

export async function encerrarVendasAction(rifaId: string) {
    const session = await auth()
    if (!session?.user?.id) return { error: "Não autorizado" }

    try {
        await prisma.rifa.update({
            where: { id: rifaId, userId: session.user.id },
            data: { status: RifaStatus.PAUSED }
        })
        revalidatePath(`/dashboard/rifas/${rifaId}`)
        revalidatePath(`/dashboard/rifas/${rifaId}/configuracoes`)
        return { success: true }
    } catch (error) {
        return { error: "Não foi possível encerrar as vendas" }
    }
}

export async function cancelarRifaAction(rifaId: string) {
    const session = await auth()
    if (!session?.user?.id) return { error: "Não autorizado" }

    try {
        const rifa = await prisma.rifa.findUnique({
            where: { id: rifaId, userId: session.user.id }
        })
        if (!rifa) return { error: "Rifa não encontrada" }
        if (rifa.status === "DRAWN") return { error: "Rifas sorteadas não podem ser canceladas" }

        await prisma.rifa.update({
            where: { id: rifaId },
            data: { status: RifaStatus.CANCELLED }
        })
        revalidatePath("/dashboard")
        revalidatePath("/dashboard/rifas")
        revalidatePath(`/dashboard/rifas/${rifaId}`)
        return { success: true }
    } catch (error) {
        return { error: "Não foi possível cancelar a rifa" }
    }
}

export async function deleteRifaAction(rifaId: string) {
    const session = await auth()
    if (!session?.user?.id) return { error: "Não autorizado" }

    try {
        const rifa = await prisma.rifa.findUnique({
            where: { id: rifaId, userId: session.user.id }
        })
        if (!rifa) return { error: "Rifa não encontrada" }
        if (rifa.status === "DRAWN") return { error: "Não é possível excluir uma rifa que já foi sorteada." }

        await prisma.$executeRaw`UPDATE "Rifa" SET status = 'DELETED' WHERE id = ${rifaId}`
        revalidatePath("/dashboard")
        revalidatePath("/dashboard/rifas")
        return { success: true }
    } catch (error) {
        return { error: "Erro ao excluir a rifa." }
    }
}
