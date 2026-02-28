import Link from "next/link"
import { ArrowRight, HeartHandshake, Users, ShieldCheck } from "lucide-react"
import { Button } from "@/components/ui/button"

export function HomeHero() {
    return (
        <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 px-6 overflow-hidden">
            {/* Background Orbs */}
            <div className="absolute top-1/4 -left-20 w-[500px] h-[500px] bg-primary/20 blur-[120px] rounded-full -z-10 animate-pulse"></div>
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-purple-500/10 blur-[150px] rounded-full -z-10 animate-pulse delay-700"></div>

            <div className="max-w-5xl mx-auto text-center space-y-8 relative">
                <div className="inline-flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-full border border-primary/20 mb-4 animate-in fade-in slide-in-from-top-4 duration-700">
                    <HeartHandshake className="h-4 w-4 text-primary" />
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">Tecnologia para Causas e Instituições</span>
                </div>

                <h1 className="text-5xl md:text-8xl font-black tracking-tighter leading-[0.9] dark:text-white animate-in fade-in slide-in-from-bottom-8 duration-700">
                    Transforme sua Arrecadação <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-purple-500 to-indigo-500">Digital em Impacto Real.</span>
                </h1>

                <p className="max-w-2xl mx-auto text-lg md:text-xl text-slate-500 dark:text-slate-400 font-medium leading-relaxed animate-in fade-in duration-1000 delay-300">
                    A solução SaaS definitiva para gerenciar campanhas de apoio, ações entre amigos e captação de recursos com transparência e tecnologia.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8 animate-in fade-in duration-1000 delay-500">
                    <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-white h-16 px-10 rounded-2xl text-sm font-black uppercase tracking-widest shadow-2xl shadow-primary/30 group active:scale-95 transition-all">
                        <Link href="/register">
                            Começar minha Campanha
                            <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </Button>
                    <Button variant="outline" asChild size="lg" className="h-16 px-10 rounded-2xl text-sm font-black uppercase tracking-widest border-primary/10 dark:border-white/10 dark:text-white hover:bg-primary/5 active:scale-95 transition-all">
                        <Link href="/sobre">Conhecer a tecnologia</Link>
                    </Button>
                </div>

                {/* Trust Badge */}
                <div className="pt-12 flex items-center justify-center gap-6 opacity-40 grayscale group-hover:grayscale-0 transition-all">
                    <div className="flex items-center gap-2">
                        <Users className="h-5 w-5" />
                        <span className="text-xs font-bold">+50k Apoiadores</span>
                    </div>
                    <div className="w-px h-4 bg-slate-300 dark:bg-slate-700"></div>
                    <div className="flex items-center gap-2">
                        <ShieldCheck className="h-5 w-5" />
                        <span className="text-xs font-bold">Tecnologia Auditável</span>
                    </div>
                </div>
            </div>
        </section>
    )
}
