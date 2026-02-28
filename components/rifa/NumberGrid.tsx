"use client"

import { useRouter } from "next/navigation"
import { QuickSelect } from "./QuickSelect"
import { StatusLegend } from "./StatusLegend"
import { NumberButton } from "./NumberButton"
import { BalloonShape } from "@prisma/client"
import { CheckoutFloatingBar } from "./CheckoutFloatingBar"
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

/**
 * NumberGrid - Senior Refactored Version
 * 
 * Responsibilities:
 * - Composition of specialized UI components.
 * - Orchestration of the business logic via useNumberGrid hook.
 * - Routing and external side effects (checkout redirection).
 */
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
        <div className="space-y-6">
            <QuickSelect
                onSelectRandom={selectRandom}
                primaryColor={primaryColor}
            />

            <StatusLegend primaryColor={primaryColor} />

            <div className="p-1 bg-slate-50/50 dark:bg-slate-900/50 rounded-2xl border border-slate-100 dark:border-slate-800">
                <div className="grid grid-cols-5 md:grid-cols-8 lg:grid-cols-10 gap-2 max-h-[400px] overflow-y-auto p-1">
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
                selectedCount={selectedNumbers.length}
                totalPrice={selectedNumbers.length * price}
                onCheckout={handleGoToCheckout}
                primaryColor={primaryColor || undefined}
            />
        </div>
    )
}
