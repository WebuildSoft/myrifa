"use client"

import { useState, useEffect } from "react"
import { auth } from "@/auth"
import { redirect } from "next/navigation"
import AdminSidebar from "@/components/admin/AdminSidebar"
import { Menu, X, ShieldCheck } from "lucide-react"

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(true)
    const [session, setSession] = useState<any>(null)

    useEffect(() => {
        async function checkAuth() {
            const res = await fetch("/api/auth/session")
            const data = await res.json()

            const isLogin = window.location.pathname.includes("/sistema-x7k2/login")

            if (!data?.user && !isLogin) {
                window.location.href = "/sistema-x7k2/login"
                return
            }

            setSession(data)
            setIsLoading(false)
        }
        checkAuth()
    }, [])

    const isLoginPage = typeof window !== 'undefined' && window.location.pathname.includes("/sistema-x7k2/login")

    if (isLoading && !isLoginPage) {
        return <div className="h-screen w-full bg-[#020617] flex items-center justify-center">
            <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
        </div>
    }

    if (isLoginPage) {
        return <>{children}</>
    }

    return (
        <div className="dark min-h-screen bg-[#020617] text-slate-100 antialiased selection:bg-indigo-500/30 overflow-x-hidden" style={{ colorScheme: 'dark' }}>
            {/* Critical Background Force */}
            <div className="fixed inset-0 bg-[#020617] -z-50" />

            {/* Ambient background glow */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] rounded-full bg-indigo-500/20 blur-[120px]" />
                <div className="absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] rounded-full bg-violet-500/20 blur-[120px]" />
            </div>

            <div className="flex h-screen overflow-hidden">
                <AdminSidebar
                    user={session?.user}
                    isOpen={isSidebarOpen}
                    onClose={() => setIsSidebarOpen(false)}
                />

                <main className="relative z-10 flex-1 flex flex-col h-screen overflow-hidden">
                    {/* Global Top Bar */}
                    <header className="h-20 flex items-center justify-between px-6 lg:px-10 border-b border-white/[0.1] shrink-0 bg-[#020617]/80 backdrop-blur-xl">
                        <div className="flex items-center space-x-4">
                            {/* Mobile Toggle */}
                            <button
                                onClick={() => setIsSidebarOpen(true)}
                                className="lg:hidden p-2.5 rounded-xl bg-white/[0.05] border border-white/[0.1] text-white hover:bg-white/[0.1] transition-all active:scale-95"
                            >
                                <Menu className="h-6 w-6" />
                            </button>

                            <div className="flex items-center space-x-3 bg-white/[0.05] border border-white/[0.1] px-4 py-2 rounded-full">
                                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_12px_rgba(16,185,129,0.8)]" />
                                <span className="text-[10px] font-black text-white uppercase tracking-[0.2em] hidden sm:inline-block">Infraestrutura Operacional</span>
                                <span className="text-[10px] font-black text-white uppercase tracking-[0.2em] sm:hidden">Online</span>
                            </div>
                        </div>

                        <div className="flex items-center space-x-6">
                            <div className="text-right hidden sm:block">
                                <p className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.2em]">Console Administrativo</p>
                                <p className="text-xs font-mono text-white font-bold">{new Date().toLocaleTimeString('pt-BR')}</p>
                            </div>
                            {/* Compact Brand for mobile header */}
                            <div className="lg:hidden p-2 rounded-lg bg-indigo-500/10 border border-indigo-500/20">
                                <ShieldCheck className="h-5 w-5 text-indigo-400" />
                            </div>
                        </div>
                    </header>

                    <div className="flex-1 overflow-y-auto custom-scrollbar px-4 sm:px-6 md:px-10 py-10 bg-transparent">
                        <div className="max-w-7xl mx-auto">
                            {children}
                        </div>
                    </div>
                </main>
            </div>
        </div>
    )
}
