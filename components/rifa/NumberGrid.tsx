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
                <style jsx global>{`
                    @keyframes shine {
                        0% { transform: translateX(-200%) skewX(-30deg); }
                        20%, 100% { transform: translateX(200%) skewX(-30deg); }
                    }
                `}</style>

                {/* Placeholder card to hint user */}
                <button
                    onClick={() => {
                        const btn = document.querySelector('button[style*="background-color"]') as HTMLButtonElement;
                        if (btn) btn.click();
                    }}
                    className="w-full text-left bg-white dark:bg-slate-900 rounded-3xl border-2 border-slate-200 dark:border-slate-800 p-6 flex flex-col items-center text-center gap-4 group active:scale-[0.98] transition-all relative overflow-hidden"
                >
                    {/* Background glow */}
                    <div
                        className="absolute inset-x-0 top-0 h-1/2 opacity-10 blur-3xl pointer-events-none"
                        style={{ backgroundColor: primaryColor || "var(--primary)" }}
                    />

                    <div
                        className="w-20 h-20 rounded-[2.5rem] flex items-center justify-center shadow-2xl transform group-hover:rotate-6 transition-transform relative"
                        style={{
                            backgroundColor: primaryColor || "var(--primary)",
                            boxShadow: `0 10px 30px -5px ${primaryColor || "var(--primary)"}88`
                        }}
                    >
                        <Ticket className="w-10 h-10 text-white" />

                        {/* Shine effect on the icon box */}
                        <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/30 to-transparent -skew-x-[30deg] pointer-events-none"
                            style={{ animation: 'shine 4s infinite ease-in-out' }} />
                    </div>

                    <div>
                        <h3 className="text-xl font-black text-slate-900 dark:text-white leading-tight uppercase tracking-tighter">
                            Toque para escolher seus números
                        </h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400 font-bold mt-1">
                            {numbers.filter(n => n.status === "AVAILABLE").length} cotas disponíveis a partir de {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(price)}
                        </p>
                    </div>

                    <div className="w-full h-px bg-slate-100 dark:bg-slate-800 my-1" />

                    <StatusLegend primaryColor={primaryColor} />

                    <div
                        className="w-full py-4 rounded-2xl font-black text-sm uppercase tracking-widest text-white shadow-xl flex items-center justify-center gap-2 relative overflow-hidden group-hover:scale-[1.02] transition-transform"
                        style={{ backgroundColor: primaryColor || "var(--primary)" }}
                    >
                        <Ticket className="w-4 h-4" />
                        ABRIR SELETOR DE COTAS

                        {/* Internal shine */}
                        <div className="absolute inset-0 w-1/2 h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-[30deg] pointer-events-none"
                            style={{ animation: 'shine 2.5s infinite ease-in-out' }} />
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
