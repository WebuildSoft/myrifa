"use server"

import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"

// Buscar notificações não lidas
export async function getUnreadNotifications() {
    try {
        const session = await auth()
        if (!session?.user?.id) return { items: [] }

        const notifications = await prisma.notification.findMany({
            where: {
                userId: session.user.id,
                read: false
            },
            orderBy: {
                createdAt: "desc"
            },
            take: 10
        })

        return { items: notifications }
    } catch (error) {
        console.error("Failed to fetch notifications:", error)
        return { items: [] }
    }
}

// Marcar notificação como lida
export async function markNotificationAsRead(id: string) {
    try {
        const session = await auth()
        if (!session?.user?.id) return { success: false }

        await prisma.notification.update({
            where: {
                id,
                userId: session.user.id // garante que só o dono apaga
            },
            data: { read: true }
        })

        return { success: true }
    } catch {
        return { success: false }
    }
}
