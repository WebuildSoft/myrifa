import { CreditCard, QrCode, FileText, CheckCircle2, ArrowLeft, Lock, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface StepPaymentMethodProps {
    paymentMethod: "PIX" | "CREDIT_CARD" | "BOLETO" | null
    setPaymentMethod: (method: any) => void
    onProcess: () => void
    onBack: () => void
    loading: boolean
    error?: string
}

const METHODS = [
    {
        key: "PIX",
        label: "PIX",
        subtitle: "Aprovação imediata",
        icon: QrCode,
        badge: "Instantâneo",
        badgeColor: "bg-emerald-500",
    },
    {
        key: "CREDIT_CARD",
        label: "Cartão",
        subtitle: "Em até 12x",
        icon: CreditCard,
        badge: null,
        badgeColor: "",
    },
    {
        key: "BOLETO",
        label: "Boleto",
        subtitle: "Vence em 3 dias",
        icon: FileText,
        badge: null,
        badgeColor: "",
    },
] as const

const METHOD_LABELS: Record<string, string> = {
    PIX: "Gerar QR Code PIX",
    CREDIT_CARD: "Pagar com Cartão",
    BOLETO: "Gerar Boleto",
}

export function StepPaymentMethod({ paymentMethod, setPaymentMethod, onProcess, onBack, loading, error }: StepPaymentMethodProps) {
    return (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm p-8">
            {/* Top back button */}
            <button
                onClick={onBack}
                className="inline-flex items-center gap-2 text-slate-500 hover:text-primary font-bold transition-colors text-sm mb-6"
            >
                <ArrowLeft className="w-4 h-4" />
                Voltar
            </button>

            <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                    <CreditCard className="w-5 h-5" />
                </div>
                <div>
                    <h2 className="text-xl font-black text-slate-900 dark:text-white">2. Forma de pagamento</h2>
                    <p className="text-sm text-slate-400 font-medium mt-0.5">Escolha como deseja pagar</p>
                </div>
            </div>

            {/* Payment method selection */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                {METHODS.map(({ key, label, subtitle, icon: Icon, badge, badgeColor }) => (
                    <button
                        key={key}
                        onClick={() => setPaymentMethod(key)}
                        className={cn(
                            "relative border-2 p-6 rounded-2xl cursor-pointer transition-all duration-200 flex flex-col items-center text-center gap-3 group",
                            paymentMethod === key
                                ? "border-primary bg-primary/5 shadow-md shadow-primary/10 scale-[1.03]"
                                : "border-slate-100 dark:border-slate-800 hover:border-primary/40 hover:bg-primary/3"
                        )}
                    >
                        {badge && (
                            <div className={cn("absolute -top-3 right-4 text-white text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wide", badgeColor)}>
                                {badge}
                            </div>
                        )}
                        {paymentMethod === key && (
                            <CheckCircle2 className="absolute top-3 left-3 w-4 h-4 text-primary" />
                        )}
                        <div className={cn(
                            "w-12 h-12 rounded-2xl flex items-center justify-center transition-colors",
                            paymentMethod === key ? "bg-primary/10" : "bg-slate-100 dark:bg-slate-800"
                        )}>
                            <Icon className={cn("w-6 h-6 transition-colors", paymentMethod === key ? "text-primary" : "text-slate-400 group-hover:text-primary/60")} />
                        </div>
                        <div>
                            <p className={cn("font-black text-base", paymentMethod === key ? "text-primary" : "text-slate-700 dark:text-slate-300")}>{label}</p>
                            <p className="text-[11px] text-slate-400 font-medium mt-0.5">{subtitle}</p>
                        </div>
                    </button>
                ))}
            </div>

            {/* Info & confirmation block — only shows after selecting */}
            {paymentMethod && (
                <div className="animate-in fade-in slide-in-from-bottom-2 duration-300 bg-primary/5 border border-primary/20 rounded-2xl p-6 mb-6 flex flex-col items-center text-center gap-4">
                    {paymentMethod === "PIX" && (
                        <>
                            <div className="w-12 h-12 bg-emerald-500/10 rounded-2xl flex items-center justify-center">
                                <Zap className="w-6 h-6 text-emerald-500" />
                            </div>
                            <div>
                                <p className="font-black text-slate-900 dark:text-white">Pagamento via PIX</p>
                                <p className="text-sm text-slate-500 mt-1 max-w-xs">
                                    Ao clicar em <strong>"Gerar QR Code PIX"</strong>, seu QR Code exclusivo será gerado. Escaneie com o app do seu banco para confirmar.
                                </p>
                            </div>
                        </>
                    )}
                    {paymentMethod === "CREDIT_CARD" && (
                        <>
                            <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center">
                                <CreditCard className="w-6 h-6 text-primary" />
                            </div>
                            <div>
                                <p className="font-black text-slate-900 dark:text-white">Pagamento com Cartão</p>
                                <p className="text-sm text-slate-500 mt-1 max-w-xs">Parcelamento em até 12x. Processamento seguro via Mercado Pago.</p>
                            </div>
                        </>
                    )}
                    {paymentMethod === "BOLETO" && (
                        <>
                            <div className="w-12 h-12 bg-amber-500/10 rounded-2xl flex items-center justify-center">
                                <FileText className="w-6 h-6 text-amber-500" />
                            </div>
                            <div>
                                <p className="font-black text-slate-900 dark:text-white">Pagamento por Boleto</p>
                                <p className="text-sm text-slate-500 mt-1 max-w-xs">O boleto vence em 3 dias úteis. As cotas serão reservadas após a confirmação.</p>
                            </div>
                        </>
                    )}
                </div>
            )}

            {error && <p className="text-sm text-red-500 mb-4 font-bold text-center">{error}</p>}

            {/* Confirm button — only shows after method is selected */}
            {paymentMethod && (
                <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                    <Button
                        onClick={onProcess}
                        disabled={loading}
                        size="lg"
                        className="w-full h-14 rounded-xl font-black gap-2 text-base shadow-lg shadow-primary/20 active:scale-95 transition-all"
                    >
                        {loading ? (
                            <><span className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" /> Gerando pagamento...</>
                        ) : (
                            <>{METHOD_LABELS[paymentMethod]}</>
                        )}
                    </Button>
                </div>
            )}

            <div className="flex justify-end items-center pt-4 border-t border-slate-100 dark:border-slate-800 mt-6">
                <div className="flex items-center gap-2 text-slate-400 text-xs font-bold uppercase tracking-wider">
                    <Lock className="w-3.5 h-3.5 text-emerald-500" />
                    Pagamento 100% Seguro
                </div>
            </div>
        </div>
    )
}
