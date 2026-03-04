"use server"

import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"
import { revalidatePath } from "next/cache"
import { AdminRole } from "@prisma/client"

/**
 * Utility to log administrative actions
 */
async function logAdminAction(userId: string, action: string, resource?: string) {
    try {
        await (prisma as any).adminLog.create({
            data: {
                userId,
                action,
                resource,
                // IP and User Agent should ideally be passed from the caller if available
            }
        })
    } catch (error) {
        console.error("[AdminLog] Error:", error)
    }
}

/**
 * Updates a user's administrative role
 * Only SUPER_ADMIN can perform this for other admins
 */
export async function updateUserRoleAction(targetUserId: string, newRole: AdminRole) {
    const session = await auth()

    if (!session || session.user.role !== "SUPER_ADMIN") {
        return { error: "Apenas Super Admins podem alterar cargos." }
    }

    try {
        const updated = await prisma.user.update({
            where: { id: targetUserId },
            data: { role: newRole }
        })

        await logAdminAction(session.user.id, `UPDATE_ROLE`, `User:${targetUserId} to ${newRole}`)

        revalidatePath("/sistema-x7k2/usuarios")
        return { success: true, user: updated }
    } catch (error) {
        return { error: "Erro ao atualizar cargo." }
    }
}

/**
 * Toggles user blocked status
 */
export async function toggleUserStatusAction(targetUserId: string, block: boolean) {
    const session = await auth()

    if (!session || !["SUPER_ADMIN", "ADMIN"].includes(session.user.role)) {
        return { error: "Sem permissão para bloquear/desbloquear usuários." }
    }

    try {
        const updated = await prisma.user.update({
            where: { id: targetUserId },
            data: { isBlocked: block }
        })

        await logAdminAction(session.user.id, block ? `BLOCK_USER` : `UNBLOCK_USER`, `User:${targetUserId}`)

        revalidatePath("/sistema-x7k2/usuarios")
        return { success: true, user: updated }
    } catch (error) {
        return { error: "Erro ao atualizar status do usuário." }
    }
}

/**
 * Deletes a user (SOFT DELETE or hard depending on policy)
 * For safety, we'll implement logic to prevent deleting yourself
 */
export async function deleteUserAction(targetUserId: string) {
    const session = await auth()

    if (!session || session.user.role !== "SUPER_ADMIN") {
        return { error: "Apenas Super Admins podem remover usuários." }
    }

    if (session.user.id === targetUserId) {
        return { error: "Você não pode remover sua própria conta." }
    }

    try {
        // Primeiro deletamos as rifas (isso lida com FK no nível do BD ou manual se necessário)
        // No nosso schema, precisamos garantir que as rifas sejam removidas primeiro
        await prisma.rifa.deleteMany({
            where: { userId: targetUserId }
        })

        await prisma.user.delete({
            where: { id: targetUserId }
        })

        await logAdminAction(session.user.id, `DELETE_USER`, `User:${targetUserId}`)

        revalidatePath("/sistema-x7k2/usuarios")
        return { success: true }
    } catch (error) {
        console.error("[DeleteUserError]", error)
        return { error: "Erro ao remover usuário. Certifique-se de que todas as dependências foram tratadas." }
    }
}
