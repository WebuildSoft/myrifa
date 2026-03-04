import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { rateLimit, getIP, rateLimitResponse } from "@/lib/rate-limit"
import { redis } from "@/lib/redis"
import { sendWhatsAppMessage } from "@/lib/evolution"

/**
 * Helper to race a promise against a timeout
 */
async function withTimeout<T>(promise: Promise<T>, ms: number, fallback: T): Promise<T> {
    try {
        return await Promise.race([
            promise,
            new Promise<T>((_, reject) => setTimeout(() => reject(new Error("Timeout")), ms))
        ]);
    } catch (e) {
        console.warn(`[REDIS_TIMEOUT] Operation timed out after ${ms}ms. Returning fallback.`);
        return fallback;
    }
}

export async function POST(req: NextRequest) {
    const ip = getIP(req)
    const rl = rateLimit(ip + ":analytics_view", { limit: 30, windowMs: 60_000 })
    if (!rl.success) return rateLimitResponse(rl.resetIn)

    try {
        const body = await req.json()

        // --- PATCH WORKAROUND FOR sendBeacon ---
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

            // Ping Redis for Online Users tracking (Non-blocking)
            redis.zadd("online_users", Date.now(), body.sessionId).catch(() => { })
            return NextResponse.json({ success: true, action: "updated" })
        }
        // ---------------------------------------

        const { rifaId, sessionId, referrer, rawReferrer, device, os, browser, utmSource, utmMedium, utmCampaign } = body

        if (!rifaId || !sessionId) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
        }

        const forwardedIp = req.headers.get("x-forwarded-for")?.split(",")[0] || "Unknown"

        const rifaExists = await prisma.rifa.findUnique({
            where: { id: rifaId },
            select: { id: true, title: true }
        })

        if (!rifaExists) return NextResponse.json({ error: "Invalid rifaId" }, { status: 404 })

        const viewData = {
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

        console.log(`[ANALYTICS] Recording view for Rifa ${rifaId}, Session ${sessionId}`)
        await (prisma as any).linkView.create({ data: viewData })
        console.log(`[ANALYTICS] View saved to Prisma.`)

        // 1. REDIS HOT-PATH CACHE (Activity Ticker)
        try {
            const cacheItem = JSON.stringify({
                ...viewData,
                createdAt: new Date().toISOString(),
                rifa: { title: rifaExists.title }
            })
            const redisPromise = redis.pipeline()
                .lpush("recent_views", cacheItem)
                .ltrim("recent_views", 0, 19)
                .exec();

            await withTimeout(redisPromise, 2000, null);
        } catch (e) {
            console.error("[REDIS] Cache Push Error:", e)
        }

        // 2. WHATSAPP ADMIN ALERT (Throttled via Redis)
        (async () => {
            try {
                const cooldownKey = "wa_alert_cooldown"

                // Be very resilient here: if Redis is down, we still want the alert!
                const hasCooldown = await withTimeout(redis.get(cooldownKey), 1500, null);

                if (!hasCooldown) {
                    const adminPhone = process.env.ADMIN_ALERT_PHONE
                    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://myrifa.com.br"

                    if (adminPhone && adminPhone !== "[YOUR_PHONE]") {
                        await sendWhatsAppMessage(
                            adminPhone,
                            `🔔 *MyRifa: Novo Movimento!* 🚀\n\nHá novos visitantes ativos no seu site agora!\n\nConfira o painel:\n🔗 ${appUrl}/sistema-x7k2/analytics`
                        )
                        await withTimeout(redis.set(cooldownKey, "active", "EX", 1800), 1000, null);
                    }
                }
            } catch (e) {
                console.error("[ALERT] Async Alert Error:", e)
            }
        })()

        // 3. Online Users Ping (Non-blocking)
        redis.zadd("online_users", Date.now(), sessionId).catch(() => { });

        return NextResponse.json({ success: true, action: "created" })
    } catch (error) {
        console.error("[ANALYTICS] View Error:", error)
        return NextResponse.json({ error: "Failed to record view" }, { status: 500 })
    }
}

export async function PATCH(req: NextRequest) {
    const ip = getIP(req)
    const rl = rateLimit(ip + ":analytics_patch", { limit: 10, windowMs: 60_000 })
    if (!rl.success) return rateLimitResponse(rl.resetIn)

    try {
        const { sessionId, rifaId, duration } = await req.json()
        if (!sessionId || !rifaId || !duration) {
            return NextResponse.json({ error: "Missing fields" }, { status: 400 })
        }

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

        // Online Users Ping (Non-blocking)
        redis.zadd("online_users", Date.now(), sessionId).catch(() => { })

        return NextResponse.json({ success: true })
    } catch (error) {
        return NextResponse.json({ error: "Failed to update duration" }, { status: 500 })
    }
}
