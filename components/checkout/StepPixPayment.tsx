import Image from "next/image"
import { QrCode, Copy, Check, Clock } from "lucide-react"
import { cn } from "@/lib/utils"

interface StepPixPaymentProps {
    pixData: { qrCode?: string; qrCodeCopy?: string; txId?: string }
    secondsLeft: number
    minutesLeft: string
    secsLeft: string
    copied: boolean
    onCopy: () => void
    onSimulateSuccess?: () => void
}

export function StepPixPayment({ pixData, secondsLeft, minutesLeft, secsLeft, copied, onCopy, onSimulateSuccess }: StepPixPaymentProps) {
    return (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm p-8">
            <div className="flex flex-col items-center text-center">
                <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-2">Pague com PIX</h2>
                <p className="text-slate-500 text-sm mb-8 max-w-sm">
                    Escaneie o QR Code com o app do seu banco para confirmar a participação.
                </p>

                <div className="bg-white p-5 rounded-2xl shadow-xl ring-4 ring-primary/10 mb-6">
                    <div className="w-52 h-52 relative">
                        {pixData.qrCode ? (
                            <Image
                                src={`data:image/jpeg;base64,${pixData.qrCode}`}
                                alt="QR Code PIX"
                                fill
                                className="object-contain rounded-xl"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center">
                                <QrCode className="w-16 h-16 text-slate-300" />
                            </div>
                        )}
                    </div>
                </div>

                <div className="flex items-center gap-2 w-full max-w-md bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 mb-4">
                    <code className="text-xs text-slate-600 dark:text-slate-400 flex-1 truncate font-mono">
                        {pixData.qrCodeCopy ?? "Gerando código..."}
                    </code>
                    <button onClick={onCopy} className="text-primary hover:text-primary/80 shrink-0 ml-2">
                        {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                    </button>
                </div>
                {copied && <p className="text-xs text-emerald-600 font-bold mb-3 font-bold">Código copiado!</p>}

                <div className="flex items-center gap-2 text-slate-500 text-sm mb-6">
                    <Clock className="w-4 h-4 text-primary" />
                    Expira em{" "}
                    <span className={cn("font-black tabular-nums ml-1", secondsLeft < 300 ? "text-red-500" : "text-primary")}>
                        {minutesLeft}:{secsLeft}
                    </span>
                </div>

                <div className="flex items-center gap-2 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 text-xs p-3 rounded-xl w-full max-w-md">
                    <span className="animate-spin rounded-full h-3 w-3 border-2 border-blue-600 border-t-transparent shrink-0" />
                    Aguardando confirmação do pagamento... Esta tela será atualizada automaticamente.
                </div>

                {onSimulateSuccess && (
                    <button onClick={onSimulateSuccess} className="mt-6 text-xs text-slate-300 hover:text-slate-500 underline">
                        Simular aprovação (Dev)
                    </button>
                )}
            </div>
        </div>
    )
}
