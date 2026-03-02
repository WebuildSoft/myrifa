"use client"

import { Gift, Trophy, Medal } from "lucide-react"
import { cn } from "@/lib/utils"

interface Prize {
    id: string
    title: string
    position: number
    description?: string | null
}

interface CampaignPrizesProps {
    prizes: Prize[]
    themePrimary?: string
    themeAccent?: string
}

export function CampaignPrizes({ prizes, themePrimary = "text-primary", themeAccent = "bg-primary/10" }: CampaignPrizesProps) {
    if (!prizes || prizes.length === 0) return null

    const getPositionIcon = (pos: number) => {
        switch (pos) {
            case 1: return <Trophy className="w-5 h-5 text-amber-500" />
            case 2: return <Medal className="w-5 h-5 text-slate-400" />
            case 3: return <Medal className="w-5 h-5 text-amber-700" />
            default: return <Gift className="w-5 h-5 text-primary" />
        }
    }

    return (
        <section className="mt-8 space-y-4">
            <div className="flex items-center gap-3">
                <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center", themeAccent, themePrimary)}>
                    <Trophy className="w-5 h-5" />
                </div>
                <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">Premiação</h3>
            </div>

            <div className="grid gap-3">
                {prizes.map((prize) => (
                    <div
                        key={prize.id}
                        className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm flex items-center gap-4 group hover:border-primary/20 transition-all"
                    >
                        <div className="size-12 rounded-xl bg-slate-50 dark:bg-slate-900 flex items-center justify-center shrink-0 border border-slate-100 dark:border-slate-700 group-hover:scale-110 transition-transform">
                            {getPositionIcon(prize.position)}
                        </div>
                        <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2 mb-0.5">
                                <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">
                                    {prize.position}º Prêmio
                                </span>
                            </div>
                            <h4 className="text-sm font-black text-slate-900 dark:text-white truncate uppercase tracking-tight">
                                {prize.title}
                            </h4>
                            {prize.description && (
                                <p className="text-xs text-slate-400 font-medium line-clamp-1 mt-0.5">
                                    {prize.description}
                                </p>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </section>
    )
}
