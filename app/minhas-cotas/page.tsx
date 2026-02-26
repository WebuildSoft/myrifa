"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Ticket, Search, ArrowLeft, TicketCheck, Phone, Mail, Loader2 } from "lucide-react"

export default function MinhasCotasPage() {
    const [isLoading, setIsLoading] = useState(false)
    const [search, setSearch] = useState("")

    const handleSearch = () => {
        if (!search) return
        setIsLoading(true)
        // Simulation... this will later connect to a server action
        setTimeout(() => setIsLoading(false), 2000)
    }

    return (
        <div className="min-h-screen bg-[#fcfcfd] dark:bg-[#0f0a19] text-slate-900 dark:text-slate-100 font-sans">
            {/* Header / Nav */}
            <nav className="fixed top-0 w-full z-50 bg-white/70 dark:bg-[#0f0a19]/70 backdrop-blur-xl border-b border-primary/5 px-6 md:px-12 py-4">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-2 group">
                        <Button variant="ghost" size="icon" className="rounded-full mr-2">
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                        <span className="text-xl font-black tracking-tighter uppercase italic">
                            My<span className="text-primary">Rifa</span>
                        </span>
                    </Link>
                </div>
            </nav>

            <main className="pt-32 pb-20 px-6">
                <div className="max-w-2xl mx-auto space-y-12">
                    <div className="text-center space-y-4">
                        <div className="size-16 bg-primary/10 text-primary rounded-3xl flex items-center justify-center mx-auto mb-6">
                            <TicketCheck className="h-10 w-10 text-primary" />
                        </div>
                        <h1 className="text-4xl font-black tracking-tight text-slate-900 dark:text-white">Localizar minhas cotas</h1>
                        <p className="text-slate-500 dark:text-slate-400 font-medium max-w-sm mx-auto">
                            Insira os dados que você usou na compra para ver seus números e status de pagamento.
                        </p>
                    </div>

                    <div className="bg-white dark:bg-slate-800/50 p-8 md:p-12 rounded-[2.5rem] border border-primary/5 shadow-xl shadow-primary/5 space-y-8">
                        <div className="space-y-4">
                            <div className="relative group">
                                <div className="absolute left-5 top-1/2 -translate-y-1/2 flex items-center gap-3 text-slate-400 group-focus-within:text-primary transition-colors">
                                    <Mail className="h-5 w-5" />
                                    <div className="w-px h-4 bg-slate-200 dark:bg-slate-700"></div>
                                </div>
                                <Input
                                    placeholder="E-mail ou Telefone (com DDD)"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="h-16 pl-16 rounded-2xl border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 focus:ring-primary/20 text-lg font-medium"
                                />
                            </div>

                            <Button
                                onClick={handleSearch}
                                disabled={isLoading || !search}
                                className="w-full h-16 bg-primary hover:bg-primary/90 text-white rounded-2xl text-lg font-black uppercase tracking-widest shadow-xl shadow-primary/20 flex items-center justify-center gap-3 transition-all active:scale-[0.98]"
                            >
                                {isLoading ? (
                                    <Loader2 className="h-6 w-6 animate-spin" />
                                ) : (
                                    <>
                                        <Search className="h-6 w-6" />
                                        Buscar Cotas
                                    </>
                                )}
                            </Button>
                        </div>

                        <div className="pt-8 border-t border-slate-50 dark:border-slate-800 flex flex-col gap-4">
                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 text-center">Precisa de suporte?</p>
                            <div className="flex justify-center gap-4">
                                <Button variant="outline" className="rounded-xl border-primary/10 text-primary hover:bg-primary/5 h-10 px-6 font-bold text-xs">
                                    <Phone className="h-4 w-4 mr-2" /> WhatsApp
                                </Button>
                                <Button variant="outline" className="rounded-xl border-primary/10 text-primary hover:bg-primary/5 h-10 px-6 font-bold text-xs">
                                    <Mail className="h-4 w-4 mr-2" /> E-mail
                                </Button>
                            </div>
                        </div>
                    </div>

                    {/* How it works info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="p-6 bg-emerald-500/5 rounded-2xl border border-emerald-500/10 space-y-2">
                            <h4 className="font-black text-emerald-600 dark:text-emerald-400 text-sm flex items-center gap-2">
                                <div className="size-2 bg-emerald-500 rounded-full"></div>
                                Pagamento Confirmado
                            </h4>
                            <p className="text-xs text-slate-500 font-medium">Se o seu pagamento já foi processado, seus números aparecerão como **PAGOS** imediatamente.</p>
                        </div>
                        <div className="p-6 bg-blue-500/5 rounded-2xl border border-blue-500/10 space-y-2">
                            <h4 className="font-black text-blue-600 dark:text-blue-400 text-sm flex items-center gap-2">
                                <div className="size-2 bg-blue-500 rounded-full"></div>
                                Segunda Via de PIX
                            </h4>
                            <p className="text-xs text-slate-500 font-medium">Reservas pendentes terão o link para o PIX Copia e Cola disponível para finalizar a compra.</p>
                        </div>
                    </div>
                </div>
            </main>

            <footer className="py-12 border-t border-primary/5 text-center px-6 mt-12">
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                    © 2024 MyRifa • Consulta Segura e Criptografada
                </p>
            </footer>
        </div>
    )
}
