"use client"

import { BarChart3, Trophy, Users } from "lucide-react"

interface AccountStatsProps {
    stats: {
        totalRifas: number
        totalRaised: number
        totalBuyers: number
    }
}

export function AccountStats({ stats }: AccountStatsProps) {
    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(value)
    }

    return (
        <div className="grid grid-cols-3 gap-4 md:gap-6">
            <StatItem
                icon={<Trophy className="size-4" />}
                label="Rifas"
                value={stats.totalRifas.toString()}
                color="text-amber-500"
            />
            <StatItem
                icon={<BarChart3 className="size-4" />}
                label="Volume"
                value={formatCurrency(stats.totalRaised)}
                color="text-emerald-500"
            />
            <StatItem
                icon={<Users className="size-4" />}
                label="Base"
                value={stats.totalBuyers.toString()}
                color="text-blue-500"
            />
        </div>
    )
}

function StatItem({ icon, label, value, color }: { icon: React.ReactNode, label: string, value: string, color: string }) {
    return (
        <div className="flex flex-col items-center md:items-start group/stat transition-all duration-300">
            <div className="flex items-center gap-3 mb-2">
                <div className={`p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/50 shadow-sm group-hover/stat:border-primary/30 group-hover/stat:shadow-md transition-all ${color}`}>
                    {icon}
                </div>
                <span className="text-[9px] font-black uppercase tracking-[0.25em] text-slate-400 group-hover/stat:text-primary transition-colors">{label}</span>
            </div>
            <span className="text-2xl font-black text-slate-900 dark:text-white tracking-tighter tabular-nums leading-none">
                {value}
            </span>
        </div>
    )
}
