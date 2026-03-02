import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import WhatsappStatus from "@/components/admin/WhatsappStatus"
import GrowthChart from "@/components/admin/GrowthChart"
import { Users, UserPlus, TrendingUp, Calendar } from "lucide-react"

export const dynamic = 'force-dynamic'

export default async function AdminDashboardPage() {
    const session = await auth()

    if (!session?.user || !["ADMIN", "SUPER_ADMIN"].includes(session.user.role)) {
        redirect("/sistema-x7k2/login")
    }

    const now = new Date()
    const last24h = new Date(now.getTime() - 24 * 60 * 60 * 1000)
    const last7d = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
    const last30d = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)

    const [
        totalUsers,
        newUsers24h,
        newUsers7d,
        newUsers30d,
        totalRifas,
        totalRevenueResult,
        rawGrowthData
    ] = await Promise.all([
        prisma.user.count(),
        prisma.user.count({ where: { createdAt: { gte: last24h } } }),
        prisma.user.count({ where: { createdAt: { gte: last7d } } }),
        prisma.user.count({ where: { createdAt: { gte: last30d } } }),
        prisma.rifa.count({ where: { status: { not: "DELETED" } } }),
        prisma.rifa.aggregate({
            where: { status: { in: ["ACTIVE", "PAUSED", "CLOSED", "DRAWN"] } },
            _sum: { totalRaised: true }
        }),
        prisma.user.findMany({
            where: { createdAt: { gte: new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000) } },
            select: { createdAt: true },
            orderBy: { createdAt: 'asc' }
        })
    ])

    const totalRevenue = Number(totalRevenueResult._sum.totalRaised || 0)

    // Process growth data to group by day
    const chartDataMap = new Map()
    for (let i = 13; i >= 0; i--) {
        const d = new Date(now.getTime() - i * 24 * 60 * 60 * 1000)
        const dateKey = d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })
        chartDataMap.set(dateKey, 0)
    }

    rawGrowthData.forEach((user) => {
        const dateKey = new Date(user.createdAt).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })
        if (chartDataMap.has(dateKey)) {
            chartDataMap.set(dateKey, chartDataMap.get(dateKey) + 1)
        }
    })

    const chartData = Array.from(chartDataMap.entries()).map(([date, count]) => ({ date, count }))

    return (
        <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Page Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                        <div className="px-3 py-1 rounded-full text-[10px] font-black bg-indigo-500/30 text-indigo-300 border border-indigo-500/40 uppercase tracking-[0.2em] shadow-[0_0_15px_rgba(99,102,241,0.2)]">
                            Sistema em Tempo Real
                        </div>
                    </div>
                    <div className="space-y-1">
                        <h1 className="text-5xl font-black tracking-tight text-white drop-shadow-md">Dashboard</h1>
                        <p className="text-slate-100 text-base font-bold max-w-xl leading-relaxed opacity-100">
                            Bem-vindo ao centro de comando. Aqui você monitora cada batida do sistema e o crescimento da plataforma.
                        </p>
                    </div>
                </div>
                <div className="flex items-center space-x-3">
                    <div className="h-12 px-6 rounded-2xl bg-white/[0.07] border border-white/[0.15] flex items-center text-sm font-black text-white shadow-xl backdrop-blur-md">
                        <Calendar className="mr-3 h-4 w-4 text-indigo-400" />
                        {now.toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </div>
                </div>
            </div>

            {/* Quick Stats Cards */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
                {[
                    { title: "Total de Usuários", value: totalUsers, sub: "Base total cadastrada", icon: Users, color: "indigo" },
                    { title: "Novos (24h)", value: `+${newUsers24h}`, sub: "Nas últimas 24 horas", icon: UserPlus, color: "emerald" },
                    { title: "Últimos 7 dias", value: `+${newUsers7d}`, sub: "Crescimento semanal", icon: TrendingUp, color: "blue" },
                    { title: "Últimos 30 dias", value: `+${newUsers30d}`, sub: "Crescimento mensal", icon: Calendar, color: "violet" },
                    { title: "Total de Campanhas", value: totalRifas, sub: "Rifas criadas", icon: Calendar, color: "orange" },
                    { title: "Receita Global", value: `R$ ${totalRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`, sub: "Total arrecadado", icon: TrendingUp, color: "yellow" }
                ].map((stat, i) => (
                    <Card key={i} className="group relative overflow-hidden border-white/[0.1] bg-white/[0.03] backdrop-blur-md transition-all hover:bg-white/[0.06] hover:border-white/[0.15] shadow-lg">
                        <div className={`absolute top-0 right-0 w-24 h-24 -mr-8 -mt-8 rounded-full bg-${stat.color}-500/10 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity`} />
                        <CardHeader className="flex flex-row items-center justify-between pb-3">
                            <CardTitle className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-200">{stat.title}</CardTitle>
                            <stat.icon className={`h-4 w-4 text-${stat.color}-400 group-hover:scale-110 transition-transform`} />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-black text-white tracking-tight leading-none mb-2">{stat.value}</div>
                            <p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest opacity-80">{stat.sub}</p>
                        </CardContent>
                    </Card>
                ))}
            </div>


            {/* Services & Integrations */}
            <div className="grid gap-8 lg:grid-cols-3 items-start">
                <div className="lg:col-span-1 space-y-6">
                    <h2 className="text-xl font-black text-white flex items-center tracking-tight">
                        <span className="w-2 h-2 rounded-full bg-violet-500 mr-3 shadow-[0_0_10px_rgba(139,92,246,0.6)]" />
                        Status da API
                    </h2>
                    <WhatsappStatus />
                </div>

                <Card className="lg:col-span-2 border-white/[0.1] bg-white/[0.03] backdrop-blur-md shadow-xl">
                    <CardHeader className="pb-8">
                        <CardTitle className="text-xl font-black text-white tracking-tight">Crescimento do Sistema</CardTitle>
                        <CardDescription className="text-slate-200 font-medium">Evolução de novos cadastros nos últimos 14 dias</CardDescription>
                    </CardHeader>
                    <CardContent className="pt-0">
                        <GrowthChart data={chartData} />
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
