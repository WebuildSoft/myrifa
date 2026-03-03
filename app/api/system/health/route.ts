import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { redis } from "@/lib/redis"

export const dynamic = 'force-dynamic'

export async function GET() {
    const health: any = {
        status: "checking",
        timestamp: new Date().toISOString(),
        services: {
            database: { status: "unknown" },
            redis: { status: "unknown" }
        }
    }

    // 1. Check Database
    try {
        await prisma.$queryRaw`SELECT 1`
        health.services.database.status = "OK"
    } catch (e: any) {
        health.services.database.status = "ERROR"
        health.services.database.message = e.message
    }

    // 2. Check Redis
    try {
        // Test a simple ping or get/set
        const startTime = Date.now()
        await redis.ping()
        health.services.redis.status = "OK"
        health.services.redis.latency = `${Date.now() - startTime}ms`
        health.services.redis.connectionStatus = redis.status
    } catch (e: any) {
        health.services.redis.status = "ERROR"
        health.services.redis.message = e.message
        health.services.redis.connectionStatus = redis.status
    }

    // Overall Status
    const allOk = Object.values(health.services).every((s: any) => s.status === "OK")
    health.status = allOk ? "HEALTHY" : "DEGRADED"

    return NextResponse.json(health, {
        status: allOk ? 200 : 500
    })
}
