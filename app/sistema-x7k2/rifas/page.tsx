import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Ticket, ExternalLink, User as UserIcon, Calendar } from "lucide-react"
import Link from "next/link"
import { AdminRifaActions } from "@/components/admin/AdminRifaActions"

const STATUS_LABELS: Record<string, { label: string, color: string }> = {
    DRAFT: { label: "Rascunho", color: "slate" },
    ACTIVE: { label: "Ativa", color: "emerald" },
    PAUSED: { label: "Pausada", color: "orange" },
    CLOSED: { label: "Encerrada", color: "blue" },
    DRAWN: { label: "Sorteada", color: "violet" },
    CANCELLED: { label: "Cancelada", color: "red" },
}

export const dynamic = 'force-dynamic'

export default async function AdminRifasPage() {
    const session = await auth()

    if (!session?.user || !["ADMIN", "SUPER_ADMIN"].includes(session.user.role)) {
        redirect("/sistema-x7k2/login")
    }

    const rifas = await prisma.rifa.findMany({
        where: { status: { not: "DELETED" } },
        include: {
            user: { select: { name: true, email: true, isBlocked: true } },
            _count: { select: { numbers: { where: { status: "PAID" } } } }
        },
        orderBy: { createdAt: "desc" }
    })

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="space-y-3">
                    <div className="px-3 py-1 w-fit rounded-full text-[10px] font-black bg-indigo-500/30 text-indigo-300 border border-indigo-500/40 uppercase tracking-[0.2em] shadow-[0_0_15px_rgba(99,102,241,0.2)]">
                        Gestão Global
                    </div>
                    <div className="space-y-1">
                        <h1 className="text-5xl font-black tracking-tight text-white drop-shadow-md">Todas as Campanhas</h1>
                        <p className="text-slate-100 text-base font-bold max-w-xl leading-relaxed opacity-100">
                            Monitore, cancele ou exclua qualquer rifa criada na plataforma.
                        </p>
                    </div>
                </div>
            </div>

            <div className="grid gap-4">
                {rifas.map((rifa) => {
                    const status = STATUS_LABELS[rifa.status] || { label: rifa.status, color: "slate" }
                    const progress = Math.round(((rifa._count.numbers || 0) / rifa.totalNumbers) * 100)

                    return (
                        <Card key={rifa.id} className="group overflow-hidden border-white/[0.05] bg-white/[0.03] backdrop-blur-md hover:bg-white/[0.06] transition-all shadow-lg">
                            <CardContent className="p-6">
                                <div className="flex flex-col lg:flex-row lg:items-center gap-6">
                                    <div className="flex-1 space-y-4">
                                        <div className="flex items-start justify-between gap-4">
                                            <div className="space-y-1">
                                                <div className="flex items-center gap-2">
                                                    <h3 className="text-lg font-black text-white group-hover:text-indigo-400 transition-colors">
                                                        {rifa.title}
                                                    </h3>
                                                    <Badge className={`bg-${status.color}-500/20 text-${status.color}-400 border-${status.color}-500/30 font-black text-[10px] uppercase tracking-widest`}>
                                                        {status.label}
                                                    </Badge>
                                                    {rifa.user.isBlocked && (
                                                        <Badge variant="destructive" className="font-black text-[10px] uppercase tracking-widest animate-pulse">
                                                            Organizador Bloqueado
                                                        </Badge>
                                                    )}
                                                </div>
                                                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs font-bold text-slate-300">
                                                    <div className="flex items-center gap-1.5 hover:text-white transition-colors cursor-default">
                                                        <UserIcon className="h-3.5 w-3.5 text-indigo-400" />
                                                        {rifa.user.name} ({rifa.user.email})
                                                    </div>
                                                    <div className="flex items-center gap-1.5">
                                                        <Calendar className="h-3.5 w-3.5 text-indigo-400" />
                                                        {new Date(rifa.createdAt).toLocaleDateString('pt-BR')}
                                                    </div>
                                                    <div className="flex items-center gap-1.5">
                                                        <Ticket className="h-3.5 w-3.5 text-indigo-400" />
                                                        {rifa.totalNumbers} números • slug: {rifa.slug}
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-2">
                                                <Button asChild variant="ghost" size="icon" className="h-9 w-9 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-all">
                                                    <Link href={`/r/${rifa.slug}`} target="_blank">
                                                        <ExternalLink className="h-4.5 w-4.5" />
                                                    </Link>
                                                </Button>
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest">
                                                <span className="text-slate-400">Progresso de Vendas</span>
                                                <span className="text-white">{progress}% ({rifa._count.numbers} / {rifa.totalNumbers})</span>
                                            </div>
                                            <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                                                <div
                                                    className="h-full bg-indigo-500 transition-all duration-1000 shadow-[0_0_10px_rgba(99,102,241,0.5)]"
                                                    style={{ width: `${progress}%` }}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex flex-row lg:flex-col gap-2">
                                        <AdminRifaActions rifaId={rifa.id} status={rifa.status} />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    )
                })}

                {rifas.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-20 bg-white/[0.02] border border-dashed border-white/[0.1] rounded-3xl">
                        <Ticket className="h-12 w-12 text-slate-600 mb-4" />
                        <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Nenhuma campanha encontrada</p>
                    </div>
                )}
            </div>
        </div>
    )
}
