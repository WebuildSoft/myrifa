"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
    HelpCircle,
    MessageCircle,
    Smartphone,
    ShieldCheck,
    User,
    Wallet,
    Search,
    ChevronDown,
    ArrowLeft,
    Handshake,
    Globe2,
    Scale
} from "lucide-react"
import { useState } from "react"

export default function AjudaPage() {
    return (
        <div className="min-h-screen bg-[#fcfcfd] dark:bg-[#0f0a19] text-slate-900 dark:text-slate-100 font-sans">
            {/* Nav */}
            <nav className="fixed top-0 w-full z-50 bg-white/70 dark:bg-[#0f0a19]/70 backdrop-blur-xl border-b border-primary/5 px-6 md:px-12 py-4">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-2 group">
                        <Button variant="ghost" size="icon" className="rounded-full mr-2">
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                        <span className="text-xl font-black tracking-tighter uppercase italic">
                            My<span className="text-primary">Rifa</span>
                        </span>
                    </Link>
                    <Button variant="outline" className="border-primary/20 text-primary hover:bg-primary/5 rounded-full text-[10px] font-black uppercase tracking-widest px-6" asChild>
                        <a href="https://wa.me/5500000000000" target="_blank" className="flex items-center gap-2">
                            <MessageCircle className="size-4" /> Suporte
                        </a>
                    </Button>
                </div>
            </nav>

            <main className="pt-32 pb-24">
                {/* Search Hero */}
                <section className="px-6 mb-20">
                    <div className="max-w-3xl mx-auto text-center space-y-8">
                        <div className="inline-flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-full border border-primary/20 text-primary mx-auto">
                            <Scale className="h-4 w-4" />
                            <span className="text-[10px] font-black uppercase tracking-widest">Tecnologia e Compliance</span>
                        </div>
                        <h1 className="text-4xl md:text-6xl font-black tracking-tighter dark:text-white leading-none italic">
                            Como podemos <span className="text-primary">ajudar?</span>
                        </h1>
                        <div className="relative group max-w-xl mx-auto">
                            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 h-5 w-5 group-focus-within:text-primary transition-colors" />
                            <input
                                className="w-full pl-14 pr-8 py-6 bg-white dark:bg-slate-800/50 border border-primary/5 rounded-[2rem] shadow-xl shadow-primary/5 focus:ring-4 focus:ring-primary/10 transition-all outline-none font-medium placeholder:text-slate-400"
                                placeholder="Dúvidas sobre sua campanha..."
                                type="text"
                            />
                        </div>
                    </div>
                </section>

                <div className="max-w-5xl mx-auto px-6 space-y-24">
                    {/* Quick Links Grid */}
                    <div className="grid md:grid-cols-3 gap-6">
                        <HelpCard icon={<User />} title="Para Organizadores" description="Configuração de campanhas, gestão de cotas e arrecadação." />
                        <HelpCard icon={<Wallet />} title="Para Apoiadores" description="Como adquirir cotas, confirmar apoio e acompanhar resultados." />
                        <HelpCard icon={<ShieldCheck />} title="SaaS & Tecnologia" description="Informações sobre a infraestrutura tecnológica e nossa isenção legal." />
                    </div>

                    {/* FAQ Section */}
                    <section className="space-y-12">
                        <div className="text-center">
                            <h2 className="text-3xl font-black tracking-tight dark:text-white">Dúvidas Frequentes</h2>
                            <p className="text-slate-500 font-medium">Esclarecimentos sobre o uso da plataforma de arrecadação.</p>
                        </div>

                        <div className="max-w-3xl mx-auto space-y-4">
                            <FAQItem
                                question="Como eu gerencio os fundos das minhas arrecadações?"
                                answer="A MyRifa fornece a infraestrutura de controle. Os valores são transacionados diretamente através de sua conta configurada, garantindo agilidade no acesso aos recursos para sua causa ou projeto."
                            />
                            <FAQItem
                                question="A plataforma cobra taxas por cota de apoio?"
                                answer="Como um modelo SaaS, oferecemos o licenciamento da tecnologia. As taxas variam conforme o plano escolhido e referem-se estritamente ao fornecimento da infraestrutura digital e suporte."
                            />
                            <FAQItem
                                question="Como funciona o sistema de auditoria de resultados?"
                                answer="Utilizamos um algoritmo de segurança para garantir que a distribuição de reconhecimentos ou brinde ocorra de forma transparente e imutável, permitindo consulta pública por todos os apoiadores."
                            />
                            <FAQItem
                                question="Qual o papel legal da MyRifa nas campanhas?"
                                answer="A MyRifa atua exclusivamente como fornecedora de tecnologia (SaaS). A responsabilidade legal, tributária e a entrega de quaisquer premiações prometidas em ações específicas é integral e exclusiva do Organizador da campanha."
                            />
                        </div>
                    </section>

                    {/* Contact CTA */}
                    <section className="bg-slate-900 rounded-[3rem] p-12 md:p-16 text-center text-white space-y-8 relative overflow-hidden text-balance">
                        <div className="relative z-10 space-y-6">
                            <div className="size-16 bg-primary/20 text-primary rounded-2xl flex items-center justify-center mx-auto mb-4 border border-primary/20">
                                <MessageCircle className="h-8 w-8" />
                            </div>
                            <h2 className="text-3xl font-black tracking-tight leading-none">Precisa de consultoria técnica?</h2>
                            <p className="max-w-md mx-auto text-slate-400 font-medium tracking-tight">Nosso time está disponível para auxiliar na configuração tecnológica da sua campanha social.</p>
                            <Button className="bg-emerald-500 hover:bg-emerald-600 text-white h-14 px-10 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-emerald-500/10 transition-all active:scale-95" asChild>
                                <a href="https://wa.me/5500000000000" target="_blank">Falar com Consultor de Arrecadação</a>
                            </Button>
                        </div>
                    </section>
                </div>
            </main>

            <footer className="py-12 border-t border-primary/5 text-center">
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                    © 2026 MyRifa Technology • Infraestrutura SaaS para Causas
                </p>
            </footer>
        </div>
    )
}

function HelpCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
    return (
        <div className="p-8 bg-white dark:bg-slate-800/40 rounded-[2rem] border border-primary/5 hover:border-primary/20 hover:shadow-xl transition-all cursor-pointer group">
            <div className="size-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                {icon}
            </div>
            <h4 className="text-lg font-black mb-2 dark:text-white uppercase tracking-tighter">{title}</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-medium">{description}</p>
        </div>
    )
}

function FAQItem({ question, answer }: { question: string, answer: string }) {
    const [isOpen, setIsOpen] = useState(false)

    return (
        <div className="bg-white dark:bg-slate-800/40 border border-primary/5 rounded-[1.5rem] overflow-hidden transition-all hover:border-primary/10">
            <button
                className="w-full p-6 flex items-center justify-between text-left group"
                onClick={() => setIsOpen(!isOpen)}
            >
                <span className="font-black text-sm md:text-base dark:text-white tracking-tight leading-snug">{question}</span>
                <ChevronDown className={`h-5 w-5 text-slate-400 transition-transform duration-300 ${isOpen ? 'rotate-180 text-primary' : 'group-hover:text-primary'}`} />
            </button>
            {isOpen && (
                <div className="px-6 pb-6 animate-in slide-in-from-top-2 duration-300">
                    <p className="text-sm text-slate-500 dark:text-slate-400 font-medium leading-relaxed border-t border-primary/5 pt-4">
                        {answer}
                    </p>
                </div>
            )}
        </div>
    )
}
