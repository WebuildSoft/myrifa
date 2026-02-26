import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
    Flag,
    Heart,
    ShieldCheck,
    Zap,
    Users,
    Trophy,
    ArrowLeft,
    CheckCircle2
} from "lucide-react"

export default function SobrePage() {
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
                    <Button asChild className="bg-primary hover:bg-primary/90 text-white rounded-full text-[11px] font-black uppercase tracking-widest px-6 shadow-xl shadow-primary/20 transition-all">
                        <Link href="/register">Começar Agora</Link>
                    </Button>
                </div>
            </nav>

            <main className="pt-32 pb-24 px-6">
                <div className="max-w-4xl mx-auto space-y-24">
                    {/* Hero Section */}
                    <section className="text-center space-y-6">
                        <div className="inline-flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-full border border-primary/20 mb-4 font-black text-[10px] uppercase tracking-widest text-primary">
                            Nossa História
                        </div>
                        <h1 className="text-4xl md:text-7xl font-black tracking-tighter dark:text-white leading-none">
                            Transformando sonhos em <br />
                            <span className="text-primary italic">impacto real.</span>
                        </h1>
                        <p className="text-lg md:text-xl text-slate-500 dark:text-slate-400 font-medium leading-relaxed max-w-2xl mx-auto">
                            A MyRifa nasceu para democratizar o acesso a ferramentas profissionais de arrecadação, unindo tecnologia de ponta com transparência total.
                        </p>
                    </section>

                    {/* Mission & Vision */}
                    <section className="grid md:grid-cols-2 gap-12">
                        <div className="p-10 bg-white dark:bg-slate-800/50 rounded-[2.5rem] border border-primary/5 space-y-6 shadow-sm">
                            <div className="size-16 bg-primary/10 text-primary rounded-2xl flex items-center justify-center">
                                <Flag className="h-8 w-8" />
                            </div>
                            <h3 className="text-2xl font-black dark:text-white">Nossa Missão</h3>
                            <p className="text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
                                Oferecer a plataforma mais segura, rápida e intuitiva para que qualquer pessoa ou instituição possa arrecadar fundos e realizar sorteios profissionais sem burocracia.
                            </p>
                        </div>
                        <div className="p-10 bg-white dark:bg-slate-800/50 rounded-[2.5rem] border border-primary/5 space-y-6 shadow-sm">
                            <div className="size-16 bg-purple-500/10 text-purple-500 rounded-2xl flex items-center justify-center">
                                <Heart className="h-8 w-8" />
                            </div>
                            <h3 className="text-2xl font-black dark:text-white">Nossos Valores</h3>
                            <p className="text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
                                Transparência absoluta, segurança criptográfica e compromisso com o sucesso do organizador. Acreditamos que a confiança é a base de toda grande campanha.
                            </p>
                        </div>
                    </section>

                    {/* Content Section */}
                    <section className="space-y-12">
                        <div className="text-center">
                            <h2 className="text-3xl font-black tracking-tight dark:text-white">Por que MyRifa?</h2>
                        </div>
                        <div className="space-y-8">
                            <div className="flex gap-6 items-start">
                                <div className="mt-1 size-6 shrink-0 bg-primary/20 text-primary rounded-full flex items-center justify-center">
                                    <CheckCircle2 className="h-4 w-4" />
                                </div>
                                <div className="space-y-2">
                                    <h4 className="font-black dark:text-white">Tecnologia Brasileira</h4>
                                    <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">Desenvolvido com carinho no Brasil, focado no sistema financeiro PIX e na agilidade que o mercado nacional exige.</p>
                                </div>
                            </div>
                            <div className="flex gap-6 items-start">
                                <div className="mt-1 size-6 shrink-0 bg-primary/20 text-primary rounded-full flex items-center justify-center">
                                    <CheckCircle2 className="h-4 w-4" />
                                </div>
                                <div className="space-y-2">
                                    <h4 className="font-black dark:text-white">Suporte Humanizado</h4>
                                    <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">Não somos apenas um software. Temos uma equipe pronta para ajudar a tornar sua campanha um sucesso.</p>
                                </div>
                            </div>
                            <div className="flex gap-6 items-start">
                                <div className="mt-1 size-6 shrink-0 bg-primary/20 text-primary rounded-full flex items-center justify-center">
                                    <CheckCircle2 className="h-4 w-4" />
                                </div>
                                <div className="space-y-2">
                                    <h4 className="font-black dark:text-white">Foco em Resultados</h4>
                                    <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">Nossa interface é otimizada para conversão, garantindo que você venda mais números em menos tempo.</p>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Final CTA */}
                    <section className="text-center bg-primary rounded-[3rem] p-12 md:p-20 text-white space-y-8 shadow-2xl shadow-primary/20 relative overflow-hidden">
                        <div className="relative z-10 space-y-6">
                            <h2 className="text-3xl md:text-5xl font-black tracking-tight leading-none">Faça parte desta jornada.</h2>
                            <p className="max-w-xl mx-auto text-white/70 font-medium">Junte-se a milhares de pessoas que já mudaram suas vidas e comunidades através da MyRifa.</p>
                            <Button asChild size="lg" className="bg-white text-primary hover:bg-slate-50 h-14 px-10 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl transition-all active:scale-95">
                                <Link href="/register">Criar minha primeira conta</Link>
                            </Button>
                        </div>
                        <Trophy className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-96 text-white/5 pointer-events-none" />
                    </section>
                </div>
            </main>

            {/* Simple Footer */}
            <footer className="py-12 border-t border-primary/5 text-center px-6">
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                    © 2024 MyRifa • Democratizando Sorteios no Brasil
                </p>
            </footer>
        </div>
    )
}
