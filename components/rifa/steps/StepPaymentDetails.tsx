"use client"

import Image from "next/image"
import { QrCode, Copy, Check, Clock } from "lucide-react"
import { cn } from "@/lib/utils"

interface StepPaymentDetailsProps {
    pixData: { qrCode?: string; qrCodeCopy?: string }
    secondsLeft: number
    onCopy: () => void
    copied: boolean
    onSimulateSuccess?: () => void
}

export function StepPaymentDetails({
    pixData,
    secondsLeft,
    onCopy,
    copied,
    onSimulateSuccess,
}: StepPaymentDetailsProps) {
    const minutesLeft = String(Math.floor(secondsLeft / 60)).padStart(2, "0")
    const secsLeft = String(secondsLeft % 60).padStart(2, "0")

    return (
        <div className="flex flex-col flex-1 items-center text-center">
            <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-1">Pague com PIX</h2>
            <p className="text-sm text-slate-500 mb-6 max-w-xs">
                Escaneie o QR Code com o app do seu banco para confirmar a participação.
            </p>

            {/* QR code */}
            <div className="bg-white p-4 rounded-2xl shadow-xl ring-4 ring-primary/10 mb-6">
                <div className="w-48 h-48 relative flex items-center justify-center">
                    {pixData.qrCode ? (
                        <Image
                            src={`data:image/jpeg;base64,${pixData.qrCode}`}
                            alt="QR Code PIX"
                            fill
                            className="object-contain rounded-xl"
                        />
                    ) : (
                        <QrCode className="w-16 h-16 text-slate-300" />
                    )}
                </div>
            </div>

            {/* Copy-paste code */}
            <div className="flex items-center gap-2 w-full max-w-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2.5 mb-4">
                <code className="text-xs text-slate-600 dark:text-slate-400 flex-1 truncate font-mono">
                    {pixData.qrCodeCopy ?? "Gerando código..."}
                </code>
                <button onClick={onCopy} className="text-primary hover:text-primary/80 transition-colors shrink-0">
                    {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                </button>
            </div>

            {copied && (
                <p className="text-xs text-emerald-600 font-bold mb-3">Código copiado!</p>
            )}

            {/* Timer */}
            <div className="flex items-center gap-2 text-slate-500 text-sm mb-6">
                <Clock className="w-4 h-4 text-primary" />
                Expira em{" "}
                <span className={cn(
                    "font-black tabular-nums",
                    secondsLeft < 300 ? "text-red-500" : "text-primary"
                )}>
                    {minutesLeft}:{secsLeft}
                </span>
            </div>

            {/* Waiting indicator */}
            <div className="flex items-center gap-2 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 text-xs p-3 rounded-xl w-full max-w-sm">
                <span className="animate-spin rounded-full h-3 w-3 border-2 border-blue-600 border-t-transparent shrink-0" />
                Aguardando confirmação do pagamento...
            </div>

            {/* Dev helper */}
            {onSimulateSuccess && (
                <button
                    onClick={onSimulateSuccess}
                    className="mt-6 text-xs text-slate-300 hover:text-slate-500 underline"
                >
                    Simular aprovação (Dev)
                </button>
            )}
        </div>
    )
}
