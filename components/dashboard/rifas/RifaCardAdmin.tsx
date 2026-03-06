"use client"

import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Edit3, Trophy, Rocket, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { useState } from "react"
import { publishRifaAction } from "@/actions/rifas"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

interface RifaCardAdminProps {
    rifa: {
        id: string
        title: string
        coverImage: string | null
        status: string
        totalNumbers: number
        totalRaised: any // Decimal from Prisma
        _count: {
            numbers: number
        }
        prizes: { title: string; position: number }[]
    }
}

function PublishButton({ rifaId }: { rifaId: string }) {
    const [loading, setLoading] = useState(false)
    const router = useRouter()

    const handlePublish = async () => {
        setLoading(true)
        const promise = publishRifaAction(rifaId)

        toast.promise(promise, {
            loading: 'Ativando campanha...',
            success: (res) => {
                if (res.success) {
                    router.refresh()
                    return 'Sua campanha está no ar! 🚀'
                }
                throw new Error(res.error || 'Erro ao publicar')
            },
            error: (err) => err.message || 'Erro ao publicar campanha',
        })

        try {
            await promise
        } catch (e) {
            // Error handled by toast.promise
        } finally {
            setLoading(false)
        }
    }

    return (
        <Button
            onClick={handlePublish}
            disabled={loading}
            className="h-10 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-black text-[10px] uppercase tracking-widest gap-2 shadow-lg shadow-emerald-500/20 px-4 transition-all active:scale-95"
        >
            {loading ? <Loader2 className="h-3 w-3 animate-spin" /> : <Rocket className="h-3 w-3" />}
            Publicar
        </Button>
    )
}

export function RifaCardAdmin({ rifa }: RifaCardAdminProps) {
    const progress = Math.round((rifa._count.numbers / rifa.totalNumbers) * 100)

    const statusColors: Record<string, string> = {
        ACTIVE: "bg-green-500",
        DRAFT: "bg-slate-400",
        PAUSED: "bg-orange-500",
        CLOSED: "bg-red-500",
        DRAWN: "bg-purple-500",
        CANCELLED: "bg-red-600",
    }

    const statusLabels: Record<string, string> = {
        ACTIVE: "Ativa (Pública)",
        DRAFT: "Rascunho (Privada)",
        PAUSED: "Pausada",
        CLOSED: "Encerrada",
        DRAWN: "Premiada",
        CANCELLED: "Cancelada",
    }

    return (
        <Card className="bg-white dark:bg-slate-900 rounded-3xl overflow-hidden shadow-sm border border-primary/5 group hover:shadow-xl transition-all duration-300">
            <div className="h-48 overflow-hidden relative">
                <div className="absolute top-4 left-4 z-10">
                    <Badge className={cn("text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full shadow-lg border-none", statusColors[rifa.status])}>
                        {statusLabels[rifa.status] || rifa.status}
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
                <div className="flex items-start justify-between mb-2">
                    <h3 className="text-lg font-bold line-clamp-1 group-hover:text-primary transition-colors">{rifa.title}</h3>
                </div>
                {rifa.status === "DRAFT" && (
                    <p className="text-[10px] text-amber-600 font-bold uppercase tracking-tight mb-4 flex items-center gap-1">
                        ⚠️ Não aparece na listagem pública
                    </p>
                )}

                <div className="space-y-4">
                    {rifa.prizes && rifa.prizes.length > 0 && (
                        <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800/50 flex items-center gap-3">
                            <div className="size-8 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                                <Trophy className="h-4 w-4" />
                            </div>
                            <div className="min-w-0">
                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Prêmio Principal</p>
                                <p className="text-[11px] font-bold text-slate-900 dark:text-white truncate uppercase tracking-tight">
                                    {rifa.prizes[0].title}
                                </p>
                            </div>
                        </div>
                    )}

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
                        <div className="flex gap-2 items-center">
                            {rifa.status === "DRAFT" && (
                                <PublishButton rifaId={rifa.id} />
                            )}
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
}
