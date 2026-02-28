"use client"

import { TrendingUp, Lightbulb, Sparkles, Target, Rocket, CheckCircle2, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"

interface WizardSummaryProps {
    totalNumbers: number
    numberPrice: number
    currentStep: number
}

const STEP_TIPS = {
    1: {
        icon: <Target className="w-5 h-5 text-amber-500" />,
        title: "Foco no Desejo",
        content: "Títulos diretos e prêmios de alto valor percebido aumentam a conversão em até 40%. Foque no benefício principal!",
        strategies: [
            "Use verbos de ação no título (Ex: 'CONCORRA', 'GANHE')",
            "Destaque o valor do prêmio principal",
            "Crie uma descrição emocionante sobre o objetivo da campanha",
            "Adicione fotos reais e de alta qualidade dos prêmios"
        ]
    },
    2: {
        icon: <Sparkles className="w-5 h-5 text-violet-500" />,
        title: "Impacto Visual",
        content: "Cores vibrantes geram mais cliques em redes sociais. Escolha um tema que contraste bem com sua imagem de capa.",
        strategies: [
            "Use o tema Escuro para prêmios tecnológicos ou carros",
            "O tema Minimalista passa mais credibilidade para causas sociais",
            "Garanta que o texto nos banners esteja legível",
            "Combine a cor primária com a identidade visual da sua marca"
        ]
    },
    3: {
        icon: <Lightbulb className="w-5 h-5 text-blue-500" />,
        title: "Preço Estratégico",
        content: "Valores entre R$ 2,00 e R$ 10,00 estimulam a compra por impulso. Metas menores costumam fechar 2x mais rápido.",
        strategies: [
            "Use preços 'quebrados' como R$ 9,90 para percepção de desconto",
            "Ofereça pacotes de cotas (será configurado no próximo passo)",
            "Alinhe a data do sorteio com feriados ou datas comemorativas",
            "Comece com menos cotas para validar o interesse do público"
        ]
    },
    4: {
        icon: <Rocket className="w-5 h-5 text-emerald-500" />,
        title: "O Pulo do Gato",
        content: "As primeiras 2 horas definem o ritmo. Compartilhe no seu 'Close Friends' ou grupos VIP para gerar as primeiras vendas.",
        strategies: [
            "Faça um vídeo de abertura explicando as regras",
            "Mande o link primeiro para quem já é seu fã",
            "Use o gatilho de escassez ('Poucas cotas disponíveis')",
            "Reinvista parte da arrecadação inicial em tráfego pago"
        ]
    }
}

export function WizardSummary({ totalNumbers, numberPrice, currentStep }: WizardSummaryProps) {
    const totalRevenue = totalNumbers * numberPrice
    const platformFee = totalRevenue * 0.05
    const estimatedProfit = totalRevenue - platformFee

    const formatCurrency = (val: number) => {
        return val.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
    }

    const tip = STEP_TIPS[currentStep as keyof typeof STEP_TIPS] || STEP_TIPS[1]

    return (
        <div className="sticky top-8 space-y-6">
            {/* Meta Card - Only show in step 3 (Numbers & Price) */}
            {currentStep === 3 && (
                <div className="p-8 rounded-[2.5rem] bg-primary text-white shadow-2xl shadow-primary/30 relative overflow-hidden group animate-in zoom-in-95 duration-500">
                    <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform">
                        <TrendingUp className="h-24 w-24" />
                    </div>

                    <div className="relative z-10 space-y-6">
                        <div className="space-y-1">
                            <p className="text-primary-foreground/70 text-xs font-bold uppercase tracking-widest">Meta de Arrecadação</p>
                            <h3 className="text-4xl font-black tracking-tight">{formatCurrency(totalRevenue)}</h3>
                        </div>

                        <div className="space-y-3 bg-white/10 backdrop-blur-md p-5 rounded-3xl border border-white/10">
                            <div className="flex justify-between items-center text-sm font-medium">
                                <span className="opacity-70">Cotas</span>
                                <span>{totalNumbers}</span>
                            </div>
                            <div className="flex justify-between items-center text-sm font-medium">
                                <span className="opacity-70">Valor Unitário</span>
                                <span>{formatCurrency(numberPrice)}</span>
                            </div>
                            <div className="h-px bg-white/10 my-1"></div>
                            <div className="flex justify-between items-center text-sm font-bold">
                                <span className="opacity-70">Taxa Plataforma (5%)</span>
                                <span className="text-red-200">- {formatCurrency(platformFee)}</span>
                            </div>
                        </div>

                        <div className="pt-2">
                            <p className="text-primary-foreground/70 text-xs font-bold uppercase tracking-widest">Seu lucro estimado</p>
                            <p className="text-2xl font-black">{formatCurrency(estimatedProfit)}</p>
                        </div>
                    </div>
                </div>
            )}

            {/* Help Desk */}
            <div className="p-6 rounded-[2rem] bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-none space-y-5 relative overflow-hidden group">
                <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 group-hover:scale-110 transition-transform duration-300">
                        {tip.icon}
                    </div>
                    <div>
                        <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">Dica de Especialista</p>
                        <h4 className="font-bold text-slate-900 dark:text-white uppercase text-xs tracking-tight">{tip.title}</h4>
                    </div>
                </div>

                <div className="space-y-4">
                    <div className="p-4 rounded-2xl bg-slate-50/50 dark:bg-slate-800/50 border border-slate-100/50 dark:border-slate-700/50">
                        <p className="text-sm text-slate-600 dark:text-slate-400 font-medium leading-relaxed italic">
                            "{tip.content}"
                        </p>
                    </div>

                    <Dialog>
                        <DialogTrigger asChild>
                            <Button variant="outline" className="w-full rounded-xl h-12 font-bold text-xs uppercase tracking-wider border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all gap-2">
                                <Lightbulb className="w-4 h-4 text-amber-500" />
                                Ver Mais Estratégias
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-xl rounded-[2.5rem] p-0 overflow-hidden border-none">
                            <div className="bg-primary p-8 text-white relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-8 opacity-10">
                                    {tip.icon}
                                </div>
                                <div className="relative z-10 space-y-2">
                                    <p className="text-primary-foreground/70 text-xs font-bold uppercase tracking-widest">Estratégias de Sucesso</p>
                                    <DialogTitle className="text-3xl font-black">{tip.title}</DialogTitle>
                                </div>
                            </div>
                            <div className="p-8 space-y-6 bg-white dark:bg-slate-950">
                                <p className="text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                                    Nossos especialistas analisaram milhares de campanhas de sucesso e listaram as melhores práticas para você:
                                </p>
                                <div className="space-y-3">
                                    {tip.strategies.map((strategy, i) => (
                                        <div key={i} className="flex items-start gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 group hover:border-primary/30 transition-colors">
                                            <div className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0 mt-0.5">
                                                <CheckCircle2 className="w-4 h-4" />
                                            </div>
                                            <p className="text-sm font-bold text-slate-700 dark:text-slate-300 line-height-relaxed italic">
                                                {strategy}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                                <div className="pt-4 flex justify-end">
                                    <DialogTrigger asChild>
                                        <Button className="rounded-xl h-12 px-6 font-bold shadow-lg shadow-primary/20">
                                            Entendi, vamos lá!
                                            <ChevronRight className="w-4 h-4 ml-2" />
                                        </Button>
                                    </DialogTrigger>
                                </div>
                            </div>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>
        </div>
    )
}
