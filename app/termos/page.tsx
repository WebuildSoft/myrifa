import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft, ShieldCheck, FileText, Lock } from "lucide-react"

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
                            Rifa<span className="text-primary">Online</span>
                        </span>
                    </Link>
                </div>
            </nav>

            <main className="pt-32 pb-20 px-6">
                <div className="max-w-3xl mx-auto space-y-12">
                    <div className="space-y-4">
                        <div className="inline-flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-full border border-primary/20 text-primary">
                            <FileText className="h-4 w-4" />
                            <span className="text-[10px] font-black uppercase tracking-widest">Documentação Oficial</span>
                        </div>
                        <h1 className="text-4xl font-black tracking-tight">Termos de Uso</h1>
                        <p className="text-slate-500 font-medium">Última atualização: 26 de Fevereiro de 2024</p>
                    </div>

                    <div className="prose prose-slate dark:prose-invert max-w-none space-y-8 text-slate-600 dark:text-slate-400 font-medium leading-relaxed">
                        <section className="space-y-4">
                            <h2 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-3">
                                <div className="size-2 bg-primary rounded-full"></div>
                                1. Aceitação dos Termos
                            </h2>
                            <p>Ao acessar e clicar em "Criar Rifa" ou "Participar", você concorda integralmente com estes termos...</p>
                        </section>

                        <section className="space-y-4">
                            <h2 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-3">
                                <div className="size-2 bg-primary rounded-full"></div>
                                2. Responsabilidade do Organizador
                            </h2>
                            <p>O organizador é o único responsável pela entrega dos prêmios e pela veracidade das informações...</p>
                        </section>

                        <div className="p-8 bg-primary/5 rounded-3xl border border-primary/10 flex gap-6 items-start">
                            <ShieldCheck className="h-8 w-8 text-primary shrink-0" />
                            <div className="space-y-2">
                                <h4 className="font-black text-primary text-sm uppercase tracking-wider">Compromisso com a Lei</h4>
                                <p className="text-xs">Nossa plataforma opera como intermediadora tecnológica, exigindo que todos os sorteios sigam a legislação local vigente.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <footer className="py-12 border-t border-primary/5 text-center text-[10px] font-black uppercase tracking-widest text-slate-400">
                © 2024 RifaOnline • Transparência em Primeiro Lugar
            </footer>
        </div>
    )
}
