import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import { redis, withTimeout } from "@/lib/redis"

/**
 * API to track online administrators in Redis via Heartbeat
 */
export async function POST(req: NextRequest) {
    const session = await auth()

    // Authorization check
    if (!session?.user || !["ADMIN", "SUPER_ADMIN"].includes(session.user.role)) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    try {
        const userId = session.user.id
        if (!userId) {
            return NextResponse.json({ error: "Missing identity" }, { status: 400 })
        }

        // Register admin activity in Redis (expires after some time if not updated)
        // Score is the current timestamp
        await withTimeout(
            redis.zadd("online_admins", Date.now(), userId),
            1500,
            null
        )

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error("[ADMIN_HEARTBEAT] Error:", error)
        return NextResponse.json({ error: "Heartbeat failed" }, { status: 500 })
    }
}
