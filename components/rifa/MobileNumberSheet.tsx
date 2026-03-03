"use client"

import { useState } from "react"
import { X, Ticket, ChevronRight, Shuffle } from "lucide-react"
import { cn } from "@/lib/utils"
import { NumberButton } from "./NumberButton"
import { CheckoutFloatingBar } from "./CheckoutFloatingBar"
import { QuickSelect } from "./QuickSelect"
import { StatusLegend } from "./StatusLegend"
import type { NumberData, NumberStatus } from "./hooks/useNumberGrid"
import { BalloonShape } from "@prisma/client"

interface MobileNumberSheetProps {
    numbers: NumberData[]
    selectedNumbers: number[]
    onToggle: (n: number, status: NumberStatus) => void
    onDeselect: (n: number) => void
    onSelectRandom: (amount: number) => void
    onCheckout: () => void
    price: number
    primaryColor?: string | null
    balloonShape?: BalloonShape
    rifaTitle?: string
}

export function MobileNumberSheet({
    numbers,
    selectedNumbers,
    onToggle,
    onDeselect,
    onSelectRandom,
    onCheckout,
    price,
    primaryColor,
    balloonShape = "CIRCLE",
    rifaTitle,
}: MobileNumberSheetProps) {
    const [open, setOpen] = useState(false)

    const color = primaryColor || "var(--primary)"
    const totalPrice = selectedNumbers.length * price
    const formatted = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(price)

    return (
        <>
            {/* Sticky CTA button at bottom (only on mobile, when sheet is closed) */}
            {!open && (
                <div className="md:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-40 w-[calc(100%-32px)] max-w-sm animate-in fade-in slide-in-from-bottom-8 duration-500">
                    <button
                        onClick={() => setOpen(true)}
                        style={{ backgroundColor: color }}
                        className="w-full py-4 rounded-2xl font-black text-white text-lg flex items-center justify-center gap-3 shadow-[0_20px_40px_rgba(0,0,0,0.2)] active:scale-95 transition-all relative overflow-hidden group"
                    >
                        {/* Pulse effect */}
                        <span className="absolute inset-0 bg-white/20 animate-ping opacity-0 group-hover:opacity-100 duration-1000" />

                        <div className="bg-white/20 p-2 rounded-xl">
                            <Ticket className="w-6 h-6" />
                        </div>
                        <div className="flex flex-col items-start leading-tight">
                            <span>Escolher Cotas</span>
                            <span className="text-xs font-medium opacity-80">Apenas {formatted} cada</span>
                        </div>
                        <ChevronRight className="w-5 h-5 ml-2 opacity-50" />
                    </button>

                    {/* Subtle pulse ring around the button */}
                    <div
                        className="absolute inset-x-0 -inset-y-1 rounded-2xl border-4 opacity-30 animate-pulse pointer-events-none"
                        style={{ borderColor: color }}
                    />
                </div>
            )}

            {/* Full-screen bottom sheet overlay (mobile only) */}
            {open && (
                <div className="md:hidden fixed inset-0 z-50 flex flex-col bg-slate-50 dark:bg-slate-950 animate-in slide-in-from-bottom duration-300">
                    {/* Sheet header */}
                    <div className="flex items-center justify-between px-4 py-4 bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 shadow-sm shrink-0">
                        <div className="flex items-center gap-2">
                            <Ticket className="w-5 h-5 shrink-0" style={{ color }} />
                            <div>
                                <h2 className="font-black text-slate-900 dark:text-white text-sm leading-none">
                                    Escolha suas cotas
                                </h2>
                                {rifaTitle && (
                                    <p className="text-[10px] text-slate-400 font-medium mt-0.5 truncate max-w-[180px]">
                                        {rifaTitle}
                                    </p>
                                )}
                            </div>
                        </div>
                        <button
                            onClick={() => setOpen(false)}
                            className="w-9 h-9 flex items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Quick select + legend */}
                    <div className="px-4 py-3 bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 shrink-0">
                        <QuickSelect onSelectRandom={onSelectRandom} primaryColor={primaryColor} />
                        <div className="mt-2">
                            <StatusLegend primaryColor={primaryColor} />
                        </div>
                    </div>

                    {/* Number grid — scrollable area */}
                    <div className="flex-1 overflow-y-auto p-3 pb-40">
                        <div className="grid grid-cols-5 gap-2">
                            {numbers.map((n) => (
                                <NumberButton
                                    key={n.id}
                                    number={n.number}
                                    status={n.status}
                                    isSelected={selectedNumbers.includes(n.number)}
                                    onToggle={onToggle}
                                    balloonShape={balloonShape}
                                    primaryColor={primaryColor}
                                />
                            ))}
                        </div>
                    </div>

                    {/* Floating bar inside the sheet */}
                    <div className="absolute bottom-0 left-0 right-0">
                        {selectedNumbers.length > 0 ? (
                            <CheckoutFloatingBar
                                selectedNumbers={selectedNumbers}
                                totalPrice={totalPrice}
                                onCheckout={() => { setOpen(false); onCheckout() }}
                                onRemove={onDeselect}
                                primaryColor={primaryColor || undefined}
                            />
                        ) : (
                            <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-t border-slate-200 dark:border-slate-700 px-4 py-5 flex items-center justify-center">
                                <p className="text-sm text-slate-400 font-bold">
                                    Toque nos números para selecionar suas cotas
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </>
    )
}
