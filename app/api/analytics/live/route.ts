import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { redis } from "@/lib/redis"

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
    const session = await auth()

    // Authorization check
    if (!session?.user || !["ADMIN", "SUPER_ADMIN"].includes(session.user.role)) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    try {
        const fiveMinutesAgoTimestamp = Date.now() - 5 * 60 * 1000

        const [onlineUsers, totalRevenue, recentSales, recentViews] = await Promise.all([
            // 1. Online Users from Redis
            redis.zcount("online_users", fiveMinutesAgoTimestamp, "+inf").catch(() => 0),

            // 2. Total Lifetime Revenue (Paid)
            prisma.transaction.aggregate({
                where: { status: "PAID" },
                _sum: { amount: true }
            }),

            // 3. Recent 5 Sales (Live Notifications)
            prisma.transaction.findMany({
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
            }),

            // 4. Recent 10 Views (Activity Ticker) - Redis-first with Warmup Fallback
            redis.lrange("recent_views", 0, 9).then(async (cached) => {
                if (cached && cached.length > 0) {
                    try {
                        return cached.map(item => JSON.parse(item))
                    } catch (e) {
                        console.error("[REDIS] Parse Error (Recent Views Cache):", e)
                    }
                }

                // Fallback & Warmup
                const fresh = await (prisma as any).linkView.findMany({
                    orderBy: { createdAt: "desc" },
                    take: 10,
                    include: { rifa: { select: { title: true } } }
                })

                // Background warmup
                if (fresh.length > 0) {
                    const pipeline = redis.pipeline()
                    // Push in reverse order so that most recent stays at index 0
                    const reversed = [...fresh].reverse()
                    for (const item of reversed) {
                        pipeline.lpush("recent_views", JSON.stringify(item))
                    }
                    pipeline.ltrim("recent_views", 0, 19)
                    pipeline.exec().catch(() => { })
                }

                return fresh
            })
        ])

        return NextResponse.json({
            onlineUsers,
            totalRevenue: totalRevenue._sum.amount || 0,
            recentSales,
            recentViews,
            timestamp: new Date().toISOString()
        })
    } catch (error) {
        console.error("[LIVE_ANALYTICS_API] Error:", error)
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
    }
}
