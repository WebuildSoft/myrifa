"use client"

import { ChevronRight } from "lucide-react"

interface CheckoutFloatingBarProps {
    selectedCount: number
    totalPrice: number
    onCheckout: () => void
    primaryColor?: string
}

export function CheckoutFloatingBar({
    selectedCount,
    totalPrice,
    onCheckout,
    primaryColor,
}: CheckoutFloatingBarProps) {
    if (selectedCount === 0) return null

    return (
        <div className="fixed bottom-0 left-0 right-0 p-4 pb-8 bg-white/90 dark:bg-slate-900/90 backdrop-blur-lg border-t border-slate-200 dark:border-slate-800 shadow-[0_-10px_30px_rgba(0,0,0,0.1)] z-50 animate-in fade-in slide-in-from-bottom-5">
            <div className="max-w-xl mx-auto flex items-center justify-between gap-6">
                <div className="flex flex-col">
                    <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-0.5">
                        <span style={{ color: primaryColor || 'var(--primary)' }}>{selectedCount}</span> selecionado{selectedCount > 1 ? "s" : ""}
                    </p>
                    <p className="text-2xl font-black text-slate-900 dark:text-white tracking-tighter">
                        Total: {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(totalPrice)}
                    </p>
                </div>
                <button
                    onClick={onCheckout}
                    style={{ backgroundColor: primaryColor || 'var(--primary)', borderColor: primaryColor || 'var(--primary)' }}
                    className="text-white px-8 py-4 rounded-2xl font-black text-sm flex items-center gap-2 transition-all active:scale-95 shadow-xl hover:opacity-90"
                >
                    Apoiar Campanha
                    <ChevronRight className="w-5 h-5" />
                </button>
            </div>
        </div>
    )
}
