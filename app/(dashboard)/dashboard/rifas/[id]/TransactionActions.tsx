"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Check, X, Loader2 } from "lucide-react"
import { confirmPaymentAction, cancelTransactionAction } from "@/actions/transactions"
import { toast } from "sonner"

interface TransactionActionsProps {
    transactionId: string
    status: string
}

export function TransactionActions({ transactionId, status }: TransactionActionsProps) {
    const [loading, setLoading] = useState<"confirm" | "cancel" | null>(null)

    if (status !== "PENDING") return null

    const handleConfirm = async () => {
        if (!window.confirm("Confirmar recebimento deste pagamento?")) return

        setLoading("confirm")
        const res = await confirmPaymentAction(transactionId)
        setLoading(null)

        if (res.success) {
            toast.success("Pagamento confirmado com sucesso!")
        } else {
            toast.error(res.error || "Erro ao confirmar pagamento")
        }
    }

    const handleCancel = async () => {
        if (!window.confirm("Deseja realmente cancelar esta reserva? Os números ficarão disponíveis novamente.")) return

        setLoading("cancel")
        const res = await cancelTransactionAction(transactionId)
        setLoading(null)

        if (res.success) {
            toast.success("Transação cancelada e números liberados.")
        } else {
            toast.error(res.error || "Erro ao cancelar transação")
        }
    }

    return (
        <div className="flex items-center justify-end gap-2">
            <Button
                size="sm"
                variant="outline"
                className="h-8 w-8 p-0 border-emerald-500/30 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 rounded-lg transition-all"
                onClick={handleConfirm}
                disabled={!!loading}
                title="Confirmar Pagamento"
            >
                {loading === "confirm" ? (
                    <Loader2 className="h-4 w-4 animate-spin text-emerald-500" />
                ) : (
                    <Check className="h-4 w-4" />
                )}
            </Button>

            <Button
                size="sm"
                variant="outline"
                className="h-8 w-8 p-0 border-red-500/30 text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-all"
                onClick={handleCancel}
                disabled={!!loading}
                title="Cancelar e Liberar Números"
            >
                {loading === "cancel" ? (
                    <Loader2 className="h-4 w-4 animate-spin text-red-500" />
                ) : (
                    <X className="h-4 w-4" />
                )}
            </Button>
        </div>
    )
}
