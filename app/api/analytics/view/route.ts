import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { rateLimit, getIP, rateLimitResponse } from "@/lib/rate-limit"

export async function POST(req: NextRequest) {
    // Rate limit: max 30 requests per IP per minute
    const ip = getIP(req)
    const rl = rateLimit(ip + ":analytics_view", { limit: 30, windowMs: 60_000 })
    if (!rl.success) return rateLimitResponse(rl.resetIn)

    try {
        const { rifaId, sessionId, referrer, rawReferrer, device, os, browser, utmSource, utmMedium, utmCampaign } = await req.json()

        if (!rifaId || !sessionId) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
        }

        const ip = req.headers.get("x-forwarded-for")?.split(",")[0] || "Unknown"

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
                ip,
            }
        })

        return NextResponse.json({ success: true })
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

        return NextResponse.json({ success: true })
    } catch (error) {
        return NextResponse.json({ error: "Failed to update duration" }, { status: 500 })
    }
}
