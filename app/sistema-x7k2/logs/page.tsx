import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"
import { redirect } from "next/navigation"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
    Search,
    Download,
    Activity,
    Clock,
    User,
    Database,
    AlertTriangle,
    Globe,
    Monitor,
    CheckCircle2,
    XCircle
} from "lucide-react"

const SEVERITY_STYLES: Record<string, { badge: string; dot: string; label: string }> = {
    LOW: { badge: "bg-blue-500/10 text-blue-400 border-blue-500/20", dot: "bg-blue-500", label: "BAIXO" },
    MEDIUM: { badge: "bg-amber-500/10 text-amber-400 border-amber-500/20", dot: "bg-amber-500", label: "MÉDIO" },
    HIGH: { badge: "bg-red-500/10 text-red-400 border-red-500/20", dot: "bg-red-500", label: "ALTO" },
    CRITICAL: { badge: "bg-rose-500/10 text-rose-300 border-rose-500/30", dot: "bg-rose-500 animate-pulse", label: "CRÍTICO" },
}

const SOURCE_LABELS: Record<string, string> = {
    server: "Servidor",
    client: "Cliente (JS)",
    webhook: "Webhook",
}

export const dynamic = 'force-dynamic'

export default async function LogsPage({
    searchParams
}: {
    searchParams: { q?: string; tab?: string }
}) {
    const session = await auth()

    if (!session?.user || !["ADMIN", "SUPER_ADMIN"].includes(session.user.role)) {
        redirect("/sistema-x7k2/login")
    }

    const query = searchParams.q || ""
    const tab = searchParams.tab || "errors" // default to errors tab

    // Admin action logs
    const adminLogs = await (prisma as any).adminLog.findMany({
        where: {
            OR: [
                { action: { contains: query, mode: 'insensitive' } },
                { resource: { contains: query, mode: 'insensitive' } },
                { user: { email: { contains: query, mode: 'insensitive' } } }
            ]
        },
        include: {
            user: { select: { name: true, email: true } }
        },
        orderBy: { createdAt: 'desc' },
        take: 100
    })

    // System error logs
    const systemErrors = await (prisma as any).systemError.findMany({
        where: {
            OR: [
                { context: { contains: query, mode: 'insensitive' } },
                { message: { contains: query, mode: 'insensitive' } },
                { source: { contains: query, mode: 'insensitive' } },
            ]
        },
        orderBy: { createdAt: 'desc' },
        take: 200
    })

    const unresolvedCount = systemErrors.filter((e: any) => !e.resolved).length
    const criticalCount = systemErrors.filter((e: any) => e.severity === "CRITICAL" && !e.resolved).length

    return (
        <div className="space-y-8 pb-12">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-4xl font-black tracking-tight text-white mb-2 uppercase italic">
                        Logs do <span className="text-blue-400">Sistema</span>
                    </h1>
                    <p className="text-slate-400 text-sm font-medium flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]" />
                        Auditoria completa e monitoramento de erros em tempo real
                        {unresolvedCount > 0 && (
                            <span className="ml-2 px-2 py-0.5 rounded-full bg-red-500/20 text-red-400 text-[10px] font-black uppercase tracking-widest border border-red-500/30">
                                {unresolvedCount} erro{unresolvedCount !== 1 ? "s" : ""} não resolvido{unresolvedCount !== 1 ? "s" : ""}
                            </span>
                        )}
                    </p>
                </div>
                <form action="/api/sistema-x7k2/logs/export" method="POST">
                    <Button variant="outline" className="rounded-xl border-white/10 bg-white/[0.02] hover:bg-white/[0.05] text-white transition-all py-6 h-auto font-bold text-xs uppercase tracking-widest px-6 backdrop-blur-sm">
                        <Download className="mr-2 h-4 w-4" />
                        Exportar CSV
                    </Button>
                </form>
            </div>

            {/* Tab Navigation */}
            <div className="flex gap-2">
                <a href={`/sistema-x7k2/logs?tab=errors${query ? `&q=${query}` : ""}`}>
                    <div className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all cursor-pointer border ${tab !== "admin" ? "bg-red-500/10 border-red-500/20 text-red-400" : "bg-white/[0.02] border-white/[0.05] text-slate-500 hover:text-white"}`}>
                        <AlertTriangle className="h-3.5 w-3.5" />
                        Erros do Sistema
                        {unresolvedCount > 0 && (
                            <span className="w-5 h-5 rounded-full bg-red-500 text-white flex items-center justify-center text-[9px] font-black">
                                {unresolvedCount > 99 ? "99+" : unresolvedCount}
                            </span>
                        )}
                    </div>
                </a>
                <a href={`/sistema-x7k2/logs?tab=admin${query ? `&q=${query}` : ""}`}>
                    <div className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all cursor-pointer border ${tab === "admin" ? "bg-blue-500/10 border-blue-500/20 text-blue-400" : "bg-white/[0.02] border-white/[0.05] text-slate-500 hover:text-white"}`}>
                        <Activity className="h-3.5 w-3.5" />
                        Ações Administrativas
                        <span className="w-5 h-5 rounded-full bg-white/10 text-slate-400 flex items-center justify-center text-[9px] font-black">
                            {adminLogs.length}
                        </span>
                    </div>
                </a>
            </div>

            {/* Search */}
            <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                <form method="GET" action="/sistema-x7k2/logs">
                    <input type="hidden" name="tab" value={tab} />
                    <Input
                        name="q"
                        placeholder="Buscar por contexto, mensagem, ação, e-mail..."
                        className="pl-11 h-12 bg-white/[0.03] border-white/[0.05] rounded-xl text-white placeholder:text-slate-600 focus:ring-blue-500/20 focus:border-blue-500/30 font-medium w-full"
                        defaultValue={query}
                    />
                </form>
            </div>

            {/* ERRORS TAB */}
            {tab !== "admin" && (
                <Card className="border-white/[0.05] bg-white/[0.02] backdrop-blur-md shadow-2xl overflow-hidden">
                    <CardHeader className="border-b border-white/[0.05] bg-white/[0.01] p-6">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-lg bg-red-500/10 border border-red-500/20">
                                    <AlertTriangle className="h-5 w-5 text-red-400" />
                                </div>
                                <div>
                                    <h2 className="text-white font-black text-sm uppercase tracking-widest">Erros do Sistema</h2>
                                    <p className="text-slate-500 text-[10px] font-medium mt-0.5">
                                        {systemErrors.length} registros · {criticalCount} críticos não resolvidos
                                    </p>
                                </div>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader className="bg-white/[0.01]">
                                    <TableRow className="border-white/[0.05] hover:bg-transparent">
                                        <TableHead className="text-slate-500 font-bold uppercase tracking-widest text-[10px] py-4 px-6 whitespace-nowrap">Data/Hora</TableHead>
                                        <TableHead className="text-slate-500 font-bold uppercase tracking-widest text-[10px] py-4 px-6">Severidade</TableHead>
                                        <TableHead className="text-slate-500 font-bold uppercase tracking-widest text-[10px] py-4 px-6">Contexto</TableHead>
                                        <TableHead className="text-slate-500 font-bold uppercase tracking-widest text-[10px] py-4 px-6">Mensagem do Erro</TableHead>
                                        <TableHead className="text-slate-500 font-bold uppercase tracking-widest text-[10px] py-4 px-6">Origem</TableHead>
                                        <TableHead className="text-slate-500 font-bold uppercase tracking-widest text-[10px] py-4 px-6">URL</TableHead>
                                        <TableHead className="text-slate-500 font-bold uppercase tracking-widest text-[10px] py-4 px-6">Status</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {systemErrors.length === 0 ? (
                                        <TableRow className="border-white/[0.03]">
                                            <TableCell colSpan={7} className="h-40 text-center">
                                                <div className="flex flex-col items-center gap-3 text-slate-600">
                                                    <CheckCircle2 className="h-10 w-10 text-emerald-500/30" />
                                                    <span className="font-bold text-sm">Nenhum erro registrado</span>
                                                    <span className="text-xs">Sistema funcionando normalmente ✓</span>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        systemErrors.map((err: any) => {
                                            const sev = SEVERITY_STYLES[err.severity] || SEVERITY_STYLES.HIGH
                                            return (
                                                <TableRow key={err.id} className={`border-white/[0.03] hover:bg-white/[0.01] group transition-colors ${err.severity === "CRITICAL" && !err.resolved ? "bg-rose-500/[0.03]" : ""}`}>
                                                    {/* Time */}
                                                    <TableCell className="py-4 px-6 whitespace-nowrap">
                                                        <div className="flex flex-col">
                                                            <span className="text-slate-300 font-mono text-xs">
                                                                {new Date(err.createdAt).toLocaleString('pt-BR')}
                                                            </span>
                                                        </div>
                                                    </TableCell>

                                                    {/* Severity */}
                                                    <TableCell className="py-4 px-6">
                                                        <div className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-md border text-[10px] font-black uppercase tracking-widest ${sev.badge}`}>
                                                            <span className={`w-1.5 h-1.5 rounded-full ${sev.dot}`} />
                                                            {sev.label}
                                                        </div>
                                                    </TableCell>

                                                    {/* Context */}
                                                    <TableCell className="py-4 px-6 max-w-[180px]">
                                                        <span className="text-white font-bold text-xs truncate block" title={err.context}>
                                                            {err.context}
                                                        </span>
                                                    </TableCell>

                                                    {/* Message */}
                                                    <TableCell className="py-4 px-6 max-w-[280px]">
                                                        <div className="flex flex-col gap-1">
                                                            <span className="text-slate-300 font-mono text-[11px] truncate block" title={err.message}>
                                                                {err.message}
                                                            </span>
                                                            {err.stack && (
                                                                <details className="group/stack">
                                                                    <summary className="text-[9px] text-blue-400 cursor-pointer uppercase tracking-widest font-bold hover:text-blue-300 list-none">
                                                                        Ver stack trace
                                                                    </summary>
                                                                    <pre className="mt-2 text-[9px] text-slate-500 font-mono whitespace-pre-wrap max-h-24 overflow-y-auto bg-black/30 rounded p-2 border border-white/5">
                                                                        {err.stack}
                                                                    </pre>
                                                                </details>
                                                            )}
                                                        </div>
                                                    </TableCell>

                                                    {/* Source */}
                                                    <TableCell className="py-4 px-6">
                                                        <div className="flex items-center gap-1.5">
                                                            {err.source === "client" ? (
                                                                <Monitor className="h-3 w-3 text-slate-500" />
                                                            ) : (
                                                                <Database className="h-3 w-3 text-slate-500" />
                                                            )}
                                                            <span className="text-slate-400 text-[11px] font-medium">
                                                                {SOURCE_LABELS[err.source] || err.source}
                                                            </span>
                                                        </div>
                                                    </TableCell>

                                                    {/* URL */}
                                                    <TableCell className="py-4 px-6 max-w-[160px]">
                                                        {err.url ? (
                                                            <div className="flex items-center gap-1.5">
                                                                <Globe className="h-3 w-3 text-slate-600 shrink-0" />
                                                                <span className="text-slate-400 font-mono text-[10px] truncate" title={err.url}>
                                                                    {err.url.replace(/^https?:\/\/[^/]+/, '')}
                                                                </span>
                                                            </div>
                                                        ) : (
                                                            <span className="text-slate-700 text-[11px]">—</span>
                                                        )}
                                                    </TableCell>

                                                    {/* Status */}
                                                    <TableCell className="py-4 px-6">
                                                        {err.resolved ? (
                                                            <div className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-black uppercase tracking-widest">
                                                                <CheckCircle2 className="h-3 w-3" />
                                                                Resolvido
                                                            </div>
                                                        ) : (
                                                            <div className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md bg-red-500/10 text-red-400 border border-red-500/20 text-[10px] font-black uppercase tracking-widest">
                                                                <XCircle className="h-3 w-3" />
                                                                Aberto
                                                            </div>
                                                        )}
                                                    </TableCell>
                                                </TableRow>
                                            )
                                        })
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* ADMIN LOGS TAB */}
            {tab === "admin" && (
                <Card className="border-white/[0.05] bg-white/[0.02] backdrop-blur-md shadow-2xl overflow-hidden">
                    <CardHeader className="border-b border-white/[0.05] bg-white/[0.01] p-6">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-blue-500/10 border border-blue-500/20">
                                <Activity className="h-5 w-5 text-blue-400" />
                            </div>
                            <div>
                                <h2 className="text-white font-black text-sm uppercase tracking-widest">Ações Administrativas</h2>
                                <p className="text-slate-500 text-[10px] font-medium mt-0.5">{adminLogs.length} registros</p>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader className="bg-white/[0.01]">
                                    <TableRow className="border-white/[0.05] hover:bg-transparent">
                                        <TableHead className="text-slate-500 font-bold uppercase tracking-widest text-[10px] py-4 px-6">Data/Hora</TableHead>
                                        <TableHead className="text-slate-500 font-bold uppercase tracking-widest text-[10px] py-4 px-6">Administrador</TableHead>
                                        <TableHead className="text-slate-500 font-bold uppercase tracking-widest text-[10px] py-4 px-6">Ação</TableHead>
                                        <TableHead className="text-slate-500 font-bold uppercase tracking-widest text-[10px] py-4 px-6">Recurso</TableHead>
                                        <TableHead className="text-slate-500 font-bold uppercase tracking-widest text-[10px] py-4 px-6">Origem (IP)</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {adminLogs.length === 0 ? (
                                        <TableRow className="border-white/[0.03]">
                                            <TableCell colSpan={5} className="h-40 text-center text-slate-500 font-medium italic text-sm">
                                                Nenhuma ação administrativa registrada.
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        adminLogs.map((log: any) => (
                                            <TableRow key={log.id} className="border-white/[0.03] hover:bg-white/[0.01] group transition-colors">
                                                <TableCell className="py-4 px-6 whitespace-nowrap">
                                                    <div className="flex items-center space-x-2.5">
                                                        <div className="p-1.5 rounded-lg bg-indigo-500/10 border border-indigo-500/20">
                                                            <Clock className="h-3.5 w-3.5 text-indigo-400" />
                                                        </div>
                                                        <span className="text-slate-300 font-mono text-xs">
                                                            {new Date(log.createdAt).toLocaleString('pt-BR')}
                                                        </span>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="py-4 px-6">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-8 h-8 rounded-lg bg-white/[0.05] border border-white/10 flex items-center justify-center text-slate-400 font-bold text-xs uppercase">
                                                            {log.user?.name?.charAt(0) || <User className="h-4 w-4" />}
                                                        </div>
                                                        <div className="flex flex-col min-w-0">
                                                            <span className="font-bold text-white group-hover:text-blue-400 transition-colors uppercase tracking-tight text-xs truncate">
                                                                {log.user?.name || "Desconhecido"}
                                                            </span>
                                                            <span className="text-[10px] text-slate-500 font-medium truncate italic">{log.user?.email}</span>
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="py-4 px-6">
                                                    <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-blue-500/10 text-blue-400 border border-blue-500/20">
                                                        <Activity className="h-3 w-3" />
                                                        <span className="font-black text-[10px] uppercase tracking-widest">{log.action}</span>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="py-4 px-6 max-w-[240px]">
                                                    <div className="flex items-center gap-2">
                                                        <div className="p-1.5 rounded bg-white/[0.03] border border-white/[0.05]">
                                                            <Database className="h-3 w-3 text-slate-500" />
                                                        </div>
                                                        <span className="truncate font-mono text-[11px] text-slate-400 group-hover:text-slate-200 transition-colors">
                                                            {log.resource || "—"}
                                                        </span>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="py-4 px-6">
                                                    <span className="text-[11px] font-mono text-slate-500 py-1 px-2 rounded bg-white/[0.02] border border-white/[0.05]">
                                                        {log.ip || "0.0.0.0"}
                                                    </span>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    )
}
