import { prisma } from "@/lib/prisma"
import { Ticket, Zap, Trophy, ShieldCheck, Filter } from "lucide-react"
import { Button } from "@/components/ui/button"
import { RifaSearchNav } from "@/components/rifas/RifaSearchNav"
import { RifaPublicCard } from "@/components/rifas/RifaPublicCard"

export default async function PublicRifasPage() {
    const rifas = await prisma.rifa.findMany({
        where: {
            status: "ACTIVE",
            isPrivate: false
        },
        orderBy: { createdAt: "desc" },
        include: {
            _count: {
                select: { numbers: { where: { status: "PAID" } } }
            }
        }
    })

    return (
        <div className="min-h-screen bg-[#fcfcfd] dark:bg-[#0f0a19] text-slate-900 dark:text-slate-100 font-sans">
            <RifaSearchNav />

            <main className="pt-32 pb-20 px-6">
                <div className="max-w-7xl mx-auto space-y-12">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                        <div className="space-y-4">
                            <div className="inline-flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-full border border-primary/20">
                                <Zap className="h-4 w-4 text-primary fill-primary" />
                                <span className="text-[10px] font-black uppercase tracking-widest text-primary">Sorteios Ativos</span>
                            </div>
                            <h1 className="text-4xl md:text-5xl font-black tracking-tight text-slate-900 dark:text-white">Escolha sua sorte</h1>
                            <p className="text-slate-500 dark:text-slate-400 font-medium max-w-xl">
                                Participe de campanhas auditadas e regulamentadas. Diversos prêmios, causas nobres e experiências incríveis esperando por você.
                            </p>
                        </div>

                        <div className="flex gap-2">
                            <Button variant="outline" className="rounded-xl border-primary/10 text-slate-500 font-bold text-xs h-12 px-6">
                                <Filter className="h-4 w-4 mr-2" /> Categorias
                            </Button>
                        </div>
                    </div>

                    {rifas.length === 0 ? (
                        <div className="bg-white dark:bg-slate-800/50 p-20 rounded-[3rem] border border-primary/5 text-center space-y-6">
                            <div className="size-20 bg-slate-100 dark:bg-slate-900 rounded-3xl flex items-center justify-center mx-auto mb-6 text-slate-400">
                                <Ticket className="h-10 w-10" />
                            </div>
                            <h3 className="text-2xl font-black dark:text-white">Nenhum sorteio ativo no momento</h3>
                            <p className="text-slate-500 dark:text-slate-400 font-medium max-w-sm mx-auto">
                                Estamos preparando novas campanhas incríveis. Volte em alguns minutos!
                            </p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {rifas.map((rifa) => (
                                <RifaPublicCard key={rifa.id} rifa={rifa as any} />
                            ))}
                        </div>
                    )}

                    {/* Trust Banner */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-12">
                        {[
                            { icon: ShieldCheck, title: "Plataforma Segura", desc: "Pagamentos processados com tecnologia de ponta." },
                            { icon: Zap, title: "Sorteio Instatâneo", desc: "Resultados automáticos baseados na loteria federal." },
                            { icon: Trophy, title: "Prêmios Reais", desc: "Milhares de vidas transformadas todos os meses." }
                        ].map((item, i) => (
                            <div key={i} className="flex gap-4 p-6 rounded-3xl bg-white dark:bg-slate-800/30 border border-primary/5">
                                <div className="size-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                                    <item.icon className="h-6 w-6" />
                                </div>
                                <div className="space-y-1">
                                    <h4 className="font-black text-sm dark:text-white">{item.title}</h4>
                                    <p className="text-xs text-slate-500 font-medium leading-relaxed">{item.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </main>

            <footer className="py-12 border-t border-primary/5 text-center px-6">
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                    © 2024 MyRifa • Jogue com responsabilidade.
                </p>
            </footer>
        </div>
    )
}
