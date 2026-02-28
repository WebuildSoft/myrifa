import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"
import { redirect } from "next/navigation"
import Link from "next/link"
import { AlertTriangle, ArrowRight } from "lucide-react"

import { DashboardStats } from "@/components/dashboard/DashboardStats"
import { DashboardCTA } from "@/components/dashboard/DashboardCTA"
import { RecentSalesTable } from "@/components/dashboard/RecentSalesTable"

export default async function DashboardPage() {
    const session = await auth()
    if (!session?.user?.id) redirect("/login")

    const userId = session.user.id
    const activeStatuses = ["DRAFT", "ACTIVE", "PAUSED", "CLOSED", "DRAWN", "CANCELLED"] as any[]

    // Fetch metrics with parallel queries for maximum speed
    const [user, activeRifasCount, totalRaisedResult, ticketsSold, recentTransactions] = await Promise.all([
        prisma.user.findUnique({
            where: { id: userId },
            select: { mercadoPagoAccessToken: true }
        }),
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

            {!user?.mercadoPagoAccessToken && (
                <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-5 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                    <div className="flex gap-3 items-start">
                        <div className="p-2 bg-amber-100 dark:bg-amber-900/40 rounded-lg shrink-0">
                            <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-500" />
                        </div>
                        <div>
                            <h3 className="font-semibold text-amber-800 dark:text-amber-500">Configuração Pendente!</h3>
                            <p className="text-sm text-amber-700 dark:text-amber-400 mt-1">
                                Você precisa configurar seu Token do Mercado Pago para conseguir receber os pagamentos das suas rifas via PIX automático.
                            </p>
                        </div>
                    </div>
                    <Link
                        href="/conta"
                        className="shrink-0 flex items-center gap-2 bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
                    >
                        Configurar agora
                        <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>
            )}

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
