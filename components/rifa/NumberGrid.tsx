"use client"

import { useRouter } from "next/navigation"
import { Ticket } from "lucide-react"
import { QuickSelect } from "./QuickSelect"
import { StatusLegend } from "./StatusLegend"
import { NumberButton } from "./NumberButton"
import { BalloonShape } from "@prisma/client"
import { CheckoutFloatingBar } from "./CheckoutFloatingBar"
import { MobileNumberSheet } from "./MobileNumberSheet"
import { useNumberGrid, NumberData } from "./hooks/useNumberGrid"

interface NumberGridProps {
    rifaId: string
    numbers: NumberData[]
    price: number
    currencyFormatted: string
    maxPerBuyer?: number | null
    balloonShape?: BalloonShape
    primaryColor?: string | null
    rifaTitle?: string
    rifaCover?: string | null
}

export function NumberGrid({
    rifaId,
    numbers,
    price,
    maxPerBuyer,
    balloonShape = "CIRCLE",
    primaryColor,
    rifaTitle,
    rifaCover,
}: NumberGridProps) {
    const router = useRouter()
    const {
        gridNumbers,
        selectedNumbers,
        toggleNumber,
        deselectNumber,
        selectRandom
    } = useNumberGrid({
        rifaId,
        initialNumbers: numbers,
        maxPerBuyer,
    })

    const handleGoToCheckout = () => {
        try {
            const rifaSlug = window.location.pathname.split("/r/")[1] ?? ""
            const data = {
                rifaId,
                rifaTitle: rifaTitle ?? "",
                rifaCover: rifaCover ?? null,
                rifaSlug,
                numbers: selectedNumbers,
                price,
            }
            sessionStorage.setItem(`checkout_${rifaId}`, JSON.stringify(data))
            router.push(`/checkout/${rifaId}`)
        } catch (error) {
            console.error("Failed to proceed to checkout:", error)
        }
    }

    return (
        <>
            {/* ── DESKTOP: inline grid with floating bar ── */}
            <div className="hidden md:block space-y-6">
                <QuickSelect onSelectRandom={selectRandom} primaryColor={primaryColor} />
                <StatusLegend primaryColor={primaryColor} />

                <div className="p-1 bg-slate-50/50 dark:bg-slate-900/50 rounded-2xl border border-slate-100 dark:border-slate-800">
                    <div className="grid grid-cols-8 lg:grid-cols-10 gap-2 max-h-[440px] overflow-y-auto p-1">
                        {gridNumbers.map((n) => (
                            <NumberButton
                                key={n.id}
                                number={n.number}
                                status={n.status}
                                isSelected={selectedNumbers.includes(n.number)}
                                onToggle={toggleNumber}
                                balloonShape={balloonShape}
                                primaryColor={primaryColor}
                            />
                        ))}
                    </div>
                </div>

                <CheckoutFloatingBar
                    selectedNumbers={selectedNumbers}
                    totalPrice={selectedNumbers.length * price}
                    onCheckout={handleGoToCheckout}
                    onRemove={deselectNumber}
                    primaryColor={primaryColor || undefined}
                />
            </div>

            {/* ── MOBILE: fullscreen bottom sheet trigger ── */}
            <div className="md:hidden">
                {/* Placeholder card to hint user */}
                <button
                    onClick={() => document.querySelector('button[onClick*="setOpen(true)"]')?.dispatchEvent(new MouseEvent('click', { bubbles: true }))}
                    className="w-full text-left bg-white dark:bg-slate-800 rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-700 p-6 flex flex-col items-center text-center gap-4 group active:scale-[0.98] transition-all"
                >
                    <div
                        className="w-16 h-16 rounded-3xl flex items-center justify-center shadow-lg transform group-hover:rotate-6 transition-transform"
                        style={{ backgroundColor: primaryColor || "var(--primary)" }}
                    >
                        <Ticket className="w-8 h-8 text-white" />
                    </div>
                    <div>
                        <h3 className="text-lg font-black text-slate-900 dark:text-white leading-tight">
                            Toque para escolher seus números
                        </h3>
                        <p className="text-sm text-slate-500 font-medium mt-1">
                            {numbers.filter(n => n.status === "AVAILABLE").length} cotas disponíveis a partir de {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(price)}
                        </p>
                    </div>

                    <div className="w-full h-px bg-slate-100 dark:bg-slate-700 my-1" />

                    <StatusLegend primaryColor={primaryColor} />

                    <div
                        className="py-2.5 px-6 rounded-xl font-black text-xs uppercase tracking-widest text-white shadow-md"
                        style={{ backgroundColor: primaryColor || "var(--primary)" }}
                    >
                        Abrir Seletor de Cotas
                    </div>
                </button>

                <MobileNumberSheet
                    numbers={gridNumbers}
                    selectedNumbers={selectedNumbers}
                    onToggle={toggleNumber}
                    onDeselect={deselectNumber}
                    onSelectRandom={selectRandom}
                    onCheckout={handleGoToCheckout}
                    price={price}
                    primaryColor={primaryColor}
                    balloonShape={balloonShape}
                    rifaTitle={rifaTitle}
                />
            </div>
        </>
    )
}
