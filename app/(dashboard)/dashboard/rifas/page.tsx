import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Edit3, PlusCircle, Ticket } from "lucide-react"
import { cn } from "@/lib/utils"
import { RifaStatus } from "@prisma/client"

export default async function RifasPage() {
    const session = await auth()
    if (!session?.user?.id) redirect("/login")

    const rifas = await prisma.rifa.findMany({
        where: {
            userId: session.user.id,
            status: { in: ["DRAFT", "ACTIVE", "PAUSED", "CLOSED", "DRAWN", "CANCELLED"] as any }
        },
        orderBy: { createdAt: "desc" },
        include: {
            _count: {
                select: { numbers: { where: { status: "PAID" } } }
            }
        }
    })

    return (
        <div className="space-y-8 pb-12">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Minhas Campanhas</h1>
                    <p className="text-slate-500 font-medium mt-1">
                        Gerencie e acompanhe o desempenho de todas as suas campanhas digitais.
                    </p>
                </div>
                <Button asChild className="h-12 px-6 rounded-2xl font-bold shadow-lg shadow-primary/20 hover:scale-105 transition-transform">
                    <Link href="/dashboard/rifas/nova" className="flex items-center gap-2">
                        <PlusCircle className="h-5 w-5" />
                        Lançar Campanha
                    </Link>
                </Button>
            </div>

            {rifas.length === 0 ? (
                <Card className="rounded-3xl border-dashed border-2 border-primary/10 bg-primary/5 py-16">
                    <CardContent className="flex flex-col items-center text-center">
                        <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-primary shadow-sm mb-6">
                            <Ticket className="h-8 w-8" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 mb-2">Sua primeira campanha começa aqui</h3>
                        <p className="text-slate-500 mb-8 max-w-sm">Você ainda não criou nenhuma campanha. Comece agora e alcance seus objetivos de arrecadação digital.</p>
                        <Button asChild className="rounded-xl px-8 font-bold">
                            <Link href="/dashboard/rifas/nova">Lançar Campanha Agora</Link>
                        </Button>
                    </CardContent>
                </Card>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {rifas.map((rifa) => {
                        const progress = Math.round((rifa._count.numbers / rifa.totalNumbers) * 100)
                        const statusColors = {
                            ACTIVE: "bg-green-500",
                            DRAFT: "bg-slate-400",
                            PAUSED: "bg-orange-500",
                            CLOSED: "bg-red-500",
                            DRAWN: "bg-purple-500",
                            CANCELLED: "bg-red-600",
                        }
                        const statusLabels = {
                            ACTIVE: "Ativa",
                            DRAFT: "Rascunho",
                            PAUSED: "Pausada",
                            CLOSED: "Encerrada",
                            DRAWN: "Premiada",
                            CANCELLED: "Cancelada",
                        }

                        return (
                            <Card key={rifa.id} className="bg-white dark:bg-slate-900 rounded-3xl overflow-hidden shadow-sm border border-primary/5 group hover:shadow-xl transition-all duration-300">
                                <div className="h-48 overflow-hidden relative">
                                    <div className="absolute top-4 left-4 z-10">
                                        <Badge className={cn("text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full shadow-lg border-none", statusColors[rifa.status as keyof typeof statusColors])}>
                                            {statusLabels[rifa.status as keyof typeof statusLabels]}
                                        </Badge>
                                    </div>
                                    <img
                                        src={rifa.coverImage || "https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?q=80&w=800&auto=format&fit=crop"}
                                        alt={rifa.title}
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                                </div>

                                <CardContent className="p-6">
                                    <h3 className="text-lg font-bold mb-4 line-clamp-1 group-hover:text-primary transition-colors">{rifa.title}</h3>

                                    <div className="space-y-4">
                                        <div>
                                            <div className="flex justify-between text-sm mb-2">
                                                <span className="text-slate-500 font-bold text-xs uppercase tracking-tight">Vendas</span>
                                                <span className="text-primary font-extrabold">{progress}%</span>
                                            </div>
                                            <div className="w-full h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                                <div
                                                    className="h-full bg-primary rounded-full transition-all duration-1000 ease-out"
                                                    style={{ width: `${progress}%` }}
                                                ></div>
                                            </div>
                                        </div>

                                        <div className="flex justify-between items-center pt-4 border-t border-slate-50 dark:border-slate-800">
                                            <div>
                                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-0.5">Arrecadado</p>
                                                <p className="font-extrabold text-slate-900 dark:text-slate-100">
                                                    {new Intl.NumberFormat("pt-BR", {
                                                        style: "currency",
                                                        currency: "BRL"
                                                    }).format(Number(rifa.totalRaised))}
                                                </p>
                                            </div>
                                            <div className="flex gap-2">
                                                <Button size="icon" variant="outline" asChild className="w-10 h-10 rounded-xl bg-primary/5 border-none text-primary hover:bg-primary hover:text-white transition-all shadow-none">
                                                    <Link href={`/dashboard/rifas/${rifa.id}/configuracoes`}>
                                                        <Edit3 className="h-4 w-4" />
                                                    </Link>
                                                </Button>
                                                <Button size="icon" variant="default" asChild className="w-10 h-10 rounded-xl shadow-lg shadow-primary/20 hover:scale-110 transition-transform">
                                                    <Link href={`/dashboard/rifas/${rifa.id}`}>
                                                        <ArrowRight className="h-4 w-4" />
                                                    </Link>
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        )
                    })}
                </div>
            )}
        </div>
    )
}
