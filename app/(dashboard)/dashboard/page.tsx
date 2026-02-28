import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"
import { redirect } from "next/navigation"

import { DashboardStats } from "@/components/dashboard/DashboardStats"
import { DashboardCTA } from "@/components/dashboard/DashboardCTA"
import { RecentSalesTable } from "@/components/dashboard/RecentSalesTable"

export default async function DashboardPage() {
    const session = await auth()
    if (!session?.user?.id) redirect("/login")

    const userId = session.user.id
    const activeStatuses = ["DRAFT", "ACTIVE", "PAUSED", "CLOSED", "DRAWN", "CANCELLED"] as any[]

    // Fetch metrics with parallel queries for maximum speed
    const [activeRifasCount, totalRaisedResult, ticketsSold, recentTransactions] = await Promise.all([
        prisma.rifa.count({
            where: { userId, status: "ACTIVE" as any }
        }),
        prisma.rifa.aggregate({
            where: {
                userId,
                status: { in: activeStatuses }
            },
            _sum: { totalRaised: true }
        }),
        prisma.rifaNumber.count({
            where: {
                rifa: {
                    userId,
                    status: { in: activeStatuses }
                },
                status: "PAID"
            }
        }),
        prisma.transaction.findMany({
            where: {
                rifa: {
                    userId,
                    status: { in: activeStatuses }
                }
            },
            include: {
                buyer: { select: { name: true } },
                rifa: { select: { title: true } }
            },
            orderBy: { createdAt: "desc" },
            take: 5
        })
    ])

    const totalRaised = Number(totalRaisedResult._sum.totalRaised || 0)

    return (
        <div className="space-y-8 pb-12">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
                <p className="text-slate-500 font-medium mt-1">
                    Bem-vindo de volta, {session.user.name?.split(" ")[0]}! Aqui está o resumo das suas campanhas.
                </p>
            </div>

            <DashboardStats
                totalRaised={totalRaised}
                activeRifasCount={activeRifasCount}
                ticketsSold={ticketsSold}
            />

            <DashboardCTA />

            <RecentSalesTable transactions={recentTransactions as any} />
        </div>
    )
}
