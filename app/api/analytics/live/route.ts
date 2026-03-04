import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { redis } from "@/lib/redis"

export const dynamic = 'force-dynamic'

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
        return fallback;
    }
}

export async function GET(req: NextRequest) {
    const session = await auth()

    // Authorization check
    if (!session?.user || !["ADMIN", "SUPER_ADMIN"].includes(session.user.role)) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    try {
        const fiveMinutesAgoTimestamp = Date.now() - 5 * 60 * 1000

        // 1. ONLINE USERS (Redis Only) - 1s timeout
        const onlineUsers = await withTimeout(
            redis.zcount("online_users", fiveMinutesAgoTimestamp, "+inf"),
            1000,
            0
        );

        // 2. RECENT VIEWS (Redis-first with Warmup) - 1.5s timeout
        const recentViews = await withTimeout(
            redis.lrange("recent_views", 0, 9),
            1500,
            []
        ).then(async (cached) => {
            if (cached && cached.length > 0) return cached.map(item => JSON.parse(item))
            const fresh = await (prisma as any).linkView.findMany({
                orderBy: { createdAt: "desc" },
                take: 10,
                include: { rifa: { select: { title: true } } }
            })
            if (fresh.length > 0) {
                const pipe = redis.pipeline()
                const reversed = [...fresh].reverse()
                for (const i of reversed) pipe.lpush("recent_views", JSON.stringify(i))
                pipe.ltrim("recent_views", 0, 19).exec().catch(() => { })
            }
            return fresh
        }).catch(() => [])

        // 3. REVENUE (Redis-first with Warmup) - 1s timeout
        let totalRevenue: number | null = await withTimeout(
            redis.get("dashboard:total_revenue").then(v => v ? parseFloat(v) : null),
            1000,
            null
        );

        if (totalRevenue === null) {
            const revenueAgg = await prisma.transaction.aggregate({
                where: { status: "PAID" },
                _sum: { amount: true }
            })
            totalRevenue = Number(revenueAgg._sum.amount || 0)
            // Warmup revenue in Redis (Non-blocking)
            redis.set("dashboard:total_revenue", totalRevenue.toString()).catch(() => { })
        }

        // 4. RECENT SALES (Redis-first with Warmup) - 1.5s timeout
        const recentSales = await withTimeout(
            redis.lrange("dashboard:recent_sales", 0, 4),
            1500,
            []
        ).then(async (cached) => {
            if (cached && cached.length > 0) return cached.map(item => JSON.parse(item))
            const fresh = await prisma.transaction.findMany({
                where: { status: "PAID" },
                orderBy: { paidAt: "desc" },
                take: 5,
                select: {
                    id: true,
                    amount: true,
                    paidAt: true,
                    buyer: { select: { name: true } },
                    rifa: { select: { title: true } }
                }
            })
            if (fresh.length > 0) {
                const pipe = redis.pipeline()
                const reversed = [...fresh].reverse()
                for (const i of reversed) pipe.lpush("dashboard:recent_sales", JSON.stringify(i))
                pipe.ltrim("dashboard:recent_sales", 0, 9).exec().catch(() => { })
            }
            return fresh
        }).catch(() => [])

        return NextResponse.json({
            onlineUsers,
            totalRevenue: totalRevenue || 0,
            recentSales,
            recentViews,
            timestamp: new Date().toISOString()
        })
    } catch (error) {
        console.error("[LIVE_ANALYTICS_API] Error:", error)
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
    }
}
