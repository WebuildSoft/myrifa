"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { supabase } from "@/lib/supabase"
import { Sparkles, ChevronRight, Ticket } from "lucide-react"

type NumberData = {
    id: string
    number: number
    status: "AVAILABLE" | "RESERVED" | "PAID"
}

const SHAPE_MAP = {
    CIRCLE: "rounded-full",
    HEART: "[clip-path:path('M12,21.35L10.55,20.03C5.4,15.36,2,12.27,2,8.5C2,5.41,4.41,3,7.5,3C9.24,3,10.91,3.81,12,5.08C13.09,3.81,14.76,3,16.5,3C19.59,3,22,5.41,22,8.5C22,12.27,18.6,15.36,13.45,20.03L12,21.35Z')]",
    STAR: "[clip-path:polygon(50%_0%,61%_35%,98%_35%,68%_57%,79%_91%,50%_70%,21%_91%,32%_57%,2%_35%,39%_35%)]",
    HEXAGON: "[clip-path:polygon(25%_0%,75%_0%,100%_50%,75%_100%,25%_100%,0%_50%)]",
    DIAMOND: "[clip-path:polygon(50%_0%,100%_50%,50%_100%,0%_50%)]",
    SHIELD: "[clip-path:polygon(50%_0%,100%_20%,100%_70%,50%_100%,0%_70%,0%_20%)]",
    FLOWER: "rounded-3xl rotate-45", // simplistic flower
} as const

interface NumberGridProps {
    rifaId: string
    numbers: NumberData[]
    price: number
    currencyFormatted: string
    maxPerBuyer?: number | null
    balloonShape?: keyof typeof SHAPE_MAP
    primaryColor?: string | null
    rifaTitle?: string
    rifaCover?: string | null
}

