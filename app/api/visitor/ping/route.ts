import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"
import { rateLimit, getIP, rateLimitResponse } from "@/lib/rate-limit"

export async function POST(req: NextRequest) {
    // Rate limit: max 20 pings per IP per minute
    const ip = getIP(req)
    const rl = rateLimit(ip + ":visitor_ping", { limit: 20, windowMs: 60_000 })
    if (!rl.success) return rateLimitResponse(rl.resetIn)

    try {
        const { visitorId, path } = await req.json()

        if (!visitorId) {
            return NextResponse.json({ error: "Missing visitorId" }, { status: 400 })
        }

        const userAgent = req.headers.get("user-agent") || "Unknown"
        const ip = req.headers.get("x-forwarded-for")?.split(",")[0] || "Unknown"

        // SECURITY: Get authenticated user from server-side session ONLY.
        // Never trust userId from the request body — it could be forged.
        const session = await auth()
        const authenticatedUserId = session?.user?.id ?? null

        // Update the logged-in user's lastActiveAt using the verified server-side ID
        if (authenticatedUserId) {
            await (prisma as any).user.update({
                where: { id: authenticatedUserId },
                data: { lastActiveAt: new Date() }
            })
        }

        // Always upsert visitor record (for anonymous visitor count)
        await (prisma as any).visitor.upsert({
            where: { visitorId },
            update: {
                lastSeen: new Date(),
                path,
                userAgent,
                ip
            },
            create: {
                visitorId,
                path,
                userAgent,
                ip
            }
        })

        // Clean up old visitors (older than 10 minutes)
        const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000)
        await (prisma as any).visitor.deleteMany({
            where: { lastSeen: { lt: tenMinutesAgo } }
        }).catch((err: any) => console.error("Cleanup error:", err))

        return NextResponse.json({ success: true })
    } catch (error) {
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
    }
}
