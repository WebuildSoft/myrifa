"use client"

import { useEffect, useRef } from "react"
import { usePathname } from "next/navigation"

function generateVisitorId(): string {
    if (typeof crypto !== "undefined" && crypto.randomUUID) {
        return crypto.randomUUID()
    }
    return Math.random().toString(36).substring(2) + Date.now().toString(36)
}

export function VisitorTracker() {
    const pathname = usePathname()
    const visitorIdRef = useRef<string | null>(null)

    useEffect(() => {
        if (typeof window !== "undefined") {
            let id = localStorage.getItem("visitor_id")
            if (!id) {
                id = generateVisitorId()
                localStorage.setItem("visitor_id", id)
            }
            visitorIdRef.current = id
        }

        const sendPing = async () => {
            if (!visitorIdRef.current) return
            try {
                await fetch("/api/visitor/ping", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        visitorId: visitorIdRef.current,
                        path: pathname,
                        // NOTE: userId is intentionally NOT sent from the client.
                        // The server reads it from the authenticated session cookie.
                    }),
                    keepalive: true,
                })
            } catch {
                // Silent error for tracking
            }
        }

        sendPing()
        const interval = setInterval(sendPing, 60000)
        return () => clearInterval(interval)
    }, [pathname])

    return null
}
