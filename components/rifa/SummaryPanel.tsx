"use client"

import Image from "next/image"
import { Sparkles, Ticket, Shield, Lock } from "lucide-react"

interface SummaryPanelProps {
    rifaTitle: string
    rifaCover?: string | null
    selectedNumbers: number[]
    totalPrice: number
}

export function SummaryPanel({
    rifaTitle,
    rifaCover,
    selectedNumbers,
    totalPrice,
}: SummaryPanelProps) {
    const formattedTotal = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(totalPrice)
    const pricePerNumber = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(
        selectedNumbers.length > 0 ? totalPrice / selectedNumbers.length : 0
    )

    return (
        <div className="w-full lg:w-72 xl:w-80 bg-slate-50 dark:bg-slate-900 border-t lg:border-t-0 lg:border-l border-slate-100 dark:border-slate-800 flex flex-col shrink-0">
            {/* Cover image */}
            <div className="w-full h-40 overflow-hidden shrink-0 relative">
                {rifaCover ? (
                    <Image src={rifaCover} alt={rifaTitle} fill className="object-cover" />
                ) : (
                    <div className="w-full h-full bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center">
                        <Sparkles className="w-10 h-10 text-white/30" />
                    </div>
                )}
            </div>

            <div className="p-6 flex flex-col flex-1">
                {/* Title */}
                <p className="text-[10px] font-black text-primary uppercase tracking-widest mb-1">Você está concorrendo a</p>
                <h3 className="text-lg font-black text-slate-900 dark:text-white leading-tight mb-6">{rifaTitle}</h3>

                {/* Numbers breakdown */}
                <div className="space-y-4 border-t border-slate-200 dark:border-slate-700 pt-4">
                    <div className="flex justify-between items-center text-sm">
                        <span className="text-slate-500">Quantidade</span>
                        <span className="font-bold">{selectedNumbers.length} número{selectedNumbers.length > 1 ? "s" : ""}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                        <span className="text-slate-500">Preço unitário</span>
                        <span className="font-bold">{pricePerNumber}</span>
                    </div>

                    {/* Numbered chips */}
                    <div className="bg-white dark:bg-slate-800 rounded-xl p-4">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-1">
                            <Ticket className="w-3 h-3" /> Seus números
                        </p>
                        <div className="flex flex-wrap gap-1.5">
                            {selectedNumbers.slice(0, 12).map((n) => (
                                <span key={n} className="bg-primary/10 text-primary px-2 py-0.5 rounded-full font-black text-xs">
                                    {String(n).padStart(3, "0")}
                                </span>
                            ))}
                            {selectedNumbers.length > 12 && (
                                <span className="bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full font-bold text-xs">
                                    +{selectedNumbers.length - 12} mais
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Total */}
                    <div className="flex justify-between items-center pt-3 border-t border-slate-200 dark:border-slate-700">
                        <span className="font-bold text-slate-900 dark:text-white">Total</span>
                        <span className="text-2xl font-black text-emerald-600">{formattedTotal}</span>
                    </div>
                </div>

                {/* Trust badge */}
                <div className="mt-auto pt-4">
                    <div className="bg-primary/5 rounded-xl p-4 flex items-start gap-3">
                        <Shield className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                        <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                            Ao finalizar, você concorda com os <strong>Termos de Uso</strong> e as regras desta rifa. Seus dados estão protegidos.
                        </p>
                    </div>
                    <div className="grid grid-cols-2 gap-2 mt-3">
                        <div className="flex flex-col items-center p-3 bg-white dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700">
                            <Shield className="w-4 h-4 text-primary mb-1" />
                            <span className="text-[10px] font-bold text-slate-400 uppercase text-center">Site Seguro</span>
                        </div>
                        <div className="flex flex-col items-center p-3 bg-white dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700">
                            <Lock className="w-4 h-4 text-primary mb-1" />
                            <span className="text-[10px] font-bold text-slate-400 uppercase text-center">Dados Seguros</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
