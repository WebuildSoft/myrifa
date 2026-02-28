"use client"

import { QrCode, CreditCard, FileText, CheckCircle2, ChevronRight, ArrowLeft, Lock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export type PaymentMethod = "PIX" | "CREDIT_CARD" | "BOLETO"

interface StepPaymentMethodProps {
    paymentMethod: PaymentMethod | null
    onSelect: (method: PaymentMethod) => void
    onBack: () => void
    onProceed: () => void
    formattedTotal: string
    loading?: boolean
    error?: string
}

export function StepPaymentMethod({
    paymentMethod,
    onSelect,
    onBack,
    onProceed,
    formattedTotal,
    loading,
    error,
}: StepPaymentMethodProps) {
    return (
        <div className="flex flex-col flex-1">
            <div className="flex items-center gap-3 mb-6">
                <button onClick={onBack} className="text-slate-400 hover:text-primary transition-colors">
                    <ArrowLeft className="w-5 h-5" />
                </button>
                <div>
                    <h2 className="text-2xl font-black text-slate-900 dark:text-white">Forma de pagamento</h2>
                    <p className="text-sm text-slate-500">Como deseja pagar {formattedTotal}?</p>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-3 mb-6">
                {/* PIX */}
                <button
                    onClick={() => onSelect("PIX")}
                    className={cn(
                        "relative flex items-center gap-4 p-4 rounded-2xl border-2 text-left transition-all",
                        paymentMethod === "PIX"
                            ? "border-primary bg-primary/5"
                            : "border-slate-100 dark:border-slate-800 hover:border-primary/30"
                    )}
                >
                    <div className={cn(
                        "w-12 h-12 rounded-xl flex items-center justify-center shrink-0 transition-colors",
                        paymentMethod === "PIX" ? "bg-primary text-white" : "bg-slate-100 dark:bg-slate-800 text-slate-500"
                    )}>
                        <QrCode className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                        <p className="font-bold text-slate-900 dark:text-white">PIX</p>
                        <p className="text-xs text-emerald-600 font-medium">Aprovação instantânea ✓</p>
                    </div>
                    <span className="text-[10px] bg-emerald-100 text-emerald-700 font-bold px-2 py-0.5 rounded-full uppercase">Recomendado</span>
                    {paymentMethod === "PIX" && <CheckCircle2 className="absolute top-3 right-3 w-4 h-4 text-primary" />}
                </button>

                {/* Card */}
                <button
                    onClick={() => onSelect("CREDIT_CARD")}
                    className={cn(
                        "flex items-center gap-4 p-4 rounded-2xl border-2 text-left transition-all",
                        paymentMethod === "CREDIT_CARD"
                            ? "border-primary bg-primary/5"
                            : "border-slate-100 dark:border-slate-800 hover:border-primary/30"
                    )}
                >
                    <div className={cn(
                        "w-12 h-12 rounded-xl flex items-center justify-center shrink-0 transition-colors",
                        paymentMethod === "CREDIT_CARD" ? "bg-primary text-white" : "bg-slate-100 dark:bg-slate-800 text-slate-500"
                    )}>
                        <CreditCard className="w-5 h-5" />
                    </div>
                    <div>
                        <p className="font-bold text-slate-900 dark:text-white">Cartão de Crédito</p>
                        <p className="text-xs text-slate-500">Até 12x com juros</p>
                    </div>
                    {paymentMethod === "CREDIT_CARD" && <CheckCircle2 className="ml-auto w-4 h-4 text-primary" />}
                </button>

                {/* Boleto */}
                <button
                    onClick={() => onSelect("BOLETO")}
                    className={cn(
                        "flex items-center gap-4 p-4 rounded-2xl border-2 text-left transition-all",
                        paymentMethod === "BOLETO"
                            ? "border-primary bg-primary/5"
                            : "border-slate-100 dark:border-slate-800 hover:border-primary/30"
                    )}
                >
                    <div className={cn(
                        "w-12 h-12 rounded-xl flex items-center justify-center shrink-0 transition-colors",
                        paymentMethod === "BOLETO" ? "bg-primary text-white" : "bg-slate-100 dark:bg-slate-800 text-slate-500"
                    )}>
                        <FileText className="w-5 h-5" />
                    </div>
                    <div>
                        <p className="font-bold text-slate-900 dark:text-white">Boleto Bancário</p>
                        <p className="text-xs text-slate-500">Prazo de 1-3 dias úteis</p>
                    </div>
                    {paymentMethod === "BOLETO" && <CheckCircle2 className="ml-auto w-4 h-4 text-primary" />}
                </button>
            </div>

            {error && <p className="text-sm text-red-500 mb-3">{error}</p>}

            <div className="flex-1" />

            <Button
                onClick={onProceed}
                disabled={!paymentMethod || loading}
                size="lg"
                className="w-full h-12 rounded-xl font-bold gap-2"
            >
                {loading ? (
                    <><span className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" /> Processando...</>
                ) : (
                    <>Prosseguir para Pagamento <ChevronRight className="w-4 h-4" /></>
                )}
            </Button>

            <div className="flex items-center justify-center gap-2 mt-4 text-xs text-slate-400">
                <Lock className="w-3 h-3 text-emerald-500" />
                Pagamento 100% seguro e criptografado
            </div>
        </div>
    )
}