export function NumberGrid({
    rifaId,
    numbers,
    price,
    currencyFormatted,
    maxPerBuyer,
    balloonShape = "CIRCLE",
    primaryColor,
    rifaTitle,
    rifaCover,
}: NumberGridProps) {
    const router = useRouter()
    const [gridNumbers, setGridNumbers] = useState<NumberData[]>(numbers)
    const [selectedNumbers, setSelectedNumbers] = useState<number[]>([])

    const handleGoToCheckout = () => {
        const data = {
            rifaId,
            rifaTitle: rifaTitle ?? "",
            rifaCover: rifaCover ?? null,
            rifaSlug: window.location.pathname.split("/r/")[1] ?? "",
            numbers: selectedNumbers,
            price,
        }
        sessionStorage.setItem(`checkout_${rifaId}`, JSON.stringify(data))
        router.push(`/checkout/${rifaId}`)
    }

    // Realtime subscription
    useEffect(() => {
        const channel = supabase
            .channel('rifa-numbers')
            .on(
                'postgres_changes',
                {
                    event: 'UPDATE',
                    schema: 'public',
                    table: 'RifaNumber',
                    filter: `rifaId=eq.${rifaId}`
                },
                (payload) => {
                    const updated = payload.new as any
                    setGridNumbers(prev => prev.map(n =>
                        n.number === updated.number ? { ...n, status: updated.status } : n
                    ))

                    // Remove from selection if it's no longer available
                    if (updated.status !== 'AVAILABLE') {
                        setSelectedNumbers(prev => prev.filter(num => num !== updated.number))
                    }
                }
            )
            .subscribe()

        return () => {
            supabase.removeChannel(channel)
        }
    }, [rifaId])

    const toggleNumber = (num: number, status: "AVAILABLE" | "RESERVED" | "PAID") => {
        if (status !== "AVAILABLE") return

        setSelectedNumbers((prev) => {
            if (prev.includes(num)) {
                return prev.filter(n => n !== num)
            }
            if (maxPerBuyer && prev.length >= maxPerBuyer) {
                // You could show a toast here in the future
                return prev
            }
            return [...prev, num]
        })
    }

    const selectRandom = (amount: number) => {
        const available = numbers
            .filter(n => n.status === "AVAILABLE" && !selectedNumbers.includes(n.number))
            .map(n => n.number)

        // Shuffle array
        for (let i = available.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [available[i], available[j]] = [available[j], available[i]]
        }

        const toSelect = available.slice(0, maxPerBuyer ? Math.min(amount, maxPerBuyer - selectedNumbers.length) : amount)
        setSelectedNumbers(prev => [...prev, ...toSelect])
    }

    return (
        <div className="space-y-6">
            {/* Quick Select Buttons */}
            <div className="bg-slate-50 dark:bg-slate-700/30 p-6 rounded-2xl border border-slate-100 dark:border-slate-700 space-y-4">
                <div className="flex items-center gap-2 mb-2">
                    <Sparkles className="w-4 h-4 text-primary" />
                    <h3 className="font-black text-xs uppercase tracking-widest text-slate-500 dark:text-slate-400">Seleção Rápida</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                    {[1, 5, 10, 25, 50].map((amount) => (
                        <button
                            key={amount}
                            onClick={() => selectRandom(amount)}
                            className="flex-1 min-w-[60px] h-10 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-black hover:border-primary hover:text-primary transition-all active:scale-95 shadow-sm"
                        >
                            +{amount}
                        </button>
                    ))}
                    <button
                        onClick={() => selectRandom(1)}
                        className="flex-[2] min-w-[120px] h-10 bg-primary text-white rounded-xl text-sm font-black shadow-lg shadow-primary/20 hover:brightness-110 transition-all active:scale-95 flex items-center justify-center gap-2"
                    >
                        🍀 Quero sorte!
                    </button>
                </div>
            </div>

            {/* Grid Status Legend */}
            <div className="flex flex-wrap justify-center gap-6 py-2">
                {[
                    { color: "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700", label: "Livre" },
                    { color: "bg-primary border-primary shadow-lg shadow-primary/20", label: "Selec." },
                    { color: "bg-yellow-400 border-yellow-500", label: "Reserv." },
                    { color: "bg-green-500 border-green-600", label: "Pago" }
                ].map((item, i) => (
                    <div key={i} className="flex items-center gap-2">
                        <div className={cn("w-4 h-4 rounded-md border", item.color)}></div>
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">{item.label}</span>
                    </div>
                ))}
            </div>

            <div className="p-1 bg-slate-50/50 dark:bg-slate-900/50 rounded-2xl border border-slate-100 dark:border-slate-800">
                <div className="grid grid-cols-5 md:grid-cols-8 lg:grid-cols-10 gap-2 max-h-[400px] overflow-y-auto p-1">
                    {gridNumbers.map((n) => {
                        const isSelected = selectedNumbers.includes(n.number)
                        return (
                            <button
                                key={n.id}
                                onClick={() => toggleNumber(n.number, n.status)}
                                disabled={n.status !== "AVAILABLE"}
                                className={cn(
                                    "relative flex items-center justify-center font-bold text-sm h-10 w-full transition-all",
                                    "border disabled:cursor-not-allowed",
                                    SHAPE_MAP[balloonShape],
                                    n.status === "AVAILABLE" && !isSelected && "bg-white border-gray-300 text-gray-700 hover:border-gray-400",
                                    isSelected && "text-white shadow-md transform scale-110 z-10 border-transparent",
                                    n.status === "RESERVED" && "bg-yellow-400 border-yellow-500 text-yellow-900 opacity-80",
                                    n.status === "PAID" && "bg-green-500 border-green-600 text-white opacity-80 decoration-2 underline-offset-2"
                                )}
                                style={{
                                    backgroundColor: isSelected ? (primaryColor || 'var(--primary)') : undefined,
                                    color: (isSelected || n.status === "PAID") ? 'white' : undefined
                                }}
                            >
                                <span className={cn(
                                    n.status === "PAID" && "line-through",
                                    balloonShape === "FLOWER" && "-rotate-45"
                                )}>
                                    {n.number.toString().padStart(2, '0')}
                                </span>
                            </button>
                        )
                    })}
                </div>
            </div>

            {/* Sticky Bottom Actions */}
            {selectedNumbers.length > 0 && (
                <div className="fixed bottom-0 left-0 right-0 p-4 pb-8 bg-white/90 dark:bg-slate-900/90 backdrop-blur-lg border-t border-primary/10 shadow-[0_-10px_30px_rgba(0,0,0,0.1)] z-50 animate-in fade-in slide-in-from-bottom-5">
                    <div className="max-w-xl mx-auto flex items-center justify-between gap-6">
                        <div className="flex flex-col">
                            <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-0.5">
                                <span className="text-primary">{selectedNumbers.length}</span> selecionado{selectedNumbers.length > 1 ? "s" : ""}
                            </p>
                            <p className="text-2xl font-black text-slate-900 dark:text-white tracking-tighter">
                                Total: {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(selectedNumbers.length * price)}
                            </p>
                        </div>
                        <button
                            onClick={handleGoToCheckout}
                            className="bg-primary hover:bg-primary/90 text-white px-8 py-4 rounded-2xl font-black text-sm flex items-center gap-2 transition-all active:scale-95 shadow-xl shadow-primary/30"
                        >
                            Comprar Agora
                            <ChevronRight className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}
