"use client"

import { cn } from "@/lib/utils"
import { BalloonShape } from "@prisma/client"
import { SHAPE_CONFIGS } from "@/lib/shapes"

interface StatusLegendProps {
    primaryColor?: string | null
    balloonShape?: BalloonShape
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

export function StatusLegend({ primaryColor, balloonShape = "ROUNDED" }: StatusLegendProps) {
    const shapeConfig = SHAPE_CONFIGS[balloonShape] || SHAPE_CONFIGS["ROUNDED" as BalloonShape]
    const svgPath = polygonToPath(shapeConfig.clipPathStyle)
    const colorPrimary = primaryColor || '#7c3aed'

    const legendItems = [
        {
            label: "Disponível",
            style: {
                backgroundColor: `${colorPrimary}15`,
                clipPath: shapeConfig.clipPathStyle,
                borderColor: !shapeConfig.clipPathStyle ? colorPrimary : 'transparent'
            },
            className: cn("bg-white dark:bg-slate-900 border-[2px]", shapeConfig.radiusClass),
            hasSvg: !!shapeConfig.clipPathStyle
        },
        {
            label: "Selec.",
            style: {
                backgroundColor: colorPrimary,
                clipPath: shapeConfig.clipPathStyle,
                borderColor: !shapeConfig.clipPathStyle ? colorPrimary : 'transparent',
                boxShadow: colorPrimary ? `0 10px 15px -3px ${colorPrimary}40` : undefined
            },
            className: cn("border", shapeConfig.radiusClass, !primaryColor ? "bg-primary border-primary shadow-lg shadow-primary/20" : "text-white"),
            hasSvg: false // No stroke for selected in legend for simplicity
        },
        { color: "bg-yellow-400 border-yellow-500", label: "Reserv.", className: shapeConfig.radiusClass, style: { clipPath: shapeConfig.clipPathStyle } },
        { color: "bg-green-500 border-green-600", label: "Pago", className: shapeConfig.radiusClass, style: { clipPath: shapeConfig.clipPathStyle } }
    ]

    return (
        <div className="flex flex-wrap justify-center gap-6 py-2">
            {legendItems.map((item, i) => (
                <div key={i} className="flex items-center gap-2">
                    <div
                        className={cn("w-4 h-4 relative flex items-center justify-center transition-all duration-300", (item as any).color || (item as any).className)}
                        style={(item as any).style}
                    >
                        {(item as any).hasSvg && (
                            <svg
                                viewBox="0 0 100 100"
                                preserveAspectRatio="none"
                                className="absolute inset-0 w-full h-full pointer-events-none overflow-visible"
                            >
                                <path
                                    d={svgPath}
                                    fill="none"
                                    stroke={colorPrimary}
                                    strokeWidth="10"
                                    vectorEffect="non-scaling-stroke"
                                />
                            </svg>
                        )}
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                        {item.label}
                    </span>
                </div>
            ))}
        </div>
    )
}
