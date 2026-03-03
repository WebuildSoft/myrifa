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

function polygonToPath(polygonStr?: string) {
    if (!polygonStr) return ""
    const content = polygonStr.match(/polygon\((.*)\)/)?.[1]
    if (!content) return ""
    const points = content.split(',').map(p => p.trim())
    return points.map((p, i) => {
        const [x, y] = p.split(/\s+/).map(v => v.replace('%', ''))
        return `${i === 0 ? 'M' : 'L'} ${x} ${y}`
    }).join(' ') + ' Z'
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
    const svgPath = polygonToPath(shapeConfig.clipPathStyle)
    const colorPrimary = primaryColor || '#7c3aed'

    return (
        <button
            onClick={() => onToggle(number, status)}
            disabled={!isAvailable}
            className={cn(
                "relative flex items-center justify-center h-11 w-full transition-all duration-300 disabled:cursor-not-allowed group",
                isSelected && "z-10 scale-110"
            )}
        >
            <div
                className={cn(
                    "absolute inset-0 transition-all duration-300 flex items-center justify-center",
                    !shapeConfig.clipPathStyle && "border-[3px]",
                    shapeConfig.radiusClass,
                    isAvailable && !isSelected && "bg-white dark:bg-slate-900 shadow-sm",
                    isSelected && "border-transparent animate-in zoom-in-95 shadow-xl",
                    status === "RESERVED" && "bg-yellow-400 border-yellow-500 opacity-80",
                    status === "PAID" && "bg-green-500 border-green-600 opacity-80"
                )}
                style={{
                    clipPath: shapeConfig.clipPathStyle,
                    backgroundColor: isSelected
                        ? colorPrimary
                        : (isAvailable ? `${colorPrimary}15` : undefined),
                    borderColor: (isAvailable && !isSelected && !shapeConfig.clipPathStyle)
                        ? colorPrimary
                        : 'transparent'
                }}
            >
                {/* SVG Stroke for clipped shapes */}
                {shapeConfig.clipPathStyle && isAvailable && !isSelected && (
                    <svg
                        viewBox="0 0 100 100"
                        preserveAspectRatio="none"
                        className="absolute inset-0 w-full h-full pointer-events-none overflow-visible"
                        style={{ filter: `drop-shadow(0 0 1px ${colorPrimary}40)` }}
                    >
                        <path
                            d={svgPath}
                            fill="none"
                            stroke={colorPrimary}
                            strokeWidth="6"
                            vectorEffect="non-scaling-stroke"
                            strokeLinejoin="round"
                        />
                    </svg>
                )}

                <span className={cn(
                    "relative z-10 font-bold text-sm transition-colors",
                    status === "PAID" && "line-through",
                    balloonShape === "FLOWER" && "-rotate-45",
                    isSelected ? "text-white" : (isAvailable ? colorPrimary : (status === "PAID" ? 'white' : 'inherit'))
                )}>
                    {number.toString().padStart(2, '0')}
                </span>

                {/* Glossy overlay */}
                {isAvailable && (
                    <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/5 to-white/30 pointer-events-none opacity-50" />
                )}
            </div>
        </button>
    )
}
