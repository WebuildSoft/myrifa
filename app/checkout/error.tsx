"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { AlertTriangle, RefreshCw, ArrowLeft } from "lucide-react"

export default function CheckoutError({
    error,
    reset,
}: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    useEffect(() => {
        fetch("/api/sistema-x7k2/alert", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                context: "Checkout - Erro na página",
                message: error.message || "Erro desconhecido no checkout",
                digest: error.digest,
            }),
        }).catch(() => { })
    }, [error])

    return (
        <div className="min-h-screen bg-[#020617] flex items-center justify-center p-6">
            <div className="text-center max-w-md">
                <div className="w-20 h-20 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto mb-6 shadow-[0_0_30px_rgba(239,68,68,0.1)]">
                    <AlertTriangle className="h-10 w-10 text-red-400" />
                </div>
                <h1 className="text-3xl font-black text-white uppercase tracking-tight mb-2 italic">
                    Ops! Algo deu errado
                </h1>
                <p className="text-slate-400 text-sm mb-2 leading-relaxed">
                    Houve um problema no processo de checkout. Nenhuma cobrança foi realizada.
                </p>
                <p className="text-slate-500 text-xs mb-8">
                    Nossa equipe foi notificada automaticamente.
                </p>
                <div className="flex gap-3 justify-center">
                    <Button
                        onClick={reset}
                        className="rounded-xl bg-indigo-500 hover:bg-indigo-600 text-white font-black text-xs uppercase tracking-widest shadow-lg shadow-indigo-500/20"
                    >
                        <RefreshCw className="mr-2 h-4 w-4" />
                        Tentar Novamente
                    </Button>
                    <Button
                        variant="outline"
                        onClick={() => window.history.back()}
                        className="rounded-xl border-white/10 text-white hover:bg-white/5 font-black text-xs uppercase tracking-widest"
                    >
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Voltar
                    </Button>
                </div>
            </div>
        </div>
    )
}
