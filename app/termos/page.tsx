import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft, ShieldCheck, FileText, Lock, Scale, AlertTriangle } from "lucide-react"

export default function TermosPage() {
    return (
        <div className="min-h-screen bg-[#fcfcfd] dark:bg-[#0f0a19] text-slate-900 dark:text-slate-100 font-sans">
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
                </div>
            </nav>

            <main className="pt-32 pb-20 px-6">
                <div className="max-w-3xl mx-auto space-y-12">
                    <div className="space-y-4">
                        <div className="inline-flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-full border border-primary/20 text-primary">
                            <Scale className="h-4 w-4" />
                            <span className="text-[10px] font-black uppercase tracking-widest">Compliance & Segurança</span>
                        </div>
                        <h1 className="text-4xl font-black tracking-tight">Termos de Uso e Licenciamento</h1>
                        <p className="text-slate-500 font-medium">Última atualização: 26 de Fevereiro de 2026</p>
                    </div>

                    <div className="prose prose-slate dark:prose-invert max-w-none space-y-10 text-slate-600 dark:text-slate-400 font-medium leading-relaxed">

                        <div className="p-8 bg-amber-50 dark:bg-amber-900/10 rounded-3xl border border-amber-200 dark:border-amber-800/30 flex gap-6 items-start">
                            <AlertTriangle className="h-8 w-8 text-amber-600 shrink-0" />
                            <div className="space-y-2">
                                <h4 className="font-black text-amber-700 dark:text-amber-400 text-sm uppercase tracking-wider">Aviso de Natureza Tecnológica</h4>
                                <p className="text-xs">A MyRifa é uma plataforma de **Software as a Service (SaaS)**. Não somos organizadores, promotores ou garantidores de qualquer campanha, sorteio ou ação entre amigos criada por nossos usuários.</p>
                            </div>
                        </div>

                        <section className="space-y-4">
                            <h2 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-3">
                                <div className="size-2 bg-primary rounded-full"></div>
                                1. Objeto do Serviço
                            </h2>
                            <p>
                                A MyRifa licencia o uso de sua infraestrutura tecnológica para que usuários (organizadores) possam gerenciar suas campanhas de arrecadação digital e ações promocionais. A plataforma fornece as ferramentas para emissão de cotas, gestão de pagamentos e auditoria de resultados.
                            </p>
                        </section>

                        <section className="space-y-4">
                            <h2 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-3">
                                <div className="size-2 bg-primary rounded-full"></div>
                                2. Responsabilidade do Organizador
                            </h2>
                            <p>
                                O Organizador declara ser o único responsável pela legalidade de sua campanha perante a legislação brasileira (Lei 5.768/71 e demais regulamentações). Cabe ao Organizador garantir a entrega de brindes, a transparência do processo e o cumprimento de promessas feitas aos apoiadores.
                            </p>
                        </section>

                        <section className="space-y-4">
                            <h2 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-3">
                                <div className="size-2 bg-primary rounded-full"></div>
                                3. Isenção de Responsabilidade
                            </h2>
                            <p>
                                A MyRifa não se responsabiliza por: (i) falhas na entrega de premiações por parte dos organizadores; (ii) mau uso da plataforma para fins ilícitos; (iii) veracidade das causas descritas nas ações. Ao utilizar o sistema, o Apoiador reconhece que sua relação jurídica é direta com o Organizador da campanha.
                            </p>
                        </section>

                        <section className="space-y-4">
                            <h2 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-3">
                                <div className="size-2 bg-primary rounded-full"></div>
                                4. Taxas e Remuneração
                            </h2>
                            <p>
                                A plataforma cobra uma taxa de licenciamento por uso da tecnologia, que pode ser fixa por venda ou mensal, conforme o plano escolhido. Esta taxa refere-se estritamente ao fornecimento do software e suporte técnico.
                            </p>
                        </section>

                        <div className="p-8 bg-primary/5 rounded-3xl border border-primary/10 flex gap-6 items-start">
                            <ShieldCheck className="h-8 w-8 text-primary shrink-0" />
                            <div className="space-y-2">
                                <h4 className="font-black text-primary text-sm uppercase tracking-wider">Compromisso com a Ética</h4>
                                <p className="text-xs">Reservamo-nos o direito de suspender campanhas que violem nossos princípios éticos ou que apresentem indícios de fraude, sem aviso prévio, visando a segurança da comunidade.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <footer className="py-12 border-t border-primary/5 text-center text-[10px] font-black uppercase tracking-widest text-slate-400">
                © 2026 MyRifa Technology • Infraestrutura para Arrecadação Digital
            </footer>
        </div>
    )
}
