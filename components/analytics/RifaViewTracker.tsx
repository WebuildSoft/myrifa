"use client"

import { useEffect, useRef } from "react"

// Short ?u= param mapping — used by ShareCampaign and SharingCard
const U_SOURCE_MAP: Record<string, string> = {
    w: "WhatsApp",
    i: "Instagram",
    f: "Facebook",
    t: "Telegram",
    x: "Twitter/X",
    tt: "TikTok",
    qr: "QR Code",
    l: "Link copiado",
}

function parseUserAgent(ua: string) {
    const device =
        /Mobi|Android|iPhone|iPad|iPod/i.test(ua)
            ? /iPad|Tablet/i.test(ua)
                ? "tablet"
                : "mobile"
            : "desktop"

    const os =
        /Windows/i.test(ua) ? "Windows" :
            /Android/i.test(ua) ? "Android" :
                /iPhone|iPad|iPod/i.test(ua) ? "iOS" :
                    /Mac OS X/i.test(ua) ? "macOS" :
                        /Linux/i.test(ua) ? "Linux" :
                            "Outro"

    const browser =
        /Edg\//i.test(ua) ? "Edge" :
            /OPR\//i.test(ua) ? "Opera" :
                /Chrome/i.test(ua) ? "Chrome" :
                    /Firefox/i.test(ua) ? "Firefox" :
                        /Safari/i.test(ua) ? "Safari" :
                            "Outro"

    return { device, os, browser }
}

function parseReferrer(raw: string): string {
    if (!raw) return "Direto"
    try {
        const hostname = new URL(raw).hostname.toLowerCase()
        if (hostname.includes("whatsapp")) return "WhatsApp"
        if (hostname.includes("instagram")) return "Instagram"
        if (hostname.includes("facebook") || hostname.includes("fb.com")) return "Facebook"
        if (hostname.includes("google")) return "Google"
        if (hostname.includes("twitter") || hostname.includes("t.co")) return "Twitter/X"
        if (hostname.includes("tiktok")) return "TikTok"
        if (hostname.includes("telegram")) return "Telegram"
        if (hostname.includes("youtube")) return "YouTube"
        return hostname.replace(/^www\./, "")
    } catch {
        return "Direto"
    }
}

function getSessionId(): string {
    const key = "analytics_sid"
    let id = sessionStorage.getItem(key)
    if (!id) {
        id = crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2) + Date.now()
        sessionStorage.setItem(key, id)
    }
    return id
}

export function RifaViewTracker({ rifaId }: { rifaId: string }) {
    const startTime = useRef<number>(Date.now())
    const sessionId = useRef<string>("")

    useEffect(() => {
        if (typeof window === "undefined") return

        sessionId.current = getSessionId()

        const ua = navigator.userAgent
        const { device, os, browser } = parseUserAgent(ua)
        const rawReferrer = document.referrer
        const params = new URLSearchParams(window.location.search)

        // ?u= short param takes priority — then fall back to HTTP Referer
        const uParam = params.get("u")
        const referrer = uParam
            ? (U_SOURCE_MAP[uParam] ?? uParam)
            : parseReferrer(rawReferrer)

        // Register the view
        fetch("/api/analytics/view", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                rifaId,
                sessionId: sessionId.current,
                referrer,
                rawReferrer,
                device,
                os,
                browser,
                utmSource: uParam ?? params.get("utm_source"),
                utmMedium: params.get("utm_medium"),
                utmCampaign: params.get("utm_campaign"),
            }),
        }).catch(() => { })

        startTime.current = Date.now()

        // Send duration on page close using sendBeacon (works even when page closes)
        const sendDuration = () => {
            const duration = Math.round((Date.now() - startTime.current) / 1000)
            if (duration < 1) return

            const data = JSON.stringify({ rifaId, sessionId: sessionId.current, duration })
            if (navigator.sendBeacon) {
                navigator.sendBeacon("/api/analytics/view", new Blob([data], { type: "application/json" }))
            }
        }

        window.addEventListener("beforeunload", sendDuration)
        document.addEventListener("visibilitychange", () => {
            if (document.visibilityState === "hidden") sendDuration()
        })

        return () => {
            window.removeEventListener("beforeunload", sendDuration)
        }
    }, [rifaId])

    return null
}
