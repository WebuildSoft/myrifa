import { NextRequest, NextResponse } from "next/server"
import { sendSystemAlert } from "@/lib/alert"
import { headers } from "next/headers"

// In-memory rate limiter (resets on server restart)
const lastAlertTime: Record<string, number> = {}
const RATE_LIMIT_MS = 5 * 60 * 1000 // 5 minutes between same-context alerts

export async function POST(req: NextRequest) {
    try {
        const body = await req.json()
        const { context, message, digest, stack, url, userId, source = "client" } = body

        if (!context || !message) {
            return NextResponse.json({ error: "Missing fields" }, { status: 400 })
        }

        // Simple rate limiting to avoid alert spam
        const now = Date.now()
        const lastSent = lastAlertTime[context] || 0
        if (now - lastSent < RATE_LIMIT_MS) {
            return NextResponse.json({ skipped: "rate_limited" })
        }
        lastAlertTime[context] = now

        const userAgent = req.headers.get("user-agent") || undefined
        const fullMessage = digest ? `${message} (digest: ${digest})` : message

        await sendSystemAlert(context, fullMessage, {
            severity: "HIGH",
            source,
            stack,
            url,
            userAgent,
            userId,
        })

        return NextResponse.json({ success: true })
    } catch (error) {
        return NextResponse.json({ error: "Failed to send alert" }, { status: 500 })
    }
}
