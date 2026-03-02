import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"

export async function POST() {
    const session = await auth()

    // Auth check
    if (!session || !["SUPER_ADMIN", "ADMIN"].includes(session.user.role)) {
        return new NextResponse(null, { status: 404 })
    }

    try {
        const logs = await (prisma as any).adminLog.findMany({
            include: { user: { select: { email: true } } },
            orderBy: { createdAt: 'desc' }
        })

        // CSV Header
        let csv = "ID,Data/Hora,Admin,Email,Acao,Recurso,IP\n"

        // CSV Rows
        logs.forEach((log: any) => {
            const date = new Date(log.createdAt).toISOString()
            const row = [
                log.id,
                date,
                `"${log.user?.name || ''}"`,
                log.user?.email || '',
                log.action,
                `"${log.resource || ''}"`,
                log.ip || ''
            ].join(",")
            csv += row + "\n"
        })

        return new NextResponse(csv, {
            headers: {
                "Content-Type": "text/csv; charset=utf-8",
                "Content-Disposition": `attachment; filename="admin-logs-${new Date().toISOString().split('T')[0]}.csv"`
            }
        })
    } catch (error) {
        return NextResponse.json({ error: "Failed to export logs" }, { status: 500 })
    }
}
