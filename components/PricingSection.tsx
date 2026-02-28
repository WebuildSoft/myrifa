"use client"

import { Button } from "@/components/ui/button"
import {
    Check,
    Crown,
    Layers,
    ShieldCheck,
    ArrowRight,
    Star
} from "lucide-react"
import Link from "next/link"

const plans = [
    {
        name: "FREE",
        price: "R$ 0",
        description: "Ideal para iniciantes que querem testar o potencial das campanhas digitais.",
        features: [
            "Até 3 campanhas ativas",
            "Taxa de 5% por apoio",
            "Até 500 cotas de apoio",
            "Suporte via e-mail",
        ],
        buttonText: "Começar Grátis",
        href: "/register",
        variant: "outline" as const,
        icon: <Layers className="h-5 w-5 text-slate-400" />,
        color: "slate"
    },
    {
        name: "PRO",
        price: "R$ 49,90",
        period: "/mês",
        description: "Para organizadores profissionais que buscam escala e taxas reduzidas.",
        features: [
            "Campanhas ativas ilimitadas",
            "Taxa reduzida de 2%",
            "Imagens personalizadas premium",
            "Visual de cotas exclusivos",
            "Suporte VIP via WhatsApp",
        ],
        buttonText: "Assinar PRO",
        href: "/register",
        variant: "default" as const,
        highlight: true,
        icon: <Crown className="h-5 w-5 text-white" />,
        color: "primary"
    },
    {
        name: "INSTITUTIONAL",
        price: "R$ 149,90",
        period: "/mês",
        description: "Estrutura completa para ONGs, Igrejas e grandes organizações sociais.",
        features: [
            "Tudo do plano PRO",
            "Menor taxa: apenas 1%",
            "Dashboard multi-org",
            "Auditoria de campanhas",
            "Gerente de conta exclusivo",
        ],
        buttonText: "Falar com Consultor",
        href: "/ajuda",
        variant: "outline" as const,
        icon: <ShieldCheck className="h-5 w-5 text-slate-400" />,
        color: "slate"
    },
]

function FeatureItem({ feature, highlight }: { feature: string, highlight?: boolean }) {
    return (
        <li className="flex items-start gap-3">
            <div className={`mt-1 size-5 rounded-full flex items-center justify-center shrink-0 ${highlight ? "bg-primary/20 text-primary" : "bg-slate-50 dark:bg-slate-900 text-slate-400"
                }`}>
                <Check className="h-3 w-3" />
            </div>
            <span className="text-xs font-bold text-slate-600 dark:text-slate-300 leading-tight">{feature}</span>
        </li>
    )
}

function PricingCard({ plan }: { plan: typeof plans[0] }) {
    return (
        <div
            className={`relative group bg-white dark:bg-slate-800 rounded-[3rem] p-8 border transition-all duration-300 ${plan.highlight
                ? "border-primary shadow-2xl shadow-primary/20 scale-105 z-10"
                : "border-slate-100 dark:border-slate-700 hover:border-primary/30"
                }`}
        >
            {plan.highlight && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-white text-[10px] font-black px-6 py-2 rounded-full uppercase tracking-widest shadow-xl">
                    Mais Popular
                </div>
            )}

            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div className={`size-12 rounded-2xl flex items-center justify-center ${plan.highlight ? "bg-primary text-white shadow-lg shadow-primary/30" : "bg-slate-50 dark:bg-slate-900 text-slate-400"
                        }`}>
                        {plan.icon}
                    </div>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{plan.name}</span>
                </div>

                <div>
                    <h3 className="text-2xl font-black text-slate-900 dark:text-white">{plan.name}</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-1 leading-relaxed min-h-[40px]">
                        {plan.description}
                    </p>
                </div>

                <div className="py-4 border-y border-slate-50 dark:border-slate-700">
                    <div className="flex items-baseline gap-1">
                        <span className="text-4xl font-black text-slate-900 dark:text-white">{plan.price}</span>
                        {plan.period && <span className="text-slate-400 font-bold">{plan.period}</span>}
                    </div>
                </div>

                <ul className="space-y-4 min-h-[220px]">
                    {plan.features.map((feature) => (
                        <FeatureItem key={feature} feature={feature} highlight={plan.highlight} />
                    ))}
                </ul>

                <Button
                    asChild
                    className={`w-full h-14 rounded-2xl font-black text-xs uppercase tracking-[0.2em] transition-all active:scale-95 ${plan.highlight
                        ? "bg-primary hover:bg-primary/90 text-white shadow-xl shadow-primary/20"
                        : "bg-slate-50 dark:bg-slate-900 hover:bg-primary/5 hover:text-primary text-slate-600 dark:text-slate-300 border-none"
                        }`}
                >
                    <Link href={plan.href}>
                        {plan.buttonText}
                        {plan.highlight && <ArrowRight className="ml-2 h-4 w-4" />}
                    </Link>
                </Button>
            </div>
        </div>
    )
}

interface PricingSectionProps {
    title?: string
    subtitle?: string
    showTitle?: boolean
}

export function PricingSection({
    title = "Soluções de Arrecadação Transparentes",
    subtitle = "Escolha o modelo que melhor se adapta ao momento da sua instituição e impulsione seu impacto.",
    showTitle = true
}: PricingSectionProps) {
    return (
        <section className="py-24 px-6 bg-[#fcfcfd] dark:bg-[#0f0a19]">
            <div className="max-w-7xl mx-auto">
                {showTitle && (
                    <div className="text-center mb-16 space-y-4">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20 text-[10px] font-black uppercase tracking-widest mb-2">
                            <Star className="h-3 w-3 fill-primary" />
                            Tecnologia de Alto Impacto
                        </div>
                        <h2 className="text-3xl md:text-5xl font-black tracking-tight dark:text-white leading-tight">
                            {title}
                        </h2>
                        <p className="text-slate-500 dark:text-slate-400 font-medium max-w-xl mx-auto">
                            {subtitle}
                        </p>
                    </div>
                )}

                <div className="grid gap-8 md:grid-cols-3">
                    {plans.map((plan) => (
                        <PricingCard key={plan.name} plan={plan} />
                    ))}
                </div>
            </div>
        </section>
    )
}
