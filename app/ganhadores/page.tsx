import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Ticket, Trophy, ArrowLeft, Star, Users, Calendar } from "lucide-react"

export default function GanhadoresPage() {
    return (
        <div className="min-h-screen bg-[#fcfcfd] dark:bg-[#0f0a19] text-slate-900 dark:text-slate-100 font-sans">
            {/* Header / Nav */}
            <nav className="fixed top-0 w-full z-50 bg-white/70 dark:bg-[#0f0a19]/70 backdrop-blur-xl border-b border-primary/5 px-6 md:px-12 py-4">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-2 group">
                        <Button variant="ghost" size="icon" className="rounded-full mr-2">
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                        <span className="text-xl font-black tracking-tighter uppercase italic">
                            Rifa<span className="text-primary">Online</span>
                        </span>
                    </Link>
                    <Link href="/rifas">
                        <Button className="bg-primary hover:bg-primary/90 text-white shadow-xl shadow-primary/20 px-6 rounded-full text-[11px] font-black uppercase tracking-widest active:scale-95 transition-all">
                            Ver Sorteios Ativos
                        </Button>
                    </Link>
                </div>
            </nav>

            <main className="pt-32 pb-20 px-6">
                <div className="max-w-5xl mx-auto space-y-12">
                    <div className="text-center space-y-4">
                        <div className="inline-flex items-center gap-2 bg-yellow-400/10 px-4 py-2 rounded-full border border-yellow-400/20 text-yellow-600 dark:text-yellow-400">
                            <Trophy className="h-4 w-4 fill-yellow-400" />
                            <span className="text-[10px] font-black uppercase tracking-widest">Hall da Fama</span>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-black tracking-tight text-slate-900 dark:text-white">Nossos Ganhadores</h1>
                        <p className="text-slate-500 dark:text-slate-400 font-medium max-w-2xl mx-auto">
                            A transparência é o nosso maior valor. Confira aqui todos os resultados e a alegria de quem já ganhou com o RifaOnline.
                        </p>
                    </div>

                    {/* Empty State / Coming Soon */}
                    <div className="relative group overflow-hidden bg-white dark:bg-slate-800/50 p-16 rounded-[3rem] border border-primary/5 text-center space-y-8 shadow-sm">
                        <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary/5 blur-[80px] rounded-full group-hover:bg-primary/10 transition-colors"></div>

                        <div className="size-20 bg-primary/10 text-primary rounded-3xl flex items-center justify-center mx-auto mb-6">
                            <Star className="h-10 w-10 fill-primary" />
                        </div>

                        <div className="space-y-2">
                            <h3 className="text-2xl font-black dark:text-white">Resultados em Breve</h3>
                            <p className="text-slate-500 dark:text-slate-400 font-medium max-w-sm mx-auto">
                                Estamos processando os últimos sorteios da semana. Volte em breve para ver os novos sortudos!
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-8">
                            {[
                                { icon: Users, label: "+10.000 Participantes", color: "text-blue-500", bg: "bg-blue-500/10" },
                                { icon: Trophy, label: "500+ Prêmios Entregues", color: "text-yellow-500", bg: "bg-yellow-500/10" },
                                { icon: Calendar, label: "Sorteios Diários", color: "text-purple-500", bg: "bg-purple-500/10" }
                            ].map((item, i) => (
                                <div key={i} className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-primary/5 flex flex-col items-center gap-3">
                                    <div className={`size-12 ${item.bg} ${item.color} rounded-xl flex items-center justify-center`}>
                                        <item.icon className="h-6 w-6" />
                                    </div>
                                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">{item.label}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </main>

            <footer className="py-12 border-t border-primary/5 text-center px-6">
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                    © 2024 RifaOnline • Auditoria Certificada e Transparência Total
                </p>
            </footer>
        </div>
    )
}
