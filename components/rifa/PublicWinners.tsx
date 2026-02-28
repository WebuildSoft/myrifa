"use client"

import { Trophy } from "lucide-react"
import { WinnerCard } from "./WinnerCard"

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
    const sortedWinners = prizes
        .filter(p => p.winner && p.winnerNumber !== null)
        .sort((a, b) => a.position - b.position)

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
                    <WinnerCard
                        key={prize.id}
                        id={prize.id}
                        position={prize.position}
                        name={prize.winner!.name}
                        prizeTitle={prize.title}
                        winnerNumber={prize.winnerNumber!}
                    />
                ))}
            </div>

            <p className="text-center text-[10px] text-slate-400 font-bold uppercase tracking-widest pt-4">
                Parabéns aos apoiadores vencedores desta campanha!
            </p>
        </div>
    )
}
