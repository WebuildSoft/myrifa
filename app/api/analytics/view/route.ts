import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { rateLimit, getIP, rateLimitResponse } from "@/lib/rate-limit"
import { redis } from "@/lib/redis"

export async function POST(req: NextRequest) {
    // Rate limit: max 30 requests per IP per minute
    const ip = getIP(req)
    const rl = rateLimit(ip + ":analytics_view", { limit: 30, windowMs: 60_000 })
    if (!rl.success) return rateLimitResponse(rl.resetIn)

    try {
        const body = await req.json()

        // --- PATCH WORKAROUND FOR sendBeacon ---
        // navigator.sendBeacon ALWAYS sends a POST request.
        // If the payload contains 'duration', it's actually an update ping, not a new view.
        if (body.duration && body.sessionId && body.rifaId) {
            const view = await (prisma as any).linkView.findFirst({
                where: { sessionId: body.sessionId, rifaId: body.rifaId },
                orderBy: { createdAt: "desc" }
            })
            if (view) {
                await (prisma as any).linkView.update({
                    where: { id: view.id },
                    data: { duration: Math.round(body.duration) }
                })
            }

            // Ping Redis for Online Users tracking
            await redis.zadd("online_users", Date.now(), body.sessionId).catch(() => { })

            return NextResponse.json({ success: true, action: "updated" })
        }
        // ---------------------------------------

        const { rifaId, sessionId, referrer, rawReferrer, device, os, browser, utmSource, utmMedium, utmCampaign } = body

        if (!rifaId || !sessionId) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
        }

        const forwardedIp = req.headers.get("x-forwarded-for")?.split(",")[0] || "Unknown"

        // SECURITY: Validate that the rifa exists before recording a view
        // to prevent spoofing/injecting views for non-existent or malicious IDs.
        const rifaExists = await prisma.rifa.findUnique({
            where: { id: rifaId },
            select: { id: true }
        })

        if (!rifaExists) {
            return NextResponse.json({ error: "Invalid rifaId" }, { status: 404 })
        }

        await (prisma as any).linkView.create({
            data: {
                rifaId,
                sessionId,
                referrer,
                rawReferrer,
                device,
                os,
                browser,
                utmSource,
                utmMedium,
                utmCampaign,
                ip: forwardedIp,
            }
        })

        // Ping Redis for Online Users tracking
        await redis.zadd("online_users", Date.now(), sessionId).catch(() => { })

        return NextResponse.json({ success: true, action: "created" })
    } catch (error) {
        return NextResponse.json({ error: "Failed to record view" }, { status: 500 })
    }
}

export async function PATCH(req: NextRequest) {
    // Rate limit: max 10 PATCH per IP per minute
    const ip = getIP(req)
    const rl = rateLimit(ip + ":analytics_patch", { limit: 10, windowMs: 60_000 })
    if (!rl.success) return rateLimitResponse(rl.resetIn)

    try {
        const { sessionId, rifaId, duration } = await req.json()

        if (!sessionId || !rifaId || !duration) {
            return NextResponse.json({ error: "Missing fields" }, { status: 400 })
        }

        // Update the most recent view for this session on this rifa
        const view = await (prisma as any).linkView.findFirst({
            where: { sessionId, rifaId },
            orderBy: { createdAt: "desc" }
        })

        if (view) {
            await (prisma as any).linkView.update({
                where: { id: view.id },
                data: { duration: Math.round(duration) }
            })
        }

        // Keep session alive in Redis
        await redis.zadd("online_users", Date.now(), sessionId).catch(() => { })

        return NextResponse.json({ success: true })
    } catch (error) {
        return NextResponse.json({ error: "Failed to update duration" }, { status: 500 })
    }
}
