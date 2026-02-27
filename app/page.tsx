import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
    Zap,
    ShieldCheck,
    Smartphone,
    ArrowRight,
    Star,
    Users,
    Trophy,
    CheckCircle2,
    Instagram,
    Twitter,
    Facebook,
    HelpingHand,
    HeartHandshake,
    Globe2,
    PieChart
} from "lucide-react"
import { PricingSection } from "@/components/PricingSection"

export default function Home() {
    return (
        <div className="min-h-screen bg-[#fcfcfd] dark:bg-[#0f0a19] text-slate-900 dark:text-slate-100 font-sans selection:bg-primary/30">
            {/* Navigation */}
            <nav className="fixed top-0 w-full z-50 bg-white/70 dark:bg-[#0f0a19]/70 backdrop-blur-xl border-b border-primary/5 px-6 md:px-12 py-4">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-2 group">
                        <div className="size-10 bg-gradient-to-br from-primary to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-primary/20 group-hover:rotate-6 transition-transform">
                            <Star className="text-white h-6 w-6 fill-white" />
                        </div>
                        <span className="text-xl font-black tracking-tighter uppercase italic">
                            My<span className="text-primary">Rifa</span>
                        </span>
                    </Link>

                    <div className="hidden md:flex items-center gap-8 text-[11px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400">
                        <Link href="/sobre" className="hover:text-primary transition-colors">A Plataforma</Link>
                        <Link href="/rifas" className="hover:text-primary transition-colors">Campanhas</Link>
                        <Link href="/planos" className="hover:text-primary transition-colors">Soluções</Link>
                        <Link href="/ajuda" className="hover:text-primary transition-colors">Suporte</Link>
                    </div>

                    <div className="flex items-center gap-3">
                        <Button variant="ghost" asChild className="hidden sm:flex text-[11px] font-black uppercase tracking-widest rounded-full">
                            <Link href="/login">Entrar</Link>
                        </Button>
                        <Button asChild className="bg-primary hover:bg-primary/90 text-white shadow-xl shadow-primary/20 px-6 rounded-full text-[11px] font-black uppercase tracking-widest active:scale-95 transition-all">
                            <Link href="/register">Lançar Campanha</Link>
                        </Button>
                    </div>
                </div>
            </nav>

            <main>
                {/* Hero Section */}
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

                {/* Features Grid */}
                <section className="py-24 px-6 bg-white dark:bg-[#0f0a19]">
                    <div className="max-w-7xl mx-auto">
                        <div className="text-center mb-16 space-y-4">
                            <h2 className="text-3xl md:text-5xl font-black tracking-tight dark:text-white">Gerenciamento inteligente de fundos.</h2>
                            <p className="text-slate-500 dark:text-slate-400 font-medium max-w-xl mx-auto">Oferecemos a infraestrutura necessária para que igrejas, ONGs e projetos sociais foquem no que importa.</p>
                        </div>

                        <div className="grid md:grid-cols-3 gap-8">
                            <FeatureCard
                                icon={<Zap />}
                                title="Baixa Automática"
                                description="Integração via PIX para reconhecimento instantâneo de contribuições e liberação de cotas de apoio."
                                color="text-amber-500"
                                bg="bg-amber-500/10"
                            />
                            <FeatureCard
                                icon={<Globe2 />}
                                title="Campanhas Globais"
                                description="Alcance apoiadores em qualquer lugar através de links otimizados para redes sociais."
                                color="text-primary"
                                bg="bg-primary/10"
                            />
                            <FeatureCard
                                icon={<PieChart />}
                                title="Dashboard de Gestão"
                                description="Controle total sobre o progresso da arrecadação, dados de apoiadores e métricas de conversão."
                                color="text-emerald-500"
                                bg="bg-emerald-500/10"
                            />
                        </div>
                    </div>
                </section>

                {/* Pricing Section */}
                <PricingSection />

                {/* CTA Section */}
                <section className="py-24 px-6">
                    <div className="max-w-7xl mx-auto bg-gradient-to-br from-primary to-purple-800 rounded-[3rem] p-12 md:p-24 text-center text-white relative overflow-hidden shadow-2xl shadow-primary/20">
                        <div className="relative z-10 space-y-8">
                            <h2 className="text-4xl md:text-6xl font-black tracking-tight leading-none">Pronto para acelerar seu projeto?</h2>
                            <p className="max-w-xl mx-auto text-white/70 font-medium text-lg md:text-xl leading-relaxed">Milhares de organizadores já utilizam a tecnologia MyRifa para viabilizar causas e sonhos comunitários.</p>
                            <Button asChild size="lg" className="bg-white text-primary hover:bg-slate-100 h-16 px-12 rounded-2xl text-sm font-black uppercase tracking-widest shadow-xl active:scale-95 transition-all">
                                <Link href="/register">Lançar meu projeto agora</Link>
                            </Button>
                        </div>

                        {/* Decorative elements */}
                        <div className="absolute top-0 right-0 p-12 opacity-10">
                            <Trophy className="size-64 rotate-12" />
                        </div>
                        <div className="absolute top-1/2 left-0 -translate-y-1/2 p-12 opacity-10">
                            <CheckCircle2 className="size-48 -rotate-12" />
                        </div>
                    </div>
                </section>
            </main>

            {/* Footer */}
            <footer className="bg-slate-50 dark:bg-slate-900 border-t border-primary/5 pt-20 pb-12 px-6">
                <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 mb-20">
                    <div className="md:col-span-2 space-y-6">
                        <Link href="/" className="flex items-center gap-2">
                            <div className="size-8 bg-primary rounded-lg flex items-center justify-center text-white shadow-md">
                                <Star className="h-5 w-5 fill-white" />
                            </div>
                            <span className="text-lg font-black tracking-tighter uppercase italic dark:text-white">
                                My<span className="text-primary">Rifa</span>
                            </span>
                        </Link>
                        <p className="max-w-sm text-slate-500 dark:text-slate-400 text-sm font-medium leading-relaxed">
                            Infraestrutura SaaS para campanhas digitais e arrecadação online. Tecnologia a serviço de causas e do empreendedorismo social.
                        </p>
                        <div className="flex gap-4">
                            <SocialButton icon={<Instagram />} />
                            <SocialButton icon={<Twitter />} />
                            <SocialButton icon={<Facebook />} />
                        </div>
                    </div>

                    <div className="space-y-6">
                        <h4 className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-900 dark:text-white">Plataforma</h4>
                        <ul className="space-y-4 text-sm text-slate-500 dark:text-slate-400 font-medium tracking-tight">
                            <li><Link href="/rifas" className="hover:text-primary transition-colors">Campanhas Ativas</Link></li>
                            <li><Link href="/ganhadores" className="hover:text-primary transition-colors">Realizações</Link></li>
                            <li><Link href="/minhas-cotas" className="hover:text-primary transition-colors">Meus Apoios</Link></li>
                            <li><Link href="/register" className="hover:text-primary transition-colors">Nova Campanha</Link></li>
                        </ul>
                    </div>

                    <div className="space-y-6">
                        <h4 className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-900 dark:text-white">Legal e Suporte</h4>
                        <ul className="space-y-4 text-sm text-slate-500 dark:text-slate-400 font-medium tracking-tight">
                            <li><Link href="/ajuda" className="hover:text-primary transition-colors">Central de Ajuda</Link></li>
                            <li><Link href="/contato" className="hover:text-primary transition-colors">Atendimento</Link></li>
                            <li><Link href="/termos" className="hover:text-primary transition-colors">Termos de Uso</Link></li>
                            <li className="flex items-center gap-2 text-primary font-black pt-2">
                                <HelpingHand className="h-4 w-4" />
                                <span>Suporte em 1º Nível</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto pt-8 border-t border-primary/5 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] font-black uppercase tracking-widest text-slate-400">
                    <p>© 2024 MyRifa Technology. Todos os Direitos Reservados.</p>
                    <div className="flex gap-6">
                        <span className="flex items-center gap-1.5"><ShieldCheck className="h-3 w-3" /> Conexão Segura</span>
                        <span className="flex items-center gap-1.5"><CheckCircle2 className="h-3 w-3" /> Auditoria SaaS</span>
                    </div>
                </div>
            </footer>
        </div>
    )
}

function FeatureCard({ icon, title, description, color, bg }: { icon: React.ReactNode, title: string, description: string, color: string, bg: string }) {
    return (
        <div className="group p-10 bg-[#fcfcfd] dark:bg-slate-800/50 rounded-[2.5rem] border border-primary/5 hover:border-primary/20 hover:shadow-2xl hover:shadow-primary/5 transition-all">
            <div className={`size-16 ${bg} ${color} rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 group-hover:rotate-3 transition-transform`}>
                {icon}
            </div>
            <h3 className="text-xl font-black mb-4 dark:text-white">{title}</h3>
            <p className="text-slate-500 dark:text-slate-400 text-sm font-medium leading-relaxed">{description}</p>
        </div>
    )
}

function SocialButton({ icon }: { icon: React.ReactNode }) {
    return (
        <button className="size-10 rounded-xl bg-white dark:bg-slate-800 border border-primary/5 flex items-center justify-center text-slate-400 hover:text-primary hover:border-primary/30 hover:scale-110 active:scale-90 transition-all">
            {icon}
        </button>
    )
}
