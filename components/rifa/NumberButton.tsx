"use client"

import { cn } from "@/lib/utils"

import { BalloonShape } from "@prisma/client"
import { SHAPE_CONFIGS } from "@/lib/shapes"

interface NumberButtonProps {
    number: number
    status: "AVAILABLE" | "RESERVED" | "PAID"
    isSelected: boolean
    onToggle: (num: number, status: "AVAILABLE" | "RESERVED" | "PAID") => void
    balloonShape?: BalloonShape
    primaryColor?: string | null
}

export function NumberButton({
    number,
    status,
    isSelected,
    onToggle,
    balloonShape = "ROUNDED" as BalloonShape,
    primaryColor,
}: NumberButtonProps) {
    const isAvailable = status === "AVAILABLE"
    const shapeConfig = SHAPE_CONFIGS[balloonShape] || SHAPE_CONFIGS["ROUNDED" as BalloonShape]

    return (
        <button
            onClick={() => onToggle(number, status)}
            disabled={!isAvailable}
            className={cn(
                "relative flex items-center justify-center font-bold text-sm h-10 w-full transition-all",
                "border disabled:cursor-not-allowed",
                shapeConfig.radiusClass,
                isAvailable && !isSelected && "bg-white border-slate-300 text-slate-700 hover:border-slate-400",
                isSelected && "text-white shadow-md transform scale-110 z-10 border-transparent",
                status === "RESERVED" && "bg-yellow-400 border-yellow-500 text-yellow-900 opacity-80",
                status === "PAID" && "bg-green-500 border-green-600 text-white opacity-80 decoration-2 underline-offset-2"
            )}
            style={{
                clipPath: shapeConfig.clipPathStyle,
                backgroundColor: isSelected ? (primaryColor || 'var(--primary)') : undefined,
                color: (isSelected || status === "PAID") ? 'white' : undefined,
                borderColor: (isAvailable && !isSelected) ? undefined : 'transparent'
            }}
        >
            <span className={cn(
                status === "PAID" && "line-through",
                balloonShape === "FLOWER" && "-rotate-45"
            )}>
                {number.toString().padStart(2, '0')}
            </span>
        </button>
    )
}
