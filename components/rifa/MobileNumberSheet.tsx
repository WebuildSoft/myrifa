"use client"

import { useState, useEffect } from "react"
import { createPortal } from "react-dom"
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
    themeClasses?: string
    themeStyle?: React.CSSProperties
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
    themeClasses,
    themeStyle,
}: MobileNumberSheetProps) {
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    const handleSetOpen = (val: boolean) => {
        if (val) setOpen()
        else handleClose()
    }

    const color = primaryColor || "var(--primary)"
    const totalPrice = selectedNumbers.length * price
    const formatted = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(price)

    const sheetContent = (
        <>
            <style jsx global>{`
                @keyframes shine {
                    0% { transform: translateX(-200%) skewX(-30deg); }
                    20%, 100% { transform: translateX(200%) skewX(-30deg); }
                }
                @keyframes bounce-slow {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-12px); }
                }
                .animate-bounce-slow {
                    animation: bounce-slow 2.4s infinite ease-in-out;
                }
                ${open ? `
                    body { overflow: hidden !important; }
                ` : ''}
            `}</style>

            {/* Sticky CTA button at bottom (only on mobile, when sheet is closed) */}
            {!open && (
                <div className="md:hidden fixed bottom-8 left-0 right-0 z-40 px-6 flex justify-center pointer-events-none">
                    <div className="w-full max-w-sm animate-in fade-in slide-in-from-bottom-8 duration-700 pointer-events-auto">
                        <div className="animate-bounce-slow relative">
                            {/* Floating Label for Urgency */}
                            <div className="absolute -top-7 left-1/2 -translate-x-1/2 whitespace-nowrap bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-[10px] font-black px-4 py-1.5 rounded-full shadow-2xl z-50 animate-pulse border border-white/20 dark:border-slate-900/20">
                                🔥 COMECE POR AQUI
                            </div>

                            <button
                                onClick={() => handleSetOpen(true)}
                                style={{
                                    backgroundColor: color,
                                    boxShadow: `0 25px 50px -12px ${color}80, 0 0 30px ${color}40`
                                }}
                                className="w-full py-5 rounded-[2.5rem] font-black text-white text-xl flex items-center justify-center gap-4 active:scale-95 transition-all relative overflow-hidden group border-b-8 border-black/20 ring-4 ring-white/30"
                            >
                                {/* Pulse effect background */}
                                <span className="absolute inset-0 bg-white/30 animate-pulse opacity-50" />

                                {/* Shine effect */}
                                <div className="absolute inset-0 w-1/2 h-full bg-gradient-to-r from-transparent via-white/60 to-transparent -skew-x-[30deg] pointer-events-none"
                                    style={{ animation: 'shine 2s infinite ease-in-out' }} />

                                <div className="bg-white/20 p-2.5 rounded-2xl shadow-inner">
                                    <Ticket className="w-7 h-7" />
                                </div>
                                <div className="flex flex-col items-center leading-tight">
                                    <span className="text-shadow-md font-black tracking-tight text-center">ESCOLHA SEU NÚMERO</span>
                                    <span className="text-[11px] font-bold opacity-90 tracking-widest uppercase text-center">Toque para participar</span>
                                </div>
                                <ChevronRight className="w-6 h-6 animate-bounce-x" />
                            </button>

                            {/* Intense glow base */}
                            <div
                                className="absolute inset-x-8 -bottom-2 h-4 opacity-50 blur-2xl rounded-full animate-pulse pointer-events-none"
                                style={{ backgroundColor: color }}
                            />
                        </div>
                    </div>
                </div>
            )}

            {/* Full-screen bottom sheet overlay (mobile only) */}
            {open && (
                <div
                    className={cn(
                        "md:hidden fixed inset-0 z-[100] flex flex-col animate-in slide-in-from-bottom duration-300",
                        themeClasses || "bg-slate-50 dark:bg-slate-950"
                    )}
                    style={themeStyle}
                >

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
                                    Escolha seu número
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
                            <StatusLegend primaryColor={primaryColor} balloonShape={balloonShape} />
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

    if (!mounted) return null

    return createPortal(sheetContent, document.body)
}
