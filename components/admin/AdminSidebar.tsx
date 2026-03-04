"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
    LayoutDashboard,
    Users,
    MessageSquare,
    BarChart3,
    Settings,
    LogOut,
    ShieldCheck,
    Ticket,
    ChevronLeft,
    ChevronRight,
    Search,
    Server,
    X
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

import { signOut } from "next-auth/react"

interface AdminSidebarProps {
    user: {
        name: string | null
        role: string
    }
    isOpen?: boolean
    onClose?: () => void
}

export default function AdminSidebar({ user, isOpen, onClose }: AdminSidebarProps) {
    const [isCollapsed, setIsCollapsed] = useState(false)
    const pathname = usePathname()

    const handleLogout = async () => {
        await signOut({ callbackUrl: "/sistema-x7k2/login" })
    }

    // Handle mobile auto-close on navigate
    useEffect(() => {
        if (isOpen && onClose) {
            onClose()
        }
    }, [pathname])

    const navigation = [
        { name: "Dashboard", href: "/sistema-x7k2/dashboard", icon: LayoutDashboard },
        { name: "Usuários", href: "/sistema-x7k2/usuarios", icon: Users },
        { name: "Rifas", href: "/sistema-x7k2/rifas", icon: Ticket },
        { name: "WhatsApp", href: "/sistema-x7k2/whatsapp", icon: MessageSquare },
        { name: "Analytics", href: "/sistema-x7k2/analytics", icon: BarChart3 },
        { name: "Logs", href: "/sistema-x7k2/logs", icon: Server },
        { name: "Configurações", href: "/sistema-x7k2/config", icon: Settings },
    ]

    return (
        <>
            {/* Mobile Backdrop */}
            {isOpen && (
                <div
                    className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden animate-in fade-in duration-300"
                    onClick={onClose}
                />
            )}

            <aside
                className={cn(
                    "fixed inset-y-0 left-0 z-50 flex flex-col border-r border-white/[0.05] bg-[#020617]/95 backdrop-blur-2xl transition-all duration-500 ease-in-out lg:relative lg:z-30 h-screen overflow-hidden",
                    isCollapsed ? "w-20" : "w-72",
                    isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
                )}
            >
                {/* Mobile Close Button */}
                {isOpen && (
                    <button
                        onClick={onClose}
                        className="lg:hidden absolute right-4 top-4 z-50 p-2 rounded-xl bg-white/[0.03] border border-white/[0.05] text-slate-300 hover:text-white transition-colors"
                    >
                        <X className="h-6 w-6" />
                    </button>
                )}

                {/* Collapse Toggle Button (Desktop only) */}
                <button
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    className="absolute right-[-12px] top-10 z-40 hidden lg:flex h-6 w-6 items-center justify-center rounded-full bg-indigo-500 text-white shadow-lg shadow-indigo-500/20 hover:scale-110 transition-transform active:scale-95 border border-white/10"
                >
                    {isCollapsed ? <ChevronRight className="h-3 w-3" /> : <ChevronLeft className="h-3 w-3" />}
                </button>

                {/* Logo Section */}
                <div className={cn(
                    "flex h-24 items-center transition-all duration-300",
                    isCollapsed ? "justify-center px-0" : "px-6"
                )}>
                    <div className="flex items-center gap-3 group cursor-default">
                        <Ticket className={cn(
                            "text-primary rotate-12 transition-transform group-hover:scale-110",
                            isCollapsed ? "h-7 w-7" : "h-8 w-8"
                        )} />
                        {!isCollapsed && (
                            <div className="flex flex-col animate-in fade-in slide-in-from-left-2 duration-300">
                                <span className="text-xl font-black tracking-tight text-slate-900 dark:text-white">
                                    My<span className="text-primary">Rifa</span>
                                </span>
                                <span className="text-[9px] uppercase font-black tracking-[0.2em] text-slate-400">
                                    Admin Panel
                                </span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Navigation Section */}
                <div className="flex-1 overflow-y-auto custom-scrollbar px-4 py-6 space-y-8">
                    <div className="space-y-1.5">
                        {!isCollapsed && (
                            <p className="px-4 text-xs font-black uppercase tracking-[0.3em] text-slate-600 pb-2 animate-in fade-in duration-500">
                                Menu Principal
                            </p>
                        )}
                        {navigation.map((item) => {
                            const isActive = pathname === item.href
                            return (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className={cn(
                                        "group flex items-center rounded-xl transition-all duration-300 relative py-3.5",
                                        isCollapsed ? "justify-center px-0" : "px-4",
                                        isActive
                                            ? "bg-indigo-500/10 text-white border border-indigo-500/20 shadow-[0_0_15px_rgba(99,102,241,0.05)]"
                                            : "text-slate-400 hover:bg-white/[0.03] hover:text-slate-200 border border-transparent"
                                    )}
                                    title={isCollapsed ? item.name : ""}
                                >
                                    <item.icon className={cn(
                                        "h-5 w-5 shrink-0 transition-transform duration-300 group-hover:scale-110",
                                        isActive ? "text-indigo-400" : "text-slate-500"
                                    )} />

                                    {!isCollapsed && (
                                        <span className={cn(
                                            "ml-3 font-bold text-xs uppercase tracking-widest transition-all duration-300 group-hover:translate-x-1 whitespace-nowrap overflow-hidden",
                                            isActive ? "opacity-100" : "opacity-80"
                                        )}>
                                            {item.name}
                                        </span>
                                    )}

                                    {isActive && (
                                        <div className="absolute left-0 w-1 h-5 bg-indigo-500 rounded-r-full shadow-[0_0_10px_rgba(99,102,241,0.5)]" />
                                    )}
                                </Link>
                            )
                        })}
                    </div>
                </div>

                {/* User Profile / Footer */}
                <div className={cn(
                    "p-4 border-t border-white/[0.05] transition-all duration-300",
                    isCollapsed ? "items-center" : ""
                )}>
                    <div className={cn(
                        "rounded-2xl transition-all duration-300 group/user",
                        isCollapsed
                            ? "bg-transparent border-transparent p-0"
                            : "bg-white/[0.02] border border-white/[0.05] p-4 hover:bg-white/[0.04]"
                    )}>
                        <div className={cn(
                            "flex items-center transition-all duration-300",
                            isCollapsed ? "justify-center mb-0" : "space-x-3 mb-4"
                        )}>
                            <div className="h-10 w-10 shrink-0 rounded-xl bg-gradient-to-tr from-indigo-500/20 to-violet-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 font-black shadow-inner">
                                {user.name?.[0]?.toUpperCase() || 'A'}
                            </div>
                            {!isCollapsed && (
                                <div className="flex flex-col min-w-0 animate-in fade-in slide-in-from-left-2">
                                    <p className="text-xs font-black truncate text-white uppercase tracking-tight">
                                        {user.name}
                                    </p>
                                    <p className="text-xs font-bold text-indigo-400/80 uppercase tracking-widest italic">
                                        {user.role}
                                    </p>
                                </div>
                            )}
                        </div>

                        <button
                            onClick={handleLogout}
                            className={cn(
                                "flex items-center justify-center rounded-xl bg-red-500/10 text-red-500 font-black uppercase tracking-widest transition-all active:scale-95 group/logout",
                                isCollapsed ? "h-10 w-10 p-0 mt-4" : "w-full px-4 py-3 text-xs mt-0 hover:bg-red-500 text-red-400 hover:text-white"
                            )}
                            title="Sair"
                        >
                            <LogOut className={cn(
                                "shrink-0 transition-transform duration-300 group-hover/logout:-translate-x-0.5",
                                isCollapsed ? "h-5 w-5" : "h-3.5 w-3.5 mr-2"
                            )} />
                            {!isCollapsed && "Sair"}
                        </button>
                    </div>
                </div>
            </aside>
        </>
    )
}
