import { Check } from "lucide-react"
import { cn } from "@/lib/utils"

const STEP_LABELS = ["Seus dados", "Pagamento", "PIX"]

interface CheckoutStepsProps {
    currentStep: 1 | 2 | 3 | 4
}

export function CheckoutSteps({ currentStep }: CheckoutStepsProps) {
    if (currentStep >= 4) return null

    return (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm p-6">
            <div className="flex flex-col md:flex-row justify-between gap-4 md:items-center">
                {STEP_LABELS.map((label, i) => {
                    const stepNum = (i + 1) as 1 | 2 | 3
                    const done = currentStep > stepNum
                    const active = currentStep === stepNum

                    return (
                        <div key={label} className="flex items-center gap-2 flex-1">
                            <span className={cn(
                                "w-8 h-8 rounded-full text-sm font-black flex items-center justify-center shrink-0 transition-all",
                                active ? "bg-primary text-white shadow-lg shadow-primary/30" :
                                    done ? "bg-emerald-500 text-white" :
                                        "bg-slate-100 dark:bg-slate-800 text-slate-400"
                            )}>
                                {done ? <Check className="w-4 h-4" /> : stepNum}
                            </span>
                            <span className={cn(
                                "font-bold text-sm",
                                active ? "text-primary" : done ? "text-emerald-600" : "text-slate-400"
                            )}>{label}</span>
                            {i < STEP_LABELS.length - 1 && (
                                <div className="hidden md:block flex-1 h-px bg-slate-100 dark:bg-slate-800 mx-4" />
                            )}
                        </div>
                    )
                })}
            </div>
        </div>
    )
}
