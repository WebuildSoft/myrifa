import { Check, User, CreditCard, QrCode } from "lucide-react"
import { cn } from "@/lib/utils"

const STEPS = [
    { label: "Dados", labelFull: "Seus dados", icon: User },
    { label: "Pagamento", labelFull: "Pagamento", icon: CreditCard },
    { label: "PIX", labelFull: "Pagar", icon: QrCode },
]

interface CheckoutStepsProps {
    currentStep: 1 | 2 | 3 | 4
    primaryColor?: string | null
}

export function CheckoutSteps({ currentStep, primaryColor }: CheckoutStepsProps) {
    if (currentStep >= 4) return null

    return (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm px-4 py-4 md:px-6">
            {/* Mobile: compact progress bar */}
            <div className="flex md:hidden items-center gap-3">
                {STEPS.map(({ label, icon: Icon }, i) => {
                    const stepNum = i + 1
                    const done = currentStep > stepNum
                    const active = currentStep === stepNum

                    return (
                        <div key={label} className="flex items-center flex-1 gap-2">
                            <div
                                className={cn(
                                    "w-8 h-8 rounded-full text-sm font-black flex items-center justify-center shrink-0 transition-all duration-300",
                                    active ? "text-white shadow-md scale-110" :
                                        done ? "bg-emerald-500 text-white" :
                                            "bg-slate-100 dark:bg-slate-800 text-slate-400"
                                )}
                                style={active ? { backgroundColor: primaryColor || 'var(--primary)', boxShadow: `0 4px 6px -1px ${primaryColor || '#7c3aed'}30` } : {}}
                            >
                                {done ? <Check className="w-3.5 h-3.5" /> : <Icon className="w-3.5 h-3.5" />}
                            </div>
                            <span
                                className={cn(
                                    "text-xs font-black whitespace-nowrap",
                                    active ? "" : done ? "text-emerald-600 dark:text-emerald-400" : "text-slate-400"
                                )}
                                style={active ? { color: primaryColor || 'var(--primary)' } : {}}
                            >
                                {label}
                            </span>
                            {i < STEPS.length - 1 && (
                                <div className="flex-1 h-0.5 rounded-full overflow-hidden bg-slate-100 dark:bg-slate-800">
                                    <div className={cn(
                                        "h-full rounded-full transition-all duration-500",
                                        done ? "bg-emerald-500 w-full" : "bg-transparent w-0"
                                    )} />
                                </div>
                            )}
                        </div>
                    )
                })}
            </div>

            {/* Desktop: full step display */}
            <div className="hidden md:flex items-center gap-2">
                {STEPS.map(({ labelFull, icon: Icon }, i) => {
                    const stepNum = i + 1
                    const done = currentStep > stepNum
                    const active = currentStep === stepNum

                    return (
                        <div key={labelFull} className="flex items-center gap-2 flex-1">
                            <span
                                className={cn(
                                    "w-9 h-9 rounded-full text-sm font-black flex items-center justify-center shrink-0 transition-all duration-300",
                                    active ? "text-white shadow-lg scale-110" :
                                        done ? "bg-emerald-500 text-white" :
                                            "bg-slate-100 dark:bg-slate-800 text-slate-400"
                                )}
                                style={active ? { backgroundColor: primaryColor || 'var(--primary)', boxShadow: `0 10px 15px -3px ${primaryColor || '#7c3aed'}30` } : {}}
                            >
                                {done ? <Check className="w-4 h-4" /> : <Icon className="w-4 h-4" />}
                            </span>
                            <div className="flex flex-col">
                                <span
                                    className={cn(
                                        "font-black text-sm leading-none",
                                        active ? "" : done ? "text-emerald-600 dark:text-emerald-400" : "text-slate-400"
                                    )}
                                    style={active ? { color: primaryColor || 'var(--primary)' } : {}}
                                >
                                    {labelFull}
                                </span>
                                <span className="text-[10px] text-slate-400 font-medium mt-0.5">
                                    {done ? "Concluído" : active ? "Em andamento" : "Aguardando"}
                                </span>
                            </div>
                            {i < STEPS.length - 1 && (
                                <div className="flex-1 h-0.5 rounded-full overflow-hidden bg-slate-100 dark:bg-slate-800 mx-4">
                                    <div className={cn(
                                        "h-full rounded-full transition-all duration-500",
                                        done ? "bg-emerald-500 w-full" : "bg-transparent w-0"
                                    )} />
                                </div>
                            )}
                        </div>
                    )
                })}
            </div>

            {/* Mobile: current step label below */}
            <div className="flex md:hidden items-center justify-center mt-3 pt-3 border-t border-slate-50 dark:border-slate-800">
                <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest">
                    Etapa {currentStep} de {STEPS.length} —
                    <span className="text-primary ml-1" style={{ color: primaryColor || 'var(--primary)' }}>{STEPS[currentStep - 1]?.labelFull}</span>
                </span>
            </div>
        </div>
    )
}
