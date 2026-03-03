"use client"

import { ChevronRight, X } from "lucide-react"

interface CheckoutFloatingBarProps {
    selectedNumbers: number[]
    totalPrice: number
    onCheckout: () => void
    onRemove: (n: number) => void
    primaryColor?: string
}

export function CheckoutFloatingBar({
    selectedNumbers,
    totalPrice,
    onCheckout,
    onRemove,
    primaryColor,
}: CheckoutFloatingBarProps) {
    if (selectedNumbers.length === 0) return null

    const color = primaryColor || "var(--primary)"
    const formatted = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(totalPrice)

    return (
        <div className="fixed bottom-0 left-0 right-0 z-50 animate-in fade-in slide-in-from-bottom-4 duration-300">
            <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-t border-slate-200 dark:border-slate-700 shadow-[0_-8px_30px_rgba(0,0,0,0.12)]">
                {/* Number chips row */}
                <div className="max-w-xl mx-auto px-4 pt-3 pb-1">
                    <p className="text-[10px] font-black uppercase tracking-widest mb-2" style={{ color }}>
                        {selectedNumbers.length} cota{selectedNumbers.length > 1 ? "s" : ""} selecionada{selectedNumbers.length > 1 ? "s" : ""}
                    </p>
                    <div className="flex flex-wrap gap-1.5 max-h-[80px] overflow-y-auto pr-1">
                        {selectedNumbers.map((n) => (
                            <span
                                key={n}
                                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-black text-white animate-in zoom-in-75 duration-150"
                                style={{ backgroundColor: color }}
                            >
                                {String(n).padStart(2, "0")}
                                <button
                                    type="button"
                                    onClick={() => onRemove(n)}
                                    className="ml-0.5 rounded-full hover:bg-white/20 transition-colors p-0.5"
                                    aria-label={`Remover número ${n}`}
                                >
                                    <X className="w-2.5 h-2.5" />
                                </button>
                            </span>
                        ))}
                    </div>
                </div>

                {/* Price + CTA row */}
                <div className="max-w-xl mx-auto flex items-center justify-between gap-4 px-4 py-3">
                    <p className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
                        {formatted}
                    </p>
                    <button
                        onClick={onCheckout}
                        style={{ backgroundColor: color }}
                        className="text-white px-6 py-3.5 rounded-2xl font-black text-sm flex items-center gap-2 transition-all active:scale-95 shadow-xl hover:opacity-90 whitespace-nowrap"
                    >
                        Apoiar Campanha
                        <ChevronRight className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </div>
    )
}
