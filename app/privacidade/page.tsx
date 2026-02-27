import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft, ShieldCheck, Lock, EyeOff } from "lucide-react"

export default function PrivacidadePage() {
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
                        <div className="inline-flex items-center gap-2 bg-emerald-500/10 px-4 py-2 rounded-full border border-emerald-500/20 text-emerald-600 dark:text-emerald-400">
                            <ShieldCheck className="h-4 w-4" />
                            <span className="text-[10px] font-black uppercase tracking-widest">LGPD & Segurança</span>
                        </div>
                        <h1 className="text-4xl font-black tracking-tight">Política de Privacidade</h1>
                        <p className="text-slate-500 font-medium">Última atualização: 26 de Fevereiro de 2026</p>
                    </div>

                    <div className="prose prose-slate dark:prose-invert max-w-none space-y-10 text-slate-600 dark:text-slate-400 font-medium leading-relaxed">
                        <section className="space-y-4">
                            <h2 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-3">
                                <div className="size-2 bg-emerald-500 rounded-full"></div>
                                1. Coleta de Informações
                            </h2>
                            <p>
                                Como plataforma de SaaS (Software as a Service) para arrecadação digital, coletamos apenas os dados essenciais para a operacionalização de campanhas, como nome, e-mail e telefone, visando garantir a autenticidade dos apoios e a comunicação entre organizadores e apoiadores.
                            </p>
                        </section>

                        <section className="space-y-4">
                            <h2 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-3">
                                <div className="size-2 bg-emerald-500 rounded-full"></div>
                                2. Finalidade do Tratamento
                            </h2>
                            <p>
                                Seus dados são utilizados estritamente para: (i) Gestão técnica das campanhas de arrecadação; (ii) Prevenção a fraudes e atividades ilícitas; (iii) Emissão de comprovantes de apoio; e (iv) Cumprimento de obrigações legais de auditoria.
                            </p>
                        </section>

                        <section className="space-y-4">
                            <h2 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-3">
                                <div className="size-2 bg-emerald-500 rounded-full"></div>
                                3. Compartilhamento de Dados
                            </h2>
                            <p>
                                A MyRifa não comercializa dados pessoais. O compartilhamento ocorre apenas com processadores de pagamento (ex: Mercado Pago) e, quando necessário, com autoridades judiciais mediante ordem específica, sempre sob os protocolos da Lei Geral de Proteção de Dados (LGPD).
                            </p>
                        </section>

                        <div className="p-8 bg-emerald-500/5 rounded-3xl border border-emerald-500/10 flex gap-6 items-start">
                            <EyeOff className="h-8 w-8 text-emerald-500 shrink-0" />
                            <div className="space-y-2">
                                <h4 className="font-black text-emerald-600 dark:text-emerald-400 text-sm uppercase tracking-wider">Anonimidade em Pagamentos</h4>
                                <p className="text-xs">Não armazenamos dados sensíveis de cartões ou contas bancárias. Toda a camada financeira é delegada a parceiros certificados com padrão PCI-DSS.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <footer className="py-12 border-t border-primary/5 text-center text-[10px] font-black uppercase tracking-widest text-slate-400">
                © 2026 MyRifa Technology • Seus dados estão protegidos por criptografia de ponta
            </footer>
        </div>
    )
}
