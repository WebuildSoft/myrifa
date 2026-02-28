"use client"

import { Trophy, CheckCircle2 } from "lucide-react"

interface WinnerCardProps {
    id: string
    position: number
    name: string
    prizeTitle: string
    winnerNumber: number
}

export function WinnerCard({
    position,
    name,
    prizeTitle,
    winnerNumber,
}: WinnerCardProps) {
    return (
        <div className="bg-white dark:bg-slate-800/80 backdrop-blur-xl border border-primary/10 rounded-[2rem] p-6 flex items-center justify-between group hover:border-primary/30 transition-all shadow-xl shadow-primary/5 relative overflow-hidden">
            {/* Shimmer Effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/[0.03] to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>

            <div className="flex items-center gap-4 text-left relative z-10">
                <div className="size-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shadow-inner group-hover:scale-110 transition-transform">
                    <Trophy className="h-7 w-7" />
                </div>
                <div className="space-y-1">
                    <div className="flex items-center gap-2">
                        <span className="text-[10px] font-black text-primary uppercase tracking-widest">{position}º Prêmio</span>
                        <CheckCircle2 className="h-3 w-3 text-emerald-500" />
                    </div>
                    <h4 className="text-slate-900 dark:text-white text-xl font-black tracking-tight leading-none truncate max-w-[200px]">
                        {name}
                    </h4>
                    <p className="text-slate-400 text-[10px] font-bold uppercase">{prizeTitle}</p>
                </div>
            </div>

            <div className="flex flex-col items-end relative z-10">
                <span className="text-slate-400 text-[9px] font-black uppercase tracking-widest mb-1">Cota</span>
                <div className="bg-slate-900 dark:bg-black rounded-xl px-4 py-2 border border-white/5 text-primary font-black text-2xl font-mono shadow-inner group-hover:scale-105 transition-transform">
                    {winnerNumber.toString().padStart(3, '0')}
                </div>
            </div>
        </div>
    )
}
