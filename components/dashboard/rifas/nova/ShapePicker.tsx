"use client"

import { cn } from "@/lib/utils"
import { Check, LockKeyhole } from "lucide-react"
import { BalloonShape } from "@prisma/client"
import { SHAPE_CONFIGS } from "@/lib/shapes"

interface ShapePickerProps {
    value: BalloonShape
    onChange: (val: BalloonShape) => void
    userPlan: string
}

export function ShapePicker({ value, onChange, userPlan }: ShapePickerProps) {
    const isFreePlan = userPlan === "FREE"

    return (
        <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
                <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">Estilo do Bilhete</h3>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                {Object.values(SHAPE_CONFIGS).map((shape) => {
                    const isSelected = value === shape.id
                    const isLocked = shape.isPremium && isFreePlan

                    return (
                        <button
                            key={shape.id}
                            type="button"
                            disabled={isLocked}
                            onClick={() => !isLocked && onChange(shape.id)}
                            className={cn(
                                "relative flex flex-col items-center gap-3 p-4 rounded-xl border text-center transition-all group overflow-hidden",
                                isSelected
                                    ? "border-primary bg-primary/5 ring-2 ring-primary/20"
                                    : "border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300 dark:hover:border-slate-700",
                                isLocked && "opacity-60 cursor-not-allowed hover:border-slate-200 dark:hover:border-slate-800"
                            )}
                        >
                            <div className="h-12 w-full flex items-center justify-center pt-2">
                                <div
                                    className={cn(
                                        "w-8 h-8 transition-transform group-hover:scale-110",
                                        shape.radiusClass,
                                        isSelected ? "bg-primary" : (isLocked ? "bg-slate-300 dark:bg-slate-700" : "bg-slate-800 dark:bg-slate-200")
                                    )}
                                    style={shape.clipPathStyle ? { clipPath: shape.clipPathStyle } : undefined}
                                />
                            </div>

                            <span className={cn(
                                "text-xs font-medium z-10",
                                isSelected ? "text-primary font-bold" : "text-slate-600 dark:text-slate-400"
                            )}>
                                {shape.name}
                            </span>

                            {/* Plan Badges & Lock State */}
                            {shape.isPremium ? (
                                <div className="absolute top-2 right-2 flex items-center gap-1">
                                    {isLocked ? (
                                        <div className="bg-amber-100 text-amber-700 p-1 rounded-full flex items-center shadow-sm">
                                            <LockKeyhole className="w-3 h-3" />
                                        </div>
                                    ) : (
                                        <div className="bg-amber-100 text-amber-600 text-[9px] font-bold px-1.5 py-0.5 rounded-sm shadow-sm ring-1 ring-amber-200 outline-none uppercase tracking-wide">
                                            Pro
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="absolute top-2 left-2 flex items-center gap-1 opacity-60">
                                    <div className="bg-emerald-100 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400 text-[9px] font-bold px-1.5 py-0.5 rounded-sm shadow-sm border border-emerald-200 dark:border-emerald-800 uppercase tracking-wide">
                                        Free
                                    </div>
                                </div>
                            )}

                            {isSelected && !isLocked && (
                                <div className="absolute top-2 right-2 size-5 bg-primary rounded-full flex items-center justify-center text-white shadow-md animate-in zoom-in duration-200 overflow-visible">
                                    <Check className="w-3 h-3" />
                                </div>
                            )}
                        </button>
                    )
                })}
            </div>

            {isFreePlan && (
                <div className="p-3 bg-indigo-50 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900 rounded-lg flex items-center justify-between text-xs mt-4">
                    <p className="text-indigo-800 dark:text-indigo-300">
                        Os estilos <span className="font-bold text-amber-600">PRO</span> são exclusivos para assinantes.
                    </p>
                    <a href="/dashboard/planos" className="text-primary font-bold hover:underline shrink-0">
                        Fazer Upgrade
                    </a>
                </div>
            )}
        </div>
    )
}
