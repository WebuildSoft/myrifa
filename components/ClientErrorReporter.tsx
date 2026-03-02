"use client"

import { useEffect } from "react"

/**
 * Invisible component that captures unhandled JS errors and promise rejections
 * and reports them to the alert API for WhatsApp notification.
 */
export function ClientErrorReporter() {
    useEffect(() => {
        const reportError = (context: string, message: string) => {
            // Don't report in dev
            if (process.env.NODE_ENV === "development") return

            fetch("/api/sistema-x7k2/alert", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ context, message }),
                keepalive: true,
            }).catch(() => { })
        }

        const handleError = (event: ErrorEvent) => {
            if (!event.message || event.message === "Script error.") return
            reportError(
                `Erro JavaScript (${event.filename?.split("/").pop() || "desconhecido"})`,
                `${event.message} (linha ${event.lineno})`
            )
        }

        const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
            const msg = event.reason?.message || String(event.reason) || "Promise rejeitada"
            if (msg === "undefined") return
            reportError("Promise não tratada (cliente)", msg)
        }

        window.addEventListener("error", handleError)
        window.addEventListener("unhandledrejection", handleUnhandledRejection)

        return () => {
            window.removeEventListener("error", handleError)
            window.removeEventListener("unhandledrejection", handleUnhandledRejection)
        }
    }, [])

    return null
}
