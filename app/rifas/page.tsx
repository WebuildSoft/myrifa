import { prisma } from "@/lib/prisma"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Ticket, Search, Filter, ArrowRight, Zap, Trophy, ShieldCheck } from "lucide-react"
import { cn } from "@/lib/utils"

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

    const categoryLabels: Record<string, string> = {
        SORTEIO: "Sorteio",
        ARRECADACAO: "Solidária",
        VIAGEM: "Viagem",
        MISSAO: "Missão",
        SAUDE: "Saúde",
        ESPORTE: "Esporte",
        OUTRO: "Outro",
    }

    return (
        <div className="min-h-screen bg-[#fcfcfd] dark:bg-[#0f0a19] text-slate-900 dark:text-slate-100 font-sans">
            {/* Header / Nav */}
            <nav className="fixed top-0 w-full z-50 bg-white/70 dark:bg-[#0f0a19]/70 backdrop-blur-xl border-b border-primary/5 px-6 md:px-12 py-4">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-2 group">
                        <div className="size-10 bg-primary text-white rounded-xl flex items-center justify-center shadow-lg shadow-primary/20 group-hover:rotate-6 transition-transform">
                            <Ticket className="h-6 w-6" />
                        </div>
                        <span className="text-xl font-black tracking-tighter uppercase italic">
                            Rifa<span className="text-primary">Online</span>
                        </span>
                    </Link>

                    <div className="hidden md:flex items-center gap-4 bg-slate-50 dark:bg-slate-900 px-4 py-2 rounded-2xl border border-primary/5">
                        <Search className="h-4 w-4 text-slate-400" />
                        <input
                            placeholder="Buscar sorteios..."
                            className="bg-transparent border-none outline-none text-sm font-medium w-64 placeholder:text-slate-400"
                        />
                    </div>

                    <div className="flex items-center gap-3">
                        <Link href="/minhas-cotas" className="hidden sm:block">
                            <Button variant="ghost" className="text-[11px] font-black uppercase tracking-widest rounded-full">
                                Minhas Cotas
                            </Button>
                        </Link>
                        <Link href="/login">
                            <Button className="bg-primary hover:bg-primary/90 text-white shadow-xl shadow-primary/20 px-6 rounded-full text-[11px] font-black uppercase tracking-widest active:scale-95 transition-all">
                                Criar Rifa
                            </Button>
                        </Link>
                    </div>
                </div>
            </nav>

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
                            {rifas.map((rifa) => {
                                const progress = Math.round((rifa._count.numbers / rifa.totalNumbers) * 100)
                                const formattedPrice = new Intl.NumberFormat("pt-BR", {
                                    style: "currency",
                                    currency: "BRL"
                                }).format(Number(rifa.numberPrice))

                                return (
                                    <Link key={rifa.id} href={`/r/${rifa.slug}`} className="group block">
                                        <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] overflow-hidden border border-primary/5 hover:border-primary/20 hover:shadow-2xl hover:shadow-primary/5 transition-all duration-500 group-hover:-translate-y-2">
                                            <div className="h-64 overflow-hidden relative">
                                                <div className="absolute top-6 left-6 z-10">
                                                    <Badge className="bg-white shadow-xl text-primary text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-full border-none">
                                                        {categoryLabels[rifa.category] ?? rifa.category}
                                                    </Badge>
                                                </div>
                                                <img
                                                    src={rifa.coverImage || "https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?q=80&w=800&auto=format&fit=crop"}
                                                    alt={rifa.title}
                                                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                                                />
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                                                <div className="absolute bottom-6 right-6 font-black text-white text-2xl drop-shadow-lg">
                                                    {formattedPrice}
                                                </div>
                                            </div>

                                            <div className="p-8 space-y-6">
                                                <div className="space-y-3">
                                                    <h3 className="text-xl font-black line-clamp-2 leading-tight dark:text-white group-hover:text-primary transition-colors">
                                                        {rifa.title}
                                                    </h3>
                                                    <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                                        <div
                                                            className="h-full bg-primary rounded-full transition-all duration-1000 ease-out shadow-[0_0_8px_rgba(124,59,237,0.4)]"
                                                            style={{ width: `${progress}%` }}
                                                        ></div>
                                                    </div>
                                                </div>

                                                <div className="flex justify-between items-center pt-6 border-t border-slate-50 dark:border-slate-800">
                                                    <div className="flex items-center gap-2">
                                                        <div className="size-8 bg-primary/10 rounded-lg flex items-center justify-center text-primary">
                                                            <Trophy className="h-4 w-4" />
                                                        </div>
                                                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Garantido</span>
                                                    </div>
                                                    <div className="flex items-center gap-2 text-primary font-black text-[11px] uppercase tracking-widest">
                                                        Participar <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                )
                            })}
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
                    © 2024 RifaOnline • Jogue com responsabilidade.
                </p>
            </footer>
        </div>
    )
}
