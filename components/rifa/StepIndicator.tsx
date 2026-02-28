"use client"

import { Check } from "lucide-react"
import { cn } from "@/lib/utils"

interface StepIndicatorProps {
    currentStep: number
    labels: string[]
}

export function StepIndicator({ currentStep, labels }: StepIndicatorProps) {
    return (
        <div className="flex items-center gap-2 mb-8">
            {labels.map((label, i) => {
                const stepNum = i + 1
                const done = currentStep > stepNum
                const active = currentStep === stepNum
                return (
                    <div key={label} className="flex items-center gap-2 flex-1">
                        <div className="flex items-center gap-2 shrink-0">
                            <span className={cn(
                                "w-7 h-7 rounded-full text-xs font-black flex items-center justify-center transition-all",
                                active ? "bg-primary text-white shadow-lg shadow-primary/30" :
                                    done ? "bg-emerald-500 text-white" :
                                        "bg-slate-100 dark:bg-slate-800 text-slate-400"
                            )}>
                                {done ? <Check className="w-3.5 h-3.5" /> : stepNum}
                            </span>
                            <span className={cn(
                                "text-xs font-bold hidden md:block",
                                active ? "text-primary" : done ? "text-emerald-600" : "text-slate-400"
                            )}>{label}</span>
                        </div>
                        {i < labels.length - 1 && (
                            <div className="flex-1 h-px bg-slate-100 dark:bg-slate-800 mx-1" />
                        )}
                    </div>
                )
            })}
        </div>
    )
}
