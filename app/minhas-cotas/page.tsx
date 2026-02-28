"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Ticket, Search, ArrowLeft, TicketCheck, Phone, Mail, Loader2, AlertCircle } from "lucide-react"
import { searchBuyerOrders } from "@/actions/buyer/search"
import { OrderCard } from "@/components/buyer/OrderCard"

export default function MinhasCotasPage() {
    const [isLoading, setIsLoading] = useState(false)
    const [search, setSearch] = useState("")
    const [error, setError] = useState<string | null>(null)
    const [transactions, setTransactions] = useState<any[]>([])
    const [hasSearched, setHasSearched] = useState(false)

    const handleSearch = async () => {
        if (!search) return

        setIsLoading(true)
        setError(null)
        setHasSearched(false)

        try {
            const result = await searchBuyerOrders(search)

            if (result.error) {
                setError(result.error)
                setTransactions([])
            } else if (result.success && result.transactions) {
                setTransactions(result.transactions)
            }
        } catch (err) {
            setError("Erro de conexão. Tente novamente.")
            setTransactions([])
        } finally {
            setIsLoading(false)
            setHasSearched(true)
        }
    }

    // Allow search on Enter key
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleSearch()
        }
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
                    {/* Hero Section */}
                    {!hasSearched || transactions.length === 0 ? (
                        <div className="text-center space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <div className="size-16 bg-primary/10 text-primary rounded-3xl flex items-center justify-center mx-auto mb-6">
                                <TicketCheck className="h-10 w-10 text-primary" />
                            </div>
                            <h1 className="text-4xl font-black tracking-tight text-slate-900 dark:text-white">Localizar minhas cotas</h1>
                            <p className="text-slate-500 dark:text-slate-400 font-medium max-w-sm mx-auto">
                                Insira os dados que você usou na compra para ver seus números e status de pagamento.
                            </p>
                        </div>
                    ) : (
                        <div className="flex items-center gap-4 animate-in fade-in duration-300">
                            <div className="size-12 bg-primary/10 text-primary rounded-2xl flex items-center justify-center shrink-0">
                                <TicketCheck className="h-6 w-6 text-primary" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">Suas Compras</h1>
                                <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">
                                    Encontramos {transactions.length} transações vinculadas a você.
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Search Box */}
                    <div className="bg-white dark:bg-slate-800/50 p-6 md:p-8 rounded-[2rem] border border-primary/5 shadow-xl shadow-primary/5 space-y-6">
                        <div className="space-y-4">
                            <div className="relative group">
                                <div className="absolute left-5 top-1/2 -translate-y-1/2 flex items-center gap-3 text-slate-400 group-focus-within:text-primary transition-colors">
                                    <Phone className="h-5 w-5" />
                                    <div className="w-px h-4 bg-slate-200 dark:bg-slate-700"></div>
                                </div>
                                <Input
                                    placeholder="E-mail ou Telefone (com DDD)..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                    className="h-16 pl-16 rounded-2xl border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 focus:ring-primary/20 text-lg font-medium shadow-sm transition-shadow focus:bg-white"
                                />
                            </div>

                            <Button
                                onClick={handleSearch}
                                disabled={isLoading || !search}
                                className="w-full h-14 bg-primary hover:bg-primary/90 text-white rounded-xl text-lg font-black tracking-wide shadow-lg shadow-primary/20 flex items-center justify-center gap-3 transition-all active:scale-[0.98]"
                            >
                                {isLoading ? (
                                    <Loader2 className="h-6 w-6 animate-spin" />
                                ) : (
                                    <>
                                        <Search className="h-5 w-5" />
                                        Buscar Cotas
                                    </>
                                )}
                            </Button>
                        </div>

                        {/* Error State */}
                        {error && (
                            <div className="p-4 bg-red-50 dark:bg-red-950/30 border border-red-100 dark:border-red-900/50 rounded-xl flex items-start gap-3 animate-in shake">
                                <AlertCircle className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
                                <p className="text-red-600 dark:text-red-400 text-sm font-medium">{error}</p>
                            </div>
                        )}
                    </div>

                    {/* Results List */}
                    {hasSearched && transactions.length > 0 && (
                        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-8 duration-500">
                            {transactions.map((tx) => (
                                <OrderCard key={tx.id} transaction={tx} />
                            ))}
                        </div>
                    )}

                    {/* How it works info (Only show initially) */}
                    {(!hasSearched || transactions.length === 0) && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in duration-700 delay-150">
                            <div className="p-6 bg-emerald-50 dark:bg-emerald-500/5 rounded-2xl border border-emerald-100 dark:border-emerald-500/10 space-y-2">
                                <h4 className="font-black text-emerald-600 dark:text-emerald-400 text-sm flex items-center gap-2">
                                    <div className="size-2 bg-emerald-500 rounded-full"></div>
                                    Pagamento Confirmado
                                </h4>
                                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Se o seu pagamento já foi processado, os seus **números da sorte** aparecerão visíveis imediatamente.</p>
                            </div>
                            <div className="p-6 bg-blue-50 dark:bg-blue-500/5 rounded-2xl border border-blue-100 dark:border-blue-500/10 space-y-2">
                                <h4 className="font-black text-blue-600 dark:text-blue-400 text-sm flex items-center gap-2">
                                    <div className="size-2 bg-blue-500 rounded-full"></div>
                                    Segunda Via de PIX
                                </h4>
                                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Reservas pendentes terão o link para o PIX Copia e Cola disponível para você finalizar a compra a tempo.</p>
                            </div>
                        </div>
                    )}
                </div>
            </main>

            <footer className="py-12 border-t border-primary/5 text-center px-6 mt-12 bg-white/50 dark:bg-slate-900/50">
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                    © 2024 MyRifa • Consulta Segura e Criptografada
                </p>
            </footer>
        </div>
    )
}
