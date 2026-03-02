import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import {
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from "@/components/ui/table"
import {
    BarChart2, Eye, Users, Clock, TrendingUp,
    Smartphone, Monitor, Tablet, Globe, Cpu,
    MousePointerClick, Search, ArrowUpRight
} from "lucide-react"

export const dynamic = 'force-dynamic'

const DEVICE_ICONS: Record<string, React.ReactNode> = {
    mobile: <Smartphone className="h-4 w-4" />,
    desktop: <Monitor className="h-4 w-4" />,
    tablet: <Tablet className="h-4 w-4" />,
}

const DEVICE_COLORS: Record<string, string> = {
    mobile: "bg-indigo-400",
    desktop: "bg-violet-400",
    tablet: "bg-blue-400",
}

const SOURCE_COLORS: Record<string, string> = {
    "WhatsApp": "text-emerald-400",
    "Instagram": "text-pink-400",
    "Facebook": "text-blue-400",
    "Google": "text-red-400",
    "Twitter/X": "text-sky-400",
    "TikTok": "text-rose-400",
    "Telegram": "text-blue-300",
    "YouTube": "text-red-500",
    "Direto": "text-slate-400",
}

function formatDuration(secs: number | null): string {
    if (!secs) return "—"
    if (secs < 60) return `${secs}s`
    const m = Math.floor(secs / 60)
    const s = secs % 60
    return `${m}m ${s}s`
}

function countBy<T>(arr: T[], key: (item: T) => string): { name: string; count: number }[] {
    const map: Record<string, number> = {}
    for (const item of arr) {
        const k = key(item) || "Desconhecido"
        map[k] = (map[k] || 0) + 1
    }
    return Object.entries(map)
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count)
}

function BreakdownBar({ items, total, colors }: { items: { name: string; count: number }[], total: number, colors?: Record<string, string> }) {
    return (
        <div className="space-y-3">
            {items.slice(0, 8).map(({ name, count }) => {
                const pct = total > 0 ? Math.round((count / total) * 100) : 0
                const color = colors?.[name] || "bg-indigo-500"
                return (
                    <div key={name} className="flex items-center gap-3">
                        <span className={`text-xs font-medium w-24 truncate text-slate-300 ${colors?.[name] || ""}`}>{name}</span>
                        <div className="flex-1 h-2 bg-white/5 rounded-full overflow-hidden">
                            <div className={`h-full rounded-full ${color}`} style={{ width: `${pct}%` }} />
                        </div>
                        <span className="text-xs font-black text-white w-8 text-right">{pct}%</span>
                        <span className="text-[10px] text-slate-500 w-6 text-right">{count}</span>
                    </div>
                )
            })}
        </div>
    )
}

