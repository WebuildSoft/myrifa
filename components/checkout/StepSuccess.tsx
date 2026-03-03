"use client"

import Link from "next/link"
import { CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { BalloonShape } from "@prisma/client"
import { SHAPE_CONFIGS } from "@/lib/shapes"
import { cn } from "@/lib/utils"

interface StepSuccessProps {
    numbers: number[]
    rifaSlug: string
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

export function StepSuccess({ numbers, rifaSlug, primaryColor, balloonShape = "ROUNDED" }: StepSuccessProps) {
    const shapeConfig = SHAPE_CONFIGS[balloonShape] || SHAPE_CONFIGS["ROUNDED" as BalloonShape]
    const svgPath = polygonToPath(shapeConfig.clipPathStyle)
    const colorPrimary = primaryColor || '#7c3aed'

    return (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm p-12 flex flex-col items-center text-center space-y-6">
            <div className="w-24 h-24 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                <CheckCircle2 className="w-12 h-12 text-emerald-500" />
            </div>
            <div>
                <h2 className="text-4xl font-black text-slate-900 dark:text-white">Pagamento Confirmado!</h2>
                <p className="text-slate-500 mt-2 max-w-md mx-auto">
                    Sua compra de <strong>{numbers.length} número{numbers.length > 1 ? "s" : ""}</strong> foi recebida. A confirmação foi enviada para o seu WhatsApp. Boa sorte! 🍀
                </p>
            </div>
            <div className="flex flex-wrap justify-center gap-2">
                {numbers.slice(0, 12).map(n => (
                    <span
                        key={n}
                        className="relative px-3 py-1 font-black text-sm min-w-[2.8rem] flex items-center justify-center transition-all"
                        style={{
                            backgroundColor: `${colorPrimary}15`,
                            color: colorPrimary,
                            clipPath: shapeConfig.clipPathStyle
                        }}
                    >
                        {/* SVG stroke for consistency */}
                        {shapeConfig.clipPathStyle ? (
                            <svg
                                viewBox="0 0 100 100"
                                preserveAspectRatio="none"
                                className="absolute inset-0 w-full h-full pointer-events-none overflow-visible"
                            >
                                <path
                                    d={svgPath}
                                    fill="none"
                                    stroke={colorPrimary}
                                    strokeWidth="12"
                                    vectorEffect="non-scaling-stroke"
                                />
                            </svg>
                        ) : (
                            <div className={cn("absolute inset-0 border-2 pointer-events-none", shapeConfig.radiusClass)} style={{ borderColor: colorPrimary }} />
                        )}
                        {String(n).padStart(2, "0")}
                    </span>
                ))}
                {numbers.length > 12 && (
                    <span className="bg-slate-100 dark:bg-slate-800 text-slate-500 px-3 py-1 rounded-full font-bold text-sm">+{numbers.length - 12} mais</span>
                )}
            </div>
            <Button asChild size="lg" className="h-13 px-10 rounded-xl font-black shadow-lg" style={{ backgroundColor: colorPrimary, boxShadow: `0 10px 15px -3px ${colorPrimary}30` }}>
                <Link href={`/r/${rifaSlug}`}>Voltar ao Sorteio</Link>
            </Button>
        </div>
    )
}
