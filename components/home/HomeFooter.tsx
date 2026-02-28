import Link from "next/link"
import { Star, Instagram, Twitter, Facebook, HelpingHand, ShieldCheck, CheckCircle2 } from "lucide-react"

export function HomeFooter() {
    return (
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
    )
}

function SocialButton({ icon }: { icon: React.ReactNode }) {
    return (
        <button className="size-10 rounded-xl bg-white dark:bg-slate-800 border border-primary/5 flex items-center justify-center text-slate-400 hover:text-primary hover:border-primary/30 hover:scale-110 active:scale-90 transition-all">
            {icon}
        </button>
    )
}
