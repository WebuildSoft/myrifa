"use client"

import Image from "next/image"
import { Users, Trophy } from "lucide-react"
import { RifaStatus } from "@prisma/client"
import { cn } from "@/lib/utils"
import { useState, useEffect } from "react"

interface CampaignStatsCardProps {
    organizer: { name: string | null; image: string | null } | null
    categoryLabel: string
    title: string
    formattedPrice: string
    status: RifaStatus
    description?: string | null
    progress: number
    paidNumbers: number
    totalNumbers: number
    themePrimary?: string
    themeAccent?: string
    drawDate?: Date | null
}

export function CampaignStatsCard({
    organizer,
    categoryLabel,
    title,
    formattedPrice,
    status,
    description,
    progress,
    paidNumbers,
    totalNumbers,
    themePrimary = "text-primary",
    themeAccent = "bg-primary/10",
    drawDate
}: CampaignStatsCardProps) {
    const [timeLeft, setTimeLeft] = useState<{ d: string, h: string, m: string, s: string } | null>(null)

    useEffect(() => {
        if (!drawDate || status === RifaStatus.DRAWN || status === RifaStatus.CLOSED) {
            setTimeLeft(null)
            return
        }

        const targetDate = new Date(drawDate).getTime()

        const updateTimer = () => {
            const now = new Date().getTime()
            const distance = targetDate - now

            if (distance <= 0) {
                setTimeLeft({ d: "00", h: "00", m: "00", s: "00" })
                return
            }

            const days = Math.floor(distance / (1000 * 60 * 60 * 24))
            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60))
            const seconds = Math.floor((distance % (1000 * 60)) / 1000)

            setTimeLeft({
                d: days.toString().padStart(2, '0'),
                h: hours.toString().padStart(2, '0'),
                m: minutes.toString().padStart(2, '0'),
                s: seconds.toString().padStart(2, '0')
            })
        }

        updateTimer()
        const interval = setInterval(updateTimer, 1000)
        return () => clearInterval(interval)
    }, [drawDate, status])

    return (
        <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-2xl p-5 md:p-7 border border-slate-100 dark:border-slate-700">
            {/* Organizer */}
            <div className="flex items-center gap-3 mb-5 pb-5 border-b border-slate-100 dark:border-slate-700/50">
                <div className={cn("w-11 h-11 rounded-full border-2 overflow-hidden bg-slate-100 shrink-0", themeAccent.replace('bg-', 'border-').replace('/10', '/30'))}>
                    {organizer?.image ? (
                        <Image src={organizer.image} alt={organizer.name || "Organizador"} width={44} height={44} className="w-full h-full object-cover" />
                    ) : (
                        <div className="w-full h-full bg-slate-200 flex items-center justify-center text-slate-500">
                            <Users className="w-5 h-5" />
                        </div>
                    )}
                </div>
                <div>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Organizado por</p>
                    <p className="text-sm font-black text-slate-900 dark:text-white">{organizer?.name || "Premium Raffles"}</p>
                </div>
                <span className={cn("ml-auto text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-widest shrink-0", themeAccent, themePrimary)}>
                    {categoryLabel}
                </span>
            </div>

            <div className="flex justify-between items-start mb-4">
                <h1 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white leading-tight tracking-tight pr-4">
                    {title}
                </h1>
                <div className="text-right shrink-0">
                    <p className={cn("text-2xl md:text-3xl font-black tracking-tight", themePrimary)}>{formattedPrice}</p>
                    <p className="text-slate-400 text-[10px] font-bold uppercase">por cota</p>
                </div>
            </div>

            {status === RifaStatus.DRAWN && (
                <div className="mb-6 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex items-center gap-3">
                    <div className="size-8 rounded-full bg-emerald-500 flex items-center justify-center text-white shrink-0">
                        <Trophy className="h-4 w-4" />
                    </div>
                    <div>
                        <p className="text-xs font-black text-emerald-600 uppercase tracking-widest leading-none">Campanha Finalizada</p>
                        <p className="text-[10px] text-emerald-600/70 font-bold mt-1">O sorteio já foi realizado e os ganhadores definidos.</p>
                    </div>
                </div>
            )}

            {description && (
                <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed mb-5">
                    {description}
                </p>
            )}

            {/* Countdown Timer */}
            {timeLeft && status !== RifaStatus.DRAWN && status !== RifaStatus.CLOSED && (
                <div className="grid grid-cols-4 gap-2 py-4 border-y border-slate-100 dark:border-slate-700/50 mb-5">
                    {[
                        { val: timeLeft.d, label: "Dias" },
                        { val: timeLeft.h, label: "Horas" },
                        { val: timeLeft.m, label: "Min" },
                        { val: timeLeft.s, label: "Seg" }
                    ].map((item, i) => (
                        <div key={i} className="text-center">
                            <p className={cn("text-xl md:text-2xl font-black", themePrimary)}>{item.val}</p>
                            <p className="text-[9px] uppercase font-bold text-slate-400 tracking-tighter">{item.label}</p>
                        </div>
                    ))}
                </div>
            )}

            {/* Sales Progress */}
            <div className="space-y-2">
                <div className="flex justify-between items-end">
                    <p className="text-xs font-black text-slate-700 dark:text-slate-300 uppercase tracking-wider">Objetivo da Campanha</p>
                    <p className={cn("text-xs font-black", themePrimary)}>{progress}% atingido</p>
                </div>
                <div className="w-full h-3 bg-slate-100 dark:bg-slate-700/50 rounded-full overflow-hidden">
                    <div
                        className={cn("h-full rounded-full transition-all duration-1000", themePrimary.replace('text-', 'bg-'))}
                        style={{ width: `${progress}%` }}
                    />
                </div>
                <p className="text-center text-[10px] text-slate-400 font-bold uppercase pt-1">
                    <span className="text-slate-900 dark:text-slate-200">{paidNumbers}</span> de {totalNumbers} cotas garantidas
                </p>
            </div>
        </div>
    )
}
