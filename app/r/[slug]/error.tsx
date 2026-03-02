"use client"

import { useEffect } from "react"
import { AlertTriangle, RefreshCw, ArrowLeft } from "lucide-react"

export default function RifaPublicError({
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
                context: "Página Pública da Rifa - Erro",
                message: error.message || "Erro ao carregar página da rifa",
                digest: error.digest,
            }),
        }).catch(() => { })
    }, [error])

    return (
        <div className="min-h-screen bg-gradient-to-br from-violet-50 via-white to-indigo-50 flex items-center justify-center p-6">
            <div className="text-center max-w-sm w-full">
                {/* Icon */}
                <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-violet-100 to-indigo-100 border-2 border-violet-200 flex items-center justify-center mx-auto mb-8 shadow-lg shadow-violet-100">
                    <AlertTriangle className="h-10 w-10 text-violet-500" />
                </div>

                {/* Text */}
                <h1 className="text-2xl font-black text-slate-800 mb-3">
                    Rifa Indisponível
                </h1>
                <p className="text-slate-500 text-sm leading-relaxed mb-8">
                    Esta rifa está temporariamente indisponível.<br />
                    Tente novamente em alguns instantes.
                </p>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <button
                        onClick={reset}
                        className="inline-flex items-center justify-center gap-2 bg-violet-600 hover:bg-violet-700 active:scale-95 text-white font-bold text-sm px-6 py-3 rounded-2xl transition-all shadow-lg shadow-violet-200"
                    >
                        <RefreshCw className="h-4 w-4" />
                        Tentar Novamente
                    </button>
                    <a
                        href="/rifas"
                        className="inline-flex items-center justify-center gap-2 bg-white hover:bg-slate-50 active:scale-95 text-slate-700 font-bold text-sm px-6 py-3 rounded-2xl border border-slate-200 transition-all shadow-sm"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Ver Rifas
                    </a>
                </div>
            </div>
        </div>
    )
}
