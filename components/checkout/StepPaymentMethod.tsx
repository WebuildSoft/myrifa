import Image from "next/image"
import { CreditCard, QrCode, FileText, CheckCircle2, Check, ArrowLeft, Lock } from "lucide-react"
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

export function StepPaymentMethod({ paymentMethod, setPaymentMethod, onProcess, onBack, loading, error }: StepPaymentMethodProps) {
    return (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm p-8">
            <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                    <CreditCard className="w-5 h-5" />
                </div>
                <h2 className="text-xl font-black text-slate-900 dark:text-white">2. Forma de pagamento</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                {/* PIX */}
                <button
                    onClick={() => setPaymentMethod("PIX")}
                    className={cn(
                        "relative border-2 p-5 rounded-2xl cursor-pointer transition-all flex flex-col items-center text-center gap-2",
                        paymentMethod === "PIX"
                            ? "border-primary bg-primary/5"
                            : "border-slate-100 dark:border-slate-800 hover:border-primary/30"
                    )}
                >
                    <div className="absolute -top-3 right-4 bg-emerald-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full uppercase">Instantâneo</div>
                    <QrCode className={cn("w-8 h-8", paymentMethod === "PIX" ? "text-primary" : "text-slate-400")} />
                    <span className={cn("font-black", paymentMethod === "PIX" ? "text-primary" : "text-slate-600 dark:text-slate-400")}>PIX</span>
                    {paymentMethod === "PIX" && <CheckCircle2 className="absolute top-2 left-2 w-4 h-4 text-primary" />}
                </button>

                {/* Card */}
                <button
                    onClick={() => setPaymentMethod("CREDIT_CARD")}
                    className={cn(
                        "border-2 p-5 rounded-2xl cursor-pointer transition-all flex flex-col items-center text-center gap-2",
                        paymentMethod === "CREDIT_CARD"
                            ? "border-primary bg-primary/5"
                            : "border-slate-100 dark:border-slate-800 hover:border-primary/30"
                    )}
                >
                    <CreditCard className={cn("w-8 h-8", paymentMethod === "CREDIT_CARD" ? "text-primary" : "text-slate-400")} />
                    <span className={cn("font-black", paymentMethod === "CREDIT_CARD" ? "text-primary" : "text-slate-600 dark:text-slate-400")}>Cartão até 12x</span>
                </button>

                {/* Boleto */}
                <button
                    onClick={() => setPaymentMethod("BOLETO")}
                    className={cn(
                        "border-2 p-5 rounded-2xl cursor-pointer transition-all flex flex-col items-center text-center gap-2",
                        paymentMethod === "BOLETO"
                            ? "border-primary bg-primary/5"
                            : "border-slate-100 dark:border-slate-800 hover:border-primary/30"
                    )}
                >
                    <FileText className={cn("w-8 h-8", paymentMethod === "BOLETO" ? "text-primary" : "text-slate-400")} />
                    <span className={cn("font-black", paymentMethod === "BOLETO" ? "text-primary" : "text-slate-600 dark:text-slate-400")}>Boleto</span>
                </button>
            </div>

            <div className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-8 flex flex-col items-center text-center">
                <h3 className="text-lg font-black mb-2">Pague com PIX</h3>
                <p className="text-slate-500 text-sm max-w-sm mb-6">Escaneie o QR Code com o aplicativo do seu banco para confirmar a participação.</p>

                <div className="bg-white p-4 rounded-2xl shadow-xl mb-6 ring-4 ring-primary/5">
                    <Image
                        src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=pagamento_demo`}
                        alt="QR Code Preview"
                        width={200}
                        height={200}
                        className="rounded-xl opacity-40"
                        unoptimized
                    />
                </div>

                {error && <p className="text-sm text-red-500 mb-4 font-bold">{error}</p>}

                <div className="flex flex-col gap-4 w-full max-w-sm">
                    <Button
                        onClick={onProcess}
                        disabled={!paymentMethod || loading}
                        size="lg"
                        className="w-full h-13 rounded-xl font-black gap-2"
                    >
                        {loading ? (
                            <><span className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" /> Processando...</>
                        ) : (
                            <><Check className="w-5 h-5" /> Pagar Agora</>
                        )}
                    </Button>
                </div>
            </div>

            <div className="flex justify-between items-center pt-6 border-t border-slate-100 dark:border-slate-800 mt-6">
                <button onClick={onBack} className="flex items-center gap-2 text-slate-500 hover:text-primary font-bold transition-colors text-sm">
                    <ArrowLeft className="w-4 h-4" />
                    Voltar
                </button>
                <div className="flex items-center gap-2 text-slate-400 text-xs font-bold uppercase tracking-wider">
                    <Lock className="w-3.5 h-3.5 text-emerald-500" />
                    Pagamento 100% Seguro
                </div>
            </div>
        </div>
    )
}