export default async function AdminAnalyticsPage() {
    const session = await auth()

    // Authorization check
    if (!session?.user || !["ADMIN", "SUPER_ADMIN"].includes(session.user.role)) {
        redirect("/sistema-x7k2/login")
    }

    // Fetch ALL views and ALL rifas since this is global admin
    const views = await (prisma as any).linkView.findMany({
        orderBy: { createdAt: "desc" },
        take: 1000 // Limit to avoid massive memory usage on global query
    })

    const totalViewsCount = await (prisma as any).linkView.count()
    const rifasTotalCount = await prisma.rifa.count()
    const allBuyersCount = await prisma.transaction.count({
        where: { status: "PAID" }
    })

    const totalViews = views.length
    const uniqueSessions = new Set(views.map((v: any) => v.sessionId)).size
    const viewsWithDuration = views.filter((v: any) => v.duration != null && v.duration > 0)
    const avgDuration = viewsWithDuration.length > 0
        ? Math.round(viewsWithDuration.reduce((acc: number, v: any) => acc + v.duration, 0) / viewsWithDuration.length)
        : 0

    // Global conversion rate approx (Paid transactions / Total DB Views)
    const conversionRate = totalViewsCount > 0 ? ((allBuyersCount / totalViewsCount) * 100).toFixed(1) : "0"

    // Breakdowns
    const byDevice = countBy(views, (v: any) => v.device)
    const byOS = countBy(views, (v: any) => v.os || "Desconhecido")
    const byReferrer = countBy(views, (v: any) => v.referrer || "Direto")
    const byBrowser = countBy(views, (v: any) => v.browser || "Desconhecido")

    // 30-day chart data based on latest views
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
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1 relative">
                    <div className="absolute -left-4 top-1/2 -translate-y-1/2 w-1 h-8 bg-indigo-500 rounded-r-full" />
                    <h1 className="text-2xl font-black text-white uppercase tracking-tight flex items-center gap-3">
                        <BarChart2 className="h-6 w-6 text-indigo-400" />
                        Analytics Global
                    </h1>
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest pl-9">
                        Desempenho da Plataforma em Tempo Real
                    </p>
                </div>
            </div>

            {/* Global Summary Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                    { icon: <Globe className="h-5 w-5 text-blue-400" />, label: "Total Platform Views", value: totalViewsCount.toLocaleString("pt-BR"), bg: "bg-blue-500/10 border-blue-500/20" },
                    { icon: <TrendingUp className="h-5 w-5 text-indigo-400" />, label: "Taxa de Conversão Global", value: `${conversionRate}%`, bg: "bg-indigo-500/10 border-indigo-500/20" },
                    { icon: <Clock className="h-5 w-5 text-violet-400" />, label: "Tempo Médio (Amostra)", value: formatDuration(avgDuration), bg: "bg-violet-500/10 border-violet-500/20" },
                    { icon: <Search className="h-5 w-5 text-emerald-400" />, label: "Campanhas Ativas", value: rifasTotalCount.toLocaleString("pt-BR"), bg: "bg-emerald-500/10 border-emerald-500/20" },
                ].map(({ icon, label, value, bg }) => (
                    <Card key={label} className={`border ${bg} bg-[#020617]/50 backdrop-blur-md hover:bg-white/[0.02] transition-colors relative overflow-hidden group`}>
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/[0.02] rounded-full blur-3xl -mr-16 -mt-16 transition-opacity group-hover:bg-white/[0.05]" />
                        <CardContent className="p-5 relative z-10">
                            <div className="flex items-center gap-3 mb-3">
                                <div className={`p-2 rounded-lg ${bg}`}>{icon}</div>
                                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">{label}</span>
                            </div>
                            <p className="text-3xl font-black text-white">{value}</p>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Breakdowns */}
            <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-6">
                {/* Device */}
                <Card className="border-white/[0.05] bg-[#020617]/50 backdrop-blur-md">
                    <CardHeader className="p-5 pb-3 border-b border-white/[0.05]">
                        <div className="flex items-center gap-2">
                            <Smartphone className="h-4 w-4 text-blue-400" />
                            <h3 className="text-white font-black text-xs uppercase tracking-widest">Dispositivos</h3>
                        </div>
                    </CardHeader>
                    <CardContent className="p-5">
                        {totalViews === 0 ? <p className="text-slate-600 text-xs">Sem dados</p> : (
                            <div className="space-y-3">
                                {byDevice.map(({ name, count }) => {
                                    const pct = Math.round((count / totalViews) * 100)
                                    return (
                                        <div key={name} className="flex items-center gap-3">
                                            <div className={`p-1.5 rounded-lg ${DEVICE_COLORS[name] || "bg-slate-500"}/10`}>
                                                {DEVICE_ICONS[name] || <Monitor className="h-4 w-4" />}
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex justify-between mb-1">
                                                    <span className="text-xs font-bold text-white capitalize">{name}</span>
                                                    <span className="text-xs font-black text-white">{pct}%</span>
                                                </div>
                                                <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                                                    <div className={`h-full rounded-full ${DEVICE_COLORS[name] || "bg-slate-500"}`} style={{ width: `${pct}%` }} />
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* OS */}
                <Card className="border-white/[0.05] bg-[#020617]/50 backdrop-blur-md">
                    <CardHeader className="p-5 pb-3 border-b border-white/[0.05]">
                        <div className="flex items-center gap-2">
                            <Cpu className="h-4 w-4 text-violet-400" />
                            <h3 className="text-white font-black text-xs uppercase tracking-widest">Sistemas Operacionais</h3>
                        </div>
                    </CardHeader>
                    <CardContent className="p-5">
                        {totalViews === 0 ? <p className="text-slate-600 text-xs">Sem dados</p> :
                            <BreakdownBar items={byOS} total={totalViews} colors={{ "Android": "bg-emerald-500", "iOS": "bg-blue-500", "Windows": "bg-sky-400", "macOS": "bg-silver-400", "Linux": "bg-orange-400" }} />
                        }
                    </CardContent>
                </Card>

                {/* Referrer */}
                <Card className="border-white/[0.05] bg-[#020617]/50 backdrop-blur-md">
                    <CardHeader className="p-5 pb-3 border-b border-white/[0.05]">
                        <div className="flex items-center gap-2">
                            <Globe className="h-4 w-4 text-emerald-400" />
                            <h3 className="text-white font-black text-xs uppercase tracking-widest">Origens de Tráfego</h3>
                        </div>
                    </CardHeader>
                    <CardContent className="p-5">
                        {totalViews === 0 ? <p className="text-slate-600 text-xs">Sem dados</p> :
                            <BreakdownBar items={byReferrer} total={totalViews} colors={{ "WhatsApp": "bg-emerald-500", "Instagram": "bg-pink-500", "Facebook": "bg-blue-500", "Google": "bg-red-500", "TikTok": "bg-rose-500" }} />
                        }
                    </CardContent>
                </Card>

                {/* Browser */}
                <Card className="border-white/[0.05] bg-[#020617]/50 backdrop-blur-md">
                    <CardHeader className="p-5 pb-3 border-b border-white/[0.05]">
                        <div className="flex items-center gap-2">
                            <MousePointerClick className="h-4 w-4 text-amber-400" />
                            <h3 className="text-white font-black text-xs uppercase tracking-widest">Navegadores</h3>
                        </div>
                    </CardHeader>
                    <CardContent className="p-5">
                        {totalViews === 0 ? <p className="text-slate-600 text-xs">Sem dados</p> :
                            <BreakdownBar items={byBrowser} total={totalViews} colors={{ "Chrome": "bg-yellow-500", "Safari": "bg-blue-400", "Firefox": "bg-orange-500", "Edge": "bg-sky-500" }} />
                        }
                    </CardContent>
                </Card>
            </div>

            {/* Detailed Table */}
            <Card className="border-white/[0.05] bg-[#020617]/50 backdrop-blur-md overflow-hidden">
                <CardHeader className="border-b border-white/[0.05] p-5">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-indigo-500/10 border border-indigo-500/20">
                            <Eye className="h-4 w-4 text-indigo-400" />
                        </div>
                        <div>
                            <h2 className="text-white font-black text-sm uppercase tracking-widest">Histórico de Visitas Recentes</h2>
                            <p className="text-slate-500 text-[10px] mt-0.5">Mostrando as últimas {totalViews} visualizações em toda plataforma</p>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="overflow-x-auto custom-scrollbar">
                        <Table>
                            <TableHeader className="bg-white/[0.01]">
                                <TableRow className="border-white/[0.05] hover:bg-transparent">
                                    <TableHead className="text-slate-500 font-bold uppercase tracking-widest text-[10px] py-4 px-6">Rifa ID</TableHead>
                                    <TableHead className="text-slate-500 font-bold uppercase tracking-widest text-[10px] py-4 px-6">Data/Hora</TableHead>
                                    <TableHead className="text-slate-500 font-bold uppercase tracking-widest text-[10px] py-4 px-6">Dispositivo / OS</TableHead>
                                    <TableHead className="text-slate-500 font-bold uppercase tracking-widest text-[10px] py-4 px-6">Origem</TableHead>
                                    <TableHead className="text-slate-500 font-bold uppercase tracking-widest text-[10px] py-4 px-6">UTM / IP</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {views.length === 0 ? (
                                    <TableRow className="border-white/[0.03]">
                                        <TableCell colSpan={5} className="h-40 text-center text-slate-600 text-sm font-medium">
                                            Nenhuma visita registrada no banco local.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    views.map((v: any) => (
                                        <TableRow key={v.id} className="border-white/[0.03] hover:bg-white/[0.02] transition-colors group">
                                            <TableCell className="py-3.5 px-6">
                                                <span className="text-slate-400 font-mono text-xs max-w-[100px] truncate block" title={v.rifaId}>
                                                    {v.rifaId}
                                                </span>
                                            </TableCell>
                                            <TableCell className="py-3.5 px-6 whitespace-nowrap">
                                                <span className="text-slate-300 font-mono text-xs">
                                                    {new Date(v.createdAt).toLocaleString("pt-BR")}
                                                </span>
                                            </TableCell>
                                            <TableCell className="py-3.5 px-6">
                                                <div className="flex flex-col gap-1">
                                                    <div className="flex items-center gap-2">
                                                        <span className={`${DEVICE_COLORS[v.device] || "bg-slate-500"}/20 p-1 rounded`}>
                                                            {DEVICE_ICONS[v.device] || <Monitor className="h-3.5 w-3.5" />}
                                                        </span>
                                                        <span className="text-slate-300 text-xs capitalize">{v.device}</span>
                                                    </div>
                                                    <span className="text-slate-500 text-[10px]">{v.os} / {v.browser}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell className="py-3.5 px-6">
                                                <div className="flex flex-col gap-1">
                                                    <span className={`text-xs font-bold ${SOURCE_COLORS[v.referrer] || "text-slate-400"}`}>
                                                        {v.referrer || "Direto"}
                                                    </span>
                                                    <span className="text-slate-500 text-[10px] truncate max-w-[150px]" title={v.sessionRef || ""}>
                                                        {v.sessionRef || "Sem ref"}
                                                    </span>
                                                </div>
                                            </TableCell>
                                            <TableCell className="py-3.5 px-6">
                                                <div className="flex flex-col gap-1">
                                                    <span className="text-slate-400 text-[11px] font-mono">
                                                        UTM: {v.utmSource || "—"}
                                                    </span>
                                                    <span className="text-slate-500 text-[10px] font-mono">
                                                        IP: {v.ipAddress || "—"}
                                                    </span>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
