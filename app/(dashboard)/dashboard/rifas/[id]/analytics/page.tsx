import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { notFound, redirect } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import {
    ArrowLeft, BarChart2, Eye, TrendingUp,
    ExternalLink
} from "lucide-react"

export const dynamic = 'force-dynamic'

export default async function AnalyticsPage({ params }: { params: Promise<{ id: string }> }) {
    const session = await auth()
    if (!session?.user?.id) redirect("/login")

    const { id } = await params

    // Fetch rifa info and views in parallel
    const [rifa, views] = await Promise.all([
        prisma.rifa.findUnique({
            where: { id, userId: session.user.id },
            select: { id: true, title: true, slug: true, _count: { select: { buyers: true } } }
        }),
        (prisma as any).linkView.findMany({
            where: { rifaId: id },
            select: { createdAt: true }, // Optimized: only fetch necessary field for the chart
            orderBy: { createdAt: "desc" },
        })
    ])

    if (!rifa) notFound()

    const totalViews = views.length
    const conversionRate = totalViews > 0 ? ((rifa._count.buyers / totalViews) * 100).toFixed(1) : "0"



    // 30-day chart data
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 29)
    const dailyCounts: Record<string, number> = {}
    for (let i = 0; i < 30; i++) {
        const d = new Date(thirtyDaysAgo)
        d.setDate(d.getDate() + i)
        dailyCounts[d.toISOString().split("T")[0]] = 0
    }
    for (const v of views) {
        const day = new Date(v.createdAt).toISOString().split("T")[0]
        if (day in dailyCounts) dailyCounts[day]++
    }
    const chartDays = Object.entries(dailyCounts)
    const maxDay = Math.max(...chartDays.map(([, c]) => c), 1)

    return (
        <div className="min-h-screen bg-background pb-24">
            {/* Header */}
            <header className="sticky top-0 z-50 bg-background/90 backdrop-blur-md px-6 py-4 flex items-center justify-between border-b">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" className="rounded-full hover:bg-white/5" asChild>
                        <Link href={`/dashboard/rifas/${id}`}>
                            <ArrowLeft className="h-5 w-5 text-white" />
                        </Link>
                    </Button>
                    <div>
                        <div className="flex items-center gap-2">
                            <BarChart2 className="h-4 w-4 text-primary" />
                            <h1 className="font-black text-foreground text-lg uppercase tracking-tight italic">Analytics do Link</h1>
                        </div>
                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-0.5 truncate max-w-xs">{rifa.title}</p>
                    </div>
                </div>
                <Button variant="outline" size="sm" className="rounded-xl font-bold text-[10px] uppercase tracking-widest" asChild>
                    <a href={`/r/${rifa.slug}`} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="mr-2 h-3.5 w-3.5" />
                        Ver Link Público
                    </a>
                </Button>
            </header>

            <main className="p-6 space-y-8 max-w-7xl mx-auto">
                {/* Summary Cards */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    {[
                        { icon: <Eye className="h-5 w-5 text-blue-400" />, label: "Total de Views", value: totalViews.toLocaleString("pt-BR"), bg: "bg-blue-500/10 border-blue-500/20" },
                        { icon: <TrendingUp className="h-5 w-5 text-emerald-500" />, label: "Taxa de Conversão", value: `${conversionRate}%`, bg: "bg-emerald-500/10 border-emerald-500/20" },
                    ].map(({ icon, label, value, bg }) => (
                        <Card key={label} className="border-border/50 shadow-sm overflow-hidden relative group">
                            <CardContent className="p-5">
                                <div className="flex items-center gap-3 mb-3">
                                    <div className={`p-2 rounded-lg ${bg}`}>{icon}</div>
                                    <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{label}</span>
                                </div>
                                <p className="text-3xl font-black text-foreground">{value}</p>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* 30-day Chart */}
                <Card className="border-border/50 shadow-sm">
                    <CardHeader className="border-b p-5">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-primary/10 border border-primary/20">
                                <BarChart2 className="h-4 w-4 text-primary" />
                            </div>
                            <div>
                                <h2 className="text-foreground font-black text-sm uppercase tracking-widest">Visitas nos Últimos 30 Dias</h2>
                                <p className="text-muted-foreground text-[10px] font-medium mt-0.5">{totalViews} total</p>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="p-6">
                        {totalViews === 0 ? (
                            <div className="h-32 flex items-center justify-center">
                                <p className="text-slate-600 text-sm font-medium">Nenhuma visita ainda. Compartilhe o link para começar a ver dados aqui.</p>
                            </div>
                        ) : (
                            <div className="flex items-end gap-1 h-32">
                                {chartDays.map(([day, count]) => {
                                    const heightPct = maxDay > 0 ? (count / maxDay) * 100 : 0
                                    const date = new Date(day + "T12:00:00")
                                    const label = date.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" })
                                    return (
                                        <div key={day} className="flex flex-col items-center flex-1 gap-1 group relative" title={`${label}: ${count} visita${count !== 1 ? "s" : ""}`}>
                                            <div className="w-full rounded-sm bg-primary/20 group-hover:bg-primary/40 transition-colors relative" style={{ height: `${Math.max(heightPct, 2)}%` }}>
                                                {count > 0 && (
                                                    <span className="absolute -top-5 left-1/2 -translate-x-1/2 text-[9px] font-black text-primary opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                                                        {count}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        )}
                        <div className="flex justify-between mt-2 text-[9px] text-muted-foreground font-medium">
                            <span>{chartDays[0]?.[0] ? new Date(chartDays[0][0] + "T12:00:00").toLocaleDateString("pt-BR", { day: "2-digit", month: "short" }) : ""}</span>
                            <span>Hoje</span>
                        </div>
                    </CardContent>
                </Card>



                {/* Detailed Table Removed */}
            </main>
        </div>
    )
}
