"use client"

import { Trophy, CheckCircle2 } from "lucide-react"
import { cn } from "@/lib/utils"

interface PublicWinnersProps {
    prizes: {
        id: string
        title: string
        position: number
        winner: {
            name: string
        } | null
        winnerNumber: number | null
    }[]
}

export function PublicWinners({ prizes }: PublicWinnersProps) {
    const sortedWinners = prizes.filter(p => p.winner).sort((a, b) => a.position - b.position)

    if (sortedWinners.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-12 px-6 text-center bg-slate-50 dark:bg-slate-900/50 rounded-3xl border border-dashed border-slate-200 dark:border-slate-800">
                <div className="size-16 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 mb-4">
                    <Trophy className="h-8 w-8" />
                </div>
                <h3 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-tight">Sorteio em Processamento</h3>
                <p className="text-sm text-slate-400 mt-2 max-w-[280px]">Os ganhadores oficiais desta campanha aparecerão aqui em instantes.</p>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col items-center gap-2 mb-8">
                <div className="h-px w-24 bg-gradient-to-r from-transparent via-primary/50 to-transparent"></div>
                <h3 className="text-primary text-xs font-black uppercase tracking-[0.4em]">Vencedores Certificados</h3>
                <div className="h-px w-24 bg-gradient-to-r from-transparent via-primary/50 to-transparent"></div>
            </div>

            <div className="grid grid-cols-1 gap-4">
                {sortedWinners.map((prize) => (
                    <div
                        key={prize.id}
                        className="bg-white dark:bg-slate-800/80 backdrop-blur-xl border border-primary/10 rounded-[2rem] p-6 flex items-center justify-between group hover:border-primary/30 transition-all shadow-xl shadow-primary/5 relative overflow-hidden"
                    >
                        {/* Shimmer Effect */}
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/[0.03] to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>

                        <div className="flex items-center gap-4 text-left relative z-10">
                            <div className="size-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shadow-inner group-hover:scale-110 transition-transform">
                                <Trophy className="h-7 w-7" />
                            </div>
                            <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                    <span className="text-[10px] font-black text-primary uppercase tracking-widest">{prize.position}º Prêmio</span>
                                    <CheckCircle2 className="h-3 w-3 text-emerald-500" />
                                </div>
                                <h4 className="text-slate-900 dark:text-white text-xl font-black tracking-tight leading-none truncate max-w-[200px]">
                                    {prize.winner?.name}
                                </h4>
                                <p className="text-slate-400 text-[10px] font-bold uppercase">{prize.title}</p>
                            </div>
                        </div>

                        <div className="flex flex-col items-end relative z-10">
                            <span className="text-slate-400 text-[9px] font-black uppercase tracking-widest mb-1">Cota</span>
                            <div className="bg-slate-900 dark:bg-black rounded-xl px-4 py-2 border border-white/5 text-primary font-black text-2xl font-mono shadow-inner group-hover:scale-105 transition-transform">
                                {prize.winnerNumber?.toString().padStart(3, '0')}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <p className="text-center text-[10px] text-slate-400 font-bold uppercase tracking-widest pt-4">
                Parabéns aos apoiadores vencedores desta campanha!
            </p>
        </div>
    )
}
