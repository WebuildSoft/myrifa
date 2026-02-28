"use client"

import { useEffect, useState } from "react"
import { Bell, Check, Trash2 } from "lucide-react"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import { getUnreadNotifications, markNotificationAsRead } from "@/actions/notifications"

interface NotificationItem {
    id: string
    title: string
    message: string
    createdAt: Date
}

export function NotificationBell() {
    const [notifications, setNotifications] = useState<NotificationItem[]>([])
    const [isOpen, setIsOpen] = useState(false)

    // Polling function
    const fetchNotifications = async () => {
        try {
            const data = await getUnreadNotifications()
            if (data.items) {
                setNotifications(data.items as any)
            }
        } catch (error) {
            console.error("Failed to fetch notifications")
        }
    }

    // Polling every 15 seconds
    useEffect(() => {
        fetchNotifications() // Initial fetch
        const intervalId = setInterval(fetchNotifications, 15000)
        return () => clearInterval(intervalId)
    }, [])

    const handleMarkAsRead = async (id: string) => {
        // Optimistic UI update
        setNotifications(prev => prev.filter(n => n.id !== id))
        await markNotificationAsRead(id)
    }

    const handleMarkAllAsRead = async () => {
        const ids = notifications.map(n => n.id)
        setNotifications([]) // Clear UI immediately
        for (const id of ids) {
            await markNotificationAsRead(id)
        }
    }

    const hasUnread = notifications.length > 0

    return (
        <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
            <DropdownMenuTrigger asChild>
                <button className="relative p-2 text-slate-500 hover:text-primary transition-colors group outline-none">
                    <Bell className="h-5 w-5" />
                    {hasUnread && (
                        <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-slate-900 animate-pulse"></span>
                    )}
                </button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-80 max-h-96 overflow-y-auto">
                <div className="flex items-center justify-between px-4 py-2">
                    <DropdownMenuLabel className="p-0 font-bold text-base">Notificações</DropdownMenuLabel>
                    {hasUnread && (
                        <button
                            onClick={(e) => { e.preventDefault(); handleMarkAllAsRead(); }}
                            className="text-xs text-primary hover:underline font-medium"
                        >
                            Limpar todas
                        </button>
                    )}
                </div>
                <DropdownMenuSeparator />

                {!hasUnread ? (
                    <div className="py-8 text-center flex flex-col items-center justify-center text-slate-400">
                        <Bell className="h-8 w-8 mb-2 opacity-20" />
                        <p className="text-sm">Nenhuma notificação nova.</p>
                    </div>
                ) : (
                    <div className="flex flex-col gap-1 p-1">
                        {notifications.map((notif) => (
                            <DropdownMenuItem
                                key={notif.id}
                                className="flex flex-col items-start gap-1 p-3 cursor-default focus:bg-slate-50 dark:focus:bg-slate-800"
                            >
                                <div className="flex items-start justify-between w-full gap-2">
                                    <h4 className="font-semibold text-sm line-clamp-1">{notif.title}</h4>
                                    <button
                                        onClick={(e) => { e.preventDefault(); handleMarkAsRead(notif.id); }}
                                        className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 p-0.5 rounded-md shrink-0"
                                        title="Marcar como lida"
                                    >
                                        <Check className="h-4 w-4" />
                                    </button>
                                </div>
                                <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                                    {notif.message}
                                </p>
                                <span className="text-[10px] text-slate-400 mt-1 font-medium">
                                    {new Date(notif.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>
                            </DropdownMenuItem>
                        ))}
                    </div>
                )}
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
