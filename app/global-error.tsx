"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { AlertTriangle, RefreshCw, Home } from "lucide-react"

export default function GlobalError({
    error,
    reset,
}: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    useEffect(() => {
        // Report to server for WhatsApp alert
        fetch("/api/sistema-x7k2/alert", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                context: "Erro Global (Layout Principal)",
                message: error.message || "Erro desconhecido",
                digest: error.digest,
            }),
        }).catch(() => { }) // silent fail
    }, [error])

    return (
        <html lang="pt-BR">
            <body className="bg-[#020617] min-h-screen flex items-center justify-center p-6">
                <div className="text-center max-w-md">
                    <div className="w-20 h-20 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto mb-6">
                        <AlertTriangle className="h-10 w-10 text-red-400" />
                    </div>
                    <h1 className="text-3xl font-black text-white uppercase tracking-tight mb-2">
                        Erro Inesperado
                    </h1>
                    <p className="text-slate-400 text-sm mb-8">
                        Algo deu errado no sistema. Nossa equipe foi notificada automaticamente.
                    </p>
                    {error.digest && (
                        <p className="text-[10px] font-mono text-slate-600 mb-6">
                            ID: {error.digest}
                        </p>
                    )}
                    <div className="flex gap-3 justify-center">
                        <Button
                            onClick={reset}
                            className="rounded-xl bg-indigo-500 hover:bg-indigo-600 text-white font-black text-xs uppercase tracking-widest"
                        >
                            <RefreshCw className="mr-2 h-4 w-4" />
                            Tentar Novamente
                        </Button>
                        <Button
                            variant="outline"
                            onClick={() => window.location.href = "/"}
                            className="rounded-xl border-white/10 text-white hover:bg-white/5 font-black text-xs uppercase tracking-widest"
                        >
                            <Home className="mr-2 h-4 w-4" />
                            Início
                        </Button>
                    </div>
                </div>
            </body>
        </html>
    )
}
