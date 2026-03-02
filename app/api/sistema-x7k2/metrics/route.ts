import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { OSUtils } from "node-os-utils"

// Instantiate the new OSUtils class from version 2.x
const osu = new OSUtils()

export const dynamic = "force-dynamic"

export async function GET() {
    const encoder = new TextEncoder()

    const stream = new ReadableStream({
        async start(controller) {
            const sendUpdate = async () => {
                try {
                    // node-os-utils 2.x uses a class-based, result-wrapped asynchronous API
                    const [cpuRes, memRes, diskRes, uptimeRes] = await Promise.all([
                        osu.cpu.usage(),
                        osu.memory.summary(),
                        osu.disk.overallUsage(),
                        osu.system.uptime()
                    ]);

                    // Extract data or provide fallbacks
                    const cpuUsage = cpuRes.success ? cpuRes.data : 0;
                    const memData = memRes.success ? memRes.data : { usagePercentage: 0 };
                    const diskUsage = diskRes.success ? diskRes.data : 0;
                    const uptime = uptimeRes.success ? uptimeRes.data.uptime : 0;

                    // User Metrics
                    const totalUsers = await prisma.user.count()
                    const now = new Date()
                    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
                    const usersToday = await prisma.user.count({
                        where: { createdAt: { gte: today } }
                    })

                    // Online Users (Simplified: users with session in last 5 minutes)
                    const onlineUsers = await prisma.session.count({
                        where: { expires: { gte: now } }
                    })

                    const metrics = {
                        system: {
                            cpu: cpuUsage,
                            ram: 100 - memData.usagePercentage,
                            ramUsed: memData.usagePercentage,
                            disk: diskUsage,
                            uptime: uptime,
                        },
                        users: {
                            total: totalUsers,
                            today: usersToday,
                            online: onlineUsers,
                        },
                        timestamp: new Date().toISOString(),
                    }

                    controller.enqueue(encoder.encode(`data: ${JSON.stringify(metrics)}\n\n`))
                } catch (error) {
                    console.error("[Metrics SSE] Error:", error)
                }
            }

            // Send initial update
            await sendUpdate()

            // Update every 5 seconds
            const interval = setInterval(sendUpdate, 5000)

            // Cleanup is handled by the browser closing 
        },
    })

    return new Response(stream, {
        headers: {
            "Content-Type": "text/event-stream",
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
        },
    })
}
