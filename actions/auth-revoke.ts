"use server"

import { redis } from "@/lib/redis"
import { auth } from "@/auth"

/**
 * Destrói a Sessão Híbrida de um usuário imediatamente no Redis.
 * Todos os dispositivos dele serão deslogados no próximo click (Request).
 */
export async function revokeUserSession(userId: string) {
    const session = await auth()

    // Apenas Admins podem derrubar outros ou o próprio usuário pode se deslogar de todos os cantos.
    if (!session?.user || (session.user.role !== "ADMIN" && session.user.role !== "SUPER_ADMIN" && session.user.id !== userId)) {
        throw new Error("Unauthorized to revoke global sessions.")
    }

    try {
        await redis.del(`session:${userId}`)
        console.log(`[AUTH] Globally revoked session for User ID: ${userId}`)
        return { success: true }
    } catch (error) {
        console.error("Failed to revoke session in Redis:", error)
        return { success: false, error: "Fail to connect caching layer." }
    }
}
