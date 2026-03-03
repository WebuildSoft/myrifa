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
    isOpen: boolean
    onOpen: () => void
    onClose: () => void
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
    isOpen: open,
    onOpen: setOpen,
    onClose: handleClose,
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
    const handleSetOpen = (val: boolean) => {
        if (val) setOpen()
        else handleClose()
    }

    const color = primaryColor || "var(--primary)"
    const totalPrice = selectedNumbers.length * price
    const formatted = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(price)

    return (
        <>
            <style jsx global>{`
                @keyframes shine {
                    0% { transform: translateX(-200%) skewX(-30deg); }
                    20%, 100% { transform: translateX(200%) skewX(-30deg); }
                }
                ${open ? `
                    body { overflow: hidden !important; }
                ` : ''}
            `}</style>

            {/* Sticky CTA button at bottom (only on mobile, when sheet is closed) */}
            {!open && (
                <div className="md:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-40 w-[calc(100%-32px)] max-w-sm animate-in fade-in slide-in-from-bottom-8 duration-500">
                    <button
                        onClick={() => handleSetOpen(true)}
                        style={{
                            backgroundColor: color,
                            boxShadow: `0 20px 40px -10px ${color}66, 0 0 20px ${color}33`
                        }}
                        className="w-full py-4.5 rounded-2xl font-black text-white text-lg flex items-center justify-center gap-3 active:scale-95 transition-all relative overflow-hidden group border-b-4 border-black/20"
                    >
                        {/* Pulse effect */}
                        <span className="absolute inset-0 bg-white/20 animate-ping opacity-0 group-hover:opacity-100 duration-1000" />

                        {/* Shine effect */}
                        <div className="absolute inset-0 w-1/2 h-full bg-gradient-to-r from-transparent via-white/40 to-transparent -skew-x-[30deg] pointer-events-none"
                            style={{ animation: 'shine 3s infinite ease-in-out' }} />

                        <div className="bg-white/20 p-2 rounded-xl shadow-inner">
                            <Ticket className="w-6 h-6" />
                        </div>
                        <div className="flex flex-col items-start leading-tight">
                            <span className="text-shadow-sm font-black">ESCOLHER COTAS</span>
                            <span className="text-[10px] font-bold opacity-90 tracking-wide uppercase">Toque para participar</span>
                        </div>
                        <ChevronRight className="w-5 h-5 ml-1 animate-bounce-x" />
                    </button>

                    {/* Intense pulse ring around the button */}
                    <div
                        className="absolute inset-x-0 -inset-y-1 rounded-2xl border-4 opacity-40 animate-pulse pointer-events-none"
                        style={{ borderColor: color, filter: 'blur(2px)' }}
                    />
                </div>
            )}

            {/* Full-screen bottom sheet overlay (mobile only) */}
            {open && (
                <div className="md:hidden fixed inset-0 z-[100] flex flex-col bg-slate-50 dark:bg-slate-950 animate-in slide-in-from-bottom duration-300">

                    {/* Swipe handle / visual affordance */}
                    <div className="w-12 h-1.5 bg-slate-300 dark:bg-slate-700 rounded-full mx-auto mt-3 mb-1 shrink-0 opacity-50" />
                    {/* Sheet header */}
                    <div className="flex items-center justify-between px-4 py-4 bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 shadow-md shrink-0 ring-1 ring-slate-200/50 dark:ring-slate-700/50">
                        <div className="flex items-center gap-3">
                            <div className="bg-slate-100 dark:bg-slate-800 p-2 rounded-xl">
                                <Ticket className="w-5 h-5 shrink-0" style={{ color }} />
                            </div>
                            <div>
                                <h2 className="font-black text-slate-900 dark:text-white text-base leading-none">
                                    Escolha suas cotas
                                </h2>
                                {rifaTitle && (
                                    <p className="text-xs text-slate-400 font-medium mt-1 truncate max-w-[200px]">
                                        {rifaTitle}
                                    </p>
                                )}
                            </div>
                        </div>
                        <button
                            onClick={() => handleSetOpen(false)}
                            className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 border border-transparent active:scale-95 transition-all shadow-lg shadow-slate-200 dark:shadow-none"
                        >
                            <span className="text-xs font-black uppercase tracking-wider">Fechar</span>
                            <X className="w-4 h-4" strokeWidth={3} />
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
                                onCheckout={() => { handleSetOpen(false); onCheckout() }}
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
