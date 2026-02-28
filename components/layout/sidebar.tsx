"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, Ticket, FilePlus, Settings, CreditCard, LogOut, Menu, Diamond, HelpCircle, BarChart3, User } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { signOut } from "next-auth/react"
import { useState, useEffect } from "react"
import { FeedbackModal } from "../dashboard/FeedbackModal"

const navigation = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Minhas Campanhas", href: "/dashboard/rifas", icon: Ticket },
    { name: "Relatórios", href: "/relatorios", icon: BarChart3 },
    { name: "Planos", href: "/assinatura", icon: CreditCard },
    { name: "Perfil", href: "/conta", icon: User },
]

export function Sidebar() {
    const pathname = usePathname()
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

    // Close mobile menu on route change
    useEffect(() => {
        setIsMobileMenuOpen(false)
    }, [pathname])

    return (
        <>
            {/* Mobile top bar */}
            <div className="md:hidden fixed top-0 w-full h-16 border-b bg-white dark:bg-slate-900 z-50 flex items-center px-4 justify-between">
                <Link href="/dashboard" className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white">
                        <Diamond className="h-5 w-5" />
                    </div>
                    <span className="font-bold text-lg text-primary tracking-tight">MyRifa</span>
                </Link>
                <Button variant="ghost" size="icon" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
                    <Menu className="h-6 w-6" />
                </Button>
            </div>

            {/* Sidebar (Desktop + Mobile overlay) */}
            <div
                className={cn(
                    "fixed inset-y-0 left-0 z-40 w-64 bg-white dark:bg-slate-900 border-r border-primary/10 transform transition-transform duration-200 ease-in-out flex flex-col shadow-sm",
                    isMobileMenuOpen ? "translate-x-0 pt-16" : "-translate-x-full md:translate-x-0"
                )}
            >
                <div className="h-20 flex items-center px-6 border-b border-primary/5 hidden md:flex gap-3">
                    <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white shadow-lg shadow-primary/20">
                        <Diamond className="h-6 w-6" />
                    </div>
                    <Link href="/dashboard" className="font-bold text-xl text-primary tracking-tight">
                        MyRifa
                    </Link>
                </div>

                <div className="flex-1 overflow-y-auto py-6 px-4 space-y-2">
                    {navigation.map((item) => {
                        const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href))
                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={cn(
                                    "flex items-center px-4 py-3 text-sm font-semibold rounded-xl transition-all duration-200",
                                    isActive
                                        ? "bg-primary/10 text-primary"
                                        : "text-slate-500 dark:text-slate-400 hover:bg-primary/5 hover:text-primary"
                                )}
                            >
                                <item.icon
                                    className={cn("mr-3 h-5 w-5 flex-shrink-0", isActive ? "text-primary" : "text-slate-500")}
                                    aria-hidden="true"
                                />
                                {item.name}
                            </Link>
                        )
                    })}
                </div>

                <div className="p-4 px-6 mb-2">
                    <div className="bg-primary/5 rounded-2xl p-4 border border-primary/10">
                        <div className="flex items-center gap-2 mb-2">
                            <HelpCircle className="h-4 w-4 text-primary" />
                            <p className="text-[10px] font-bold text-primary uppercase tracking-wider">Suporte</p>
                        </div>
                        <p className="text-xs text-slate-500 mb-3 leading-relaxed">Precisa de ajuda com suas campanhas?</p>
                        <div className="space-y-2">
                            <Button variant="outline" size="sm" className="w-full bg-white dark:bg-slate-800 border-primary/20 text-primary hover:bg-primary hover:text-white transition-all text-[11px] font-bold h-8">
                                Falar com Consultor
                            </Button>
                            <FeedbackModal />
                        </div>
                    </div>
                </div>

                <div className="p-4 border-t border-primary/5 px-6">
                    <Button
                        variant="ghost"
                        onClick={() => signOut({ callbackUrl: "/login" })}
                        className="w-full justify-start text-slate-500 dark:text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl font-semibold transition-colors"
                    >
                        <LogOut className="mr-3 h-5 w-5 text-slate-400 group-hover:text-red-600 transition-colors" />
                        Sair
                    </Button>
                </div>
            </div>

            {/* Mobile Backdrop */}
            {isMobileMenuOpen && (
                <div
                    className="fixed inset-0 bg-black/50 backdrop-blur-sm z-30 md:hidden"
                    onClick={() => setIsMobileMenuOpen(false)}
                />
            )}
        </>
    )
}
