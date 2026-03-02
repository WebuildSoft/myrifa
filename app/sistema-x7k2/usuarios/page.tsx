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
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import {
    Search,
    UserPlus,
    MoreHorizontal,
    UserCheck,
    UserX,
    ShieldAlert,
    User,
    Zap
} from "lucide-react"

// Import custom admin actions
import { UserActions } from "@/components/admin/UserActions"

export const dynamic = 'force-dynamic'

export default async function UsuariosPage({
    searchParams
}: {
    searchParams: { q?: string }
}) {
    const session = await auth()

    if (!session?.user || !["ADMIN", "SUPER_ADMIN"].includes(session.user.role)) {
        redirect("/sistema-x7k2/login")
    }

    const query = searchParams.q || ""
    const now = new Date()

    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000)

    // Fetch users with active sessions counts + Visitors
    const [users, totalCount, blockedCount, onlineCount, visitorCount] = await Promise.all([
        prisma.user.findMany({
            where: {
                OR: [
                    { name: { contains: query, mode: 'insensitive' } },
                    { email: { contains: query, mode: 'insensitive' } }
                ]
            },
            orderBy: { createdAt: 'desc' },
            take: 50
        }),
        prisma.user.count(),
        prisma.user.count({ where: { isBlocked: true } }),
        // Online = lastActiveAt within the last 5 minutes (heartbeat-based)
        (prisma as any).user.count({ where: { lastActiveAt: { gte: fiveMinutesAgo } } }),
        (prisma as any).visitor.count({
            where: { lastSeen: { gte: fiveMinutesAgo } }
        })
    ])

    const isSuperAdmin = session?.user.role === "SUPER_ADMIN"

    return (
        <div className="space-y-8 pb-12">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-4xl font-black tracking-tight text-white mb-2 uppercase italic">
                        Usuários <span className="text-indigo-500">Admin</span>
                    </h1>
                    <p className="text-slate-400 text-sm font-medium flex items-center">
                        <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 mr-2 shadow-[0_0_8px_rgba(99,102,241,0.5)]" />
                        Gerenciamento de acessos e estatísticas em tempo real
                    </p>
                </div>
                <Button className="rounded-xl bg-indigo-500 hover:bg-indigo-600 text-white shadow-lg shadow-indigo-500/20 transition-all py-6 h-auto font-black text-[10px] uppercase tracking-widest px-8">
                    <UserPlus className="mr-2 h-4 w-4" />
                    Novo Usuário
                </Button>
            </div>

            {/* QUICK STATS */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="border-white/[0.05] bg-white/[0.02] backdrop-blur-md shadow-xl group hover:border-white/[0.1] transition-all overflow-hidden relative">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <User className="h-12 w-12 text-white" />
                    </div>
                    <CardContent className="p-6">
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1 text-ellipsis overflow-hidden whitespace-nowrap">Total de Usuários</p>
                        <h3 className="text-3xl font-black text-white">{totalCount}</h3>
                        <div className="mt-4 flex items-center space-x-2">
                            <span className="w-2 h-2 rounded-full bg-indigo-500" />
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Registrados</span>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-white/[0.05] bg-white/[0.02] backdrop-blur-md shadow-xl group hover:border-white/[0.1] transition-all overflow-hidden relative">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <UserCheck className="h-12 w-12 text-emerald-500" />
                    </div>
                    <CardContent className="p-6">
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1 text-ellipsis overflow-hidden whitespace-nowrap">Usuários Ativos</p>
                        <h3 className="text-3xl font-black text-white">{totalCount - blockedCount}</h3>
                        <div className="mt-4 flex items-center space-x-2">
                            <span className="w-2 h-2 rounded-full bg-emerald-500" />
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Permitidos</span>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-white/[0.08] bg-indigo-500/5 backdrop-blur-md shadow-xl group hover:border-indigo-500/20 transition-all overflow-hidden relative">
                    <div className="absolute top-0 right-0 p-4 opacity-20 group-hover:opacity-30 transition-opacity">
                        <Zap className="h-12 w-12 text-indigo-500" />
                    </div>
                    <CardContent className="p-6">
                        <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-1 text-ellipsis overflow-hidden whitespace-nowrap">Admins Online</p>
                        <h3 className="text-3xl font-black text-white">{onlineCount}</h3>
                        <div className="mt-4 flex items-center space-x-2">
                            <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest italic">Sessões</span>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-white/[0.08] bg-amber-500/5 backdrop-blur-md shadow-xl group hover:border-amber-500/20 transition-all overflow-hidden relative">
                    <div className="absolute top-0 right-0 p-4 opacity-20 group-hover:opacity-30 transition-opacity">
                        <Search className="h-12 w-12 text-amber-500" />
                    </div>
                    <CardContent className="p-6">
                        <p className="text-[10px] font-black text-amber-400 uppercase tracking-widest mb-1 text-ellipsis overflow-hidden whitespace-nowrap">Visitantes Online</p>
                        <h3 className="text-3xl font-black text-white">{visitorCount}</h3>
                        <div className="mt-4 flex items-center space-x-2">
                            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest italic">Navegação real</span>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <Card className="border-white/[0.05] bg-white/[0.02] backdrop-blur-md shadow-2xl overflow-hidden">
                <CardHeader className="border-b border-white/[0.05] bg-white/[0.01] p-6">
                    <div className="flex flex-col md:flex-row md:items-center gap-4">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                            <form method="GET" action="/sistema-x7k2/usuarios">
                                <Input
                                    name="q"
                                    placeholder="Buscar por nome ou e-mail..."
                                    className="pl-10 h-12 bg-white/[0.03] border-white/[0.05] rounded-xl text-white placeholder:text-slate-600 focus:ring-indigo-500/20 focus:border-indigo-500/30 transition-all text-xs font-bold"
                                    defaultValue={query}
                                />
                            </form>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="overflow-x-auto custom-scrollbar">
                        <Table>
                            <TableHeader className="bg-white/[0.01]">
                                <TableRow className="border-white/[0.05] hover:bg-transparent">
                                    <TableHead className="text-slate-500 font-black uppercase tracking-widest text-[10px] py-4 px-6">Usuário</TableHead>
                                    <TableHead className="text-slate-500 font-black uppercase tracking-widest text-[10px] py-4 px-6">Cargo</TableHead>
                                    <TableHead className="text-slate-500 font-black uppercase tracking-widest text-[10px] py-4 px-6">Status</TableHead>
                                    <TableHead className="text-slate-500 font-black uppercase tracking-widest text-[10px] py-4 px-6">Criado em</TableHead>
                                    <TableHead className="text-right text-slate-500 font-black uppercase tracking-widest text-[10px] py-4 px-6">Ações</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {users.length === 0 ? (
                                    <TableRow className="border-white/[0.03] hover:bg-white/[0.01]">
                                        <TableCell colSpan={5} className="h-40 text-center text-slate-500 font-bold uppercase tracking-widest text-xs">
                                            Nenhum usuário encontrado.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    users.map((user) => {
                                        const isOnline = (user as any).lastActiveAt != null && (user as any).lastActiveAt >= fiveMinutesAgo
                                        return (
                                            <TableRow key={user.id} className="border-white/[0.03] hover:bg-white/[0.01] group transition-colors">
                                                <TableCell className="py-4 px-6">
                                                    <div className="flex items-center gap-3">
                                                        <div className="relative">
                                                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500/20 to-violet-500/20 border border-white/10 flex items-center justify-center text-indigo-400 font-black overflow-hidden shadow-inner uppercase italic">
                                                                {user.name ? user.name.charAt(0).toUpperCase() : <User className="h-5 w-5" />}
                                                            </div>
                                                            {isOnline && (
                                                                <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-[#020617] shadow-[0_0_10px_rgba(16,185,129,0.5)] animate-pulse" />
                                                            )}
                                                        </div>
                                                        <div className="flex flex-col">
                                                            <div className="flex items-center gap-2">
                                                                <span className="font-bold text-white group-hover:text-indigo-400 transition-colors uppercase tracking-tight text-xs">{user.name || "Sem nome"}</span>
                                                                {isOnline && (
                                                                    <span className="text-[8px] font-black text-emerald-500 uppercase tracking-widest bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">Online</span>
                                                                )}
                                                            </div>
                                                            <span className="text-[10px] text-slate-500 font-bold tracking-tight">{user.email}</span>
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="py-4 px-6">
                                                    <Badge variant="outline" className={cn(
                                                        "px-3 py-1 rounded-lg border font-black text-[9px] uppercase tracking-wider",
                                                        user.role === "SUPER_ADMIN" ? "bg-purple-500/10 text-purple-400 border-purple-500/20 shadow-[0_0_10px_rgba(168,85,247,0.1)]" :
                                                            user.role === "ADMIN" ? "bg-blue-500/10 text-blue-400 border-blue-500/20 shadow-[0_0_10px_rgba(59,130,246,0.1)]" :
                                                                "bg-slate-500/10 text-slate-400 border-white/5"
                                                    )}>
                                                        {user.role}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="py-4 px-6">
                                                    {user.isBlocked ? (
                                                        <div className="inline-flex items-center px-2 py-1 rounded-md bg-red-500/10 text-red-400 border border-red-500/20 text-[9px] font-black uppercase tracking-widest">
                                                            Bloqueado
                                                        </div>
                                                    ) : (
                                                        <div className="inline-flex items-center px-2 py-1 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[9px] font-black uppercase tracking-widest shadow-[0_0_8px_rgba(16,185,129,0.1)]">
                                                            Ativo
                                                        </div>
                                                    )}
                                                </TableCell>
                                                <TableCell className="py-4 px-6 text-[10px] text-slate-400 font-black uppercase tracking-widest">
                                                    {new Date(user.createdAt).toLocaleDateString('pt-BR')}
                                                </TableCell>
                                                <TableCell className="py-4 px-6 text-right">
                                                    <UserActions
                                                        userId={user.id}
                                                        isBlocked={user.isBlocked}
                                                        isSuperAdmin={isSuperAdmin}
                                                    />
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
        </div>
    )
}
