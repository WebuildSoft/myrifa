"use client"

import { useEffect, useRef } from "react"
import useSWR from "swr"
import { toast } from "sonner"
import { Activity } from "lucide-react"

const fetcher = (url: string) => fetch(url).then((res) => res.json())

interface RealtimePulseProps {
    initialData: any
}

export function RealtimePulse({ initialData }: RealtimePulseProps) {
    const lastSaleId = useRef<string | null>(
        initialData?.recentSales?.[0]?.id || null
    )

    const { data, error } = useSWR("/api/analytics/live", fetcher, {
        refreshInterval: 15000, // 15 seconds
        fallbackData: initialData,
        revalidateOnFocus: true,
    })

    // Detect new sales for notifications
    useEffect(() => {
        if (data?.recentSales?.length > 0) {
            const latestSale = data.recentSales[0]
            if (latestSale.id !== lastSaleId.current) {
                // New sale detected!
                toast.success(`🎉 Nova Venda!`, {
                    description: `${latestSale.buyer.name} comprou R$ ${Number(latestSale.amount).toFixed(2)} na rifa "${latestSale.rifa.title}"`,
                    duration: 5000,
                })
                lastSaleId.current = latestSale.id
            }
        }
    }, [data])

    if (error) return null

    return (
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.1)]">
            <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400 flex items-center gap-1.5 leading-none">
                <Activity className="h-3 w-3" />
                Live Pulse
            </span>
        </div>
    )
}

// Sub-component for Live Online Users
export function LiveOnlineUsers({ fallback }: { fallback: number }) {
    const { data } = useSWR("/api/analytics/live", fetcher, {
        refreshInterval: 15000,
        fallbackData: { onlineUsers: fallback },
    })
    return <span>{data?.onlineUsers ?? fallback}</span>
}

// Sub-component for Live Revenue
export function LiveRevenue({ fallback }: { fallback: number }) {
    const { data } = useSWR("/api/analytics/live", fetcher, {
        refreshInterval: 15000,
        fallbackData: { totalRevenue: fallback },
    })

    const value = data?.totalRevenue ?? fallback
    return <span>R$ {Number(value).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</span>
}
