"use client"

import { cn } from "@/lib/utils"

interface StatusLegendProps {
    primaryColor?: string | null
}

export function StatusLegend({ primaryColor }: StatusLegendProps) {
    const legendItems = [
        { color: "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700", label: "Disponível" },
        {
            label: "Selec.",
            style: {
                backgroundColor: primaryColor || undefined,
                borderColor: primaryColor || undefined,
                boxShadow: primaryColor ? `0 10px 15px -3px ${primaryColor}40` : undefined
            },
            className: !primaryColor ? "bg-primary border-primary shadow-lg shadow-primary/20" : ""
        },
        { color: "bg-yellow-400 border-yellow-500", label: "Reserv." },
        { color: "bg-green-500 border-green-600", label: "Pago" }
    ]

    return (
        <div className="flex flex-wrap justify-center gap-6 py-2">
            {legendItems.map((item, i) => (
                <div key={i} className="flex items-center gap-2">
                    <div
                        className={cn("w-4 h-4 rounded-md border", (item as any).color || (item as any).className)}
                        style={(item as any).style}
                    ></div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                        {item.label}
                    </span>
                </div>
            ))}
        </div>
    )
}
