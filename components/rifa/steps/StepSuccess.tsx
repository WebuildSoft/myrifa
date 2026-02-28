"use client"

import { CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"

interface StepSuccessProps {
    selectedNumbers: number[]
    onClose: () => void
}

export function StepSuccess({ selectedNumbers, onClose }: StepSuccessProps) {
    const handleBackToRaffle = () => {
        onClose()
        window.location.reload()
    }

    return (
        <div className="flex flex-col flex-1 items-center justify-center text-center py-4 space-y-4">
            <div className="w-24 h-24 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center mb-2">
                <CheckCircle2 className="w-12 h-12 text-emerald-500" />
            </div>
            <div className="space-y-1">
                <h2 className="text-3xl font-black text-slate-900 dark:text-white">Pagamento confirmado!</h2>
                <p className="text-slate-500 max-w-xs mx-auto">
                    Você comprou <strong>{selectedNumbers.length} número{selectedNumbers.length > 1 ? "s" : ""}</strong>. A confirmação foi enviada para o seu WhatsApp. Boa sorte! 🍀
                </p>
            </div>
            <div className="flex flex-wrap justify-center gap-2 mt-2">
                {selectedNumbers.slice(0, 8).map((n) => (
                    <span key={n} className="bg-primary/10 text-primary px-3 py-1 rounded-full font-black text-sm">
                        {String(n).padStart(3, "0")}
                    </span>
                ))}
                {selectedNumbers.length > 8 && (
                    <span className="bg-slate-100 text-slate-500 px-3 py-1 rounded-full font-bold text-sm">
                        +{selectedNumbers.length - 8}
                    </span>
                )}
            </div>
            <Button
                onClick={handleBackToRaffle}
                size="lg"
                className="w-full max-w-xs h-12 rounded-xl font-bold mt-4"
            >
                Voltar ao Sorteio
            </Button>
        </div>
    )
}
