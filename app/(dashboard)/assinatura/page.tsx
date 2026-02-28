import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
    Check,
    Zap,
    ShieldCheck,
    Crown,
    HelpCircle,
    ArrowRight,
    Star,
    Layers,
    BadgePercent
} from "lucide-react"

import { PricingSection } from "@/components/PricingSection"

export default async function PlanosPage() {
    const session = await auth()
    if (!session?.user?.id) redirect("/login")

    const user = await prisma.user.findUnique({
        where: { id: session.user.id }
    })

    return (
        <div className="min-h-screen bg-[#f7f6f8] dark:bg-[#171121] text-slate-900 dark:text-slate-100 pb-24 -m-4 md:-m-8">
            {/* Conteúdo Principal */}
            <main className="p-0">
                <PricingSection
                    currentPlan={user?.plan || "FREE"}
                    title="Seu Nível de Organizador"
                    subtitle="Faça o upgrade para reduzir suas taxas e liberar recursos exclusivos de personalização."
                />

                {/* Features Comparison Highlight */}
                <section className="max-w-4xl mx-auto bg-gradient-to-br from-primary/5 to-purple-500/5 dark:from-primary/10 dark:to-purple-500/10 p-10 rounded-[3rem] border border-primary/10 space-y-8 mb-12">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                        <div className="space-y-2 text-center md:text-left">
                            <h4 className="text-2xl font-black text-slate-900 dark:text-white leading-tight">Dúvidas sobre os planos?</h4>
                            <p className="text-sm text-slate-500 dark:text-slate-400 font-medium max-w-sm">
                                Nossa equipe de consultores está pronta para ajudar você a escolher a melhor opção para a sua organização.
                            </p>
                        </div>
                        <Button variant="ghost" className="h-14 px-8 rounded-2xl font-black text-xs uppercase tracking-widest text-primary hover:bg-primary/10 group">
                            Central de Ajuda
                            <HelpCircle className="ml-2 h-5 w-5 group-hover:rotate-12 transition-transform" />
                        </Button>
                    </div>

                    <div className="grid md:grid-cols-3 gap-6 pt-6 border-t border-primary/10">
                        <div className="flex gap-4 items-start">
                            <div className="size-10 rounded-2xl bg-white dark:bg-slate-800 flex items-center justify-center text-primary shadow-sm shrink-0">
                                <BadgePercent className="h-5 w-5" />
                            </div>
                            <div className="space-y-1">
                                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Taxas</p>
                                <p className="text-xs font-bold leading-tight text-slate-600 dark:text-slate-300">As menores taxas do mercado para sua escala.</p>
                            </div>
                        </div>
                        <div className="flex gap-4 items-start">
                            <div className="size-10 rounded-2xl bg-white dark:bg-slate-800 flex items-center justify-center text-primary shadow-sm shrink-0">
                                <Zap className="h-5 w-5" />
                            </div>
                            <div className="space-y-1">
                                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Velocidade</p>
                                <p className="text-xs font-bold leading-tight text-slate-600 dark:text-slate-300">Confirmação automática via PIX em segundos.</p>
                            </div>
                        </div>
                        <div className="flex gap-4 items-start">
                            <div className="size-10 rounded-2xl bg-white dark:bg-slate-800 flex items-center justify-center text-primary shadow-sm shrink-0">
                                <Crown className="h-5 w-5" />
                            </div>
                            <div className="space-y-1">
                                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Elite</p>
                                <p className="text-xs font-bold leading-tight text-slate-600 dark:text-slate-300">Personalização avançada para sua marca.</p>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    )
}
