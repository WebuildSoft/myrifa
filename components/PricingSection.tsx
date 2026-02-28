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
import { useSession } from "next-auth/react"
import { toast } from "sonner"

const plans = [
    {
        name: "FREE",
        label: "START",
        price: "R$ 0",
        description: "Ideal para iniciantes que querem testar o potencial das campanhas digitais.",
        features: [
            "Até 3 campanhas ativas",
            "Taxa de Sistema: ~5% (Sorteio)",
            "Até 500 cotas de apoio",
            "Suporte via e-mail",
            "Dashboard Simplificado"
        ],
        buttonText: "Começar Grátis",
        href: "/register",
        variant: "outline" as const,
        icon: <Layers className="h-5 w-5 text-slate-400" />,
        color: "slate"
    },
    {
        name: "PRO",
        label: "GROWTH",
        price: "R$ 29,90",
        period: "/mês",
        description: "Para organizadores que buscam escala com taxas reduzidas e mais recursos.",
        features: [
            "Campanhas ativas ilimitadas",
            "Taxa de Sistema: ~2% (Sorteio)",
            "Imagens personalizadas premium",
            "Visual de cotas exclusivos",
            "Suporte VIP via WhatsApp",
        ],
        buttonText: "Assinar GROWTH",
        href: "https://buy.stripe.com/cNifZgcsR0o27GB6QJgQE02",
        variant: "default" as const,
        highlight: true,
        icon: <Crown className="h-5 w-5 text-white" />,
        color: "primary"
    },
    {
        name: "INSTITUTIONAL",
        label: "BUSINESS",
        price: "R$ 129,90",
        period: "/mês",
        description: "Estrutura completa para grandes organizações e campanhas de alto volume.",
        features: [
            "Tudo do plano PRO",
            "Taxa de Sistema: ~1% (Mínima)",
            "Dashboard multi-org",
            "Auditoria de campanhas",
            "Gerente de conta exclusivo",
        ],
        buttonText: "Assinar BUSINESS",
        href: "https://buy.stripe.com/bJe28q9gFeeS3ql5MFgQE03",
        variant: "outline" as const,
        icon: <ShieldCheck className="h-5 w-5 text-slate-400" />,
        color: "slate"
    },
]

interface PricingSectionProps {
    title?: React.ReactNode
    subtitle?: string
    showTitle?: boolean
    currentPlan?: string
}

export function PricingSection({
    title = (
        <>
            Escolha o plano ideal para sua <span className="text-primary italic">evolução</span>
        </>
    ),
    subtitle = "Comece grátis e escale conforme sua necessidade. Sem taxas ocultas.",
    showTitle = true,
    currentPlan
}: PricingSectionProps) {
    const { data: session, status } = useSession()

    const handleSubscribe = (href: string) => {
        console.log("handleSubscribe called with:", href)
        console.log("Session status:", status)
        console.log("User session:", session?.user)

        if (status === "loading") {
            toast.info("Aguardando carregar sua sessão...")
            return
        }

        if (!session?.user) {
            toast.error("Você precisa estar logado para assinar um plano.")
            setTimeout(() => {
                window.location.href = "/register"
            }, 1000)
            return
        }

        const user = session.user as any
        const userId = user.id || user.sub

        if (!userId) {
            console.error("User ID not found in session:", session)
            toast.error("Erro ao identificar seu usuário. Por favor, saia e entre novamente.")
            return
        }

        // Se for um link do Stripe, anexa o client_reference_id
        if (href.startsWith("https://buy.stripe.com")) {
            try {
                const stripeUrl = new URL(href)
                stripeUrl.searchParams.set("client_reference_id", userId)

                // Opcional: passar o e-mail também para facilitar
                if (user.email) {
                    stripeUrl.searchParams.set("prefilled_email", user.email)
                }

                console.log("Redirecting to Stripe:", stripeUrl.toString())
                window.location.href = stripeUrl.toString()
            } catch (err) {
                console.error("Error creating Stripe URL:", err)
                window.location.href = href // Fallback para o link original sem o ID se der erro no URL
            }
        } else {
            window.location.href = href
        }
    }

    return (
        <section id="planos" className="py-24 px-6 relative overflow-hidden bg-white dark:bg-slate-950">
            {/* Background Orbs */}
            <div className="absolute top-1/4 -left-20 w-[500px] h-[500px] bg-primary/5 blur-[120px] rounded-full -z-10"></div>
            <div className="absolute bottom-1/4 -right-20 w-[500px] h-[500px] bg-primary/5 blur-[120px] rounded-full -z-10"></div>

            <div className="max-w-7xl mx-auto relative z-10">
                {showTitle && (
                    <div className="text-center mb-16 space-y-4">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20 text-[10px] font-black uppercase tracking-widest mb-2">
                            <Star className="h-3 w-3 fill-primary" />
                            Transparência e Impacto
                        </div>
                        <h2 className="text-3xl md:text-5xl font-bold mb-4 tracking-tight dark:text-white">
                            {title}
                        </h2>
                        <p className="text-slate-500 dark:text-slate-400 max-w-2xl mx-auto text-lg">
                            {subtitle}
                        </p>
                    </div>
                )}

                <div className="grid md:grid-cols-3 gap-8">
                    {plans.map((plan) => (
                        <div
                            key={plan.name}
                            className={`relative p-8 rounded-[2.5rem] border transition-all duration-300 hover:scale-[1.02] flex flex-col ${plan.highlight
                                ? "border-primary shadow-2xl shadow-primary/10 bg-slate-50/50 dark:bg-primary/5 z-10 scale-105"
                                : "border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900/50"
                                }`}
                        >
                            {plan.highlight && (
                                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-white px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg">
                                    Mais Popular
                                </div>
                            )}

                            <div className="mb-8">
                                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-6 ${plan.color === "primary"
                                    ? "bg-primary text-white shadow-lg shadow-primary/30"
                                    : "bg-slate-100 dark:bg-slate-800 text-slate-500"
                                    }`}>
                                    {plan.icon}
                                </div>
                                <h3 className="text-xl font-black mb-2">{plan.label || plan.name}</h3>
                                <div className="flex items-baseline gap-1 mb-3">
                                    <span className="text-4xl font-black tracking-tight">{plan.price}</span>
                                    {plan.period && <span className="text-slate-500 text-sm font-bold">{plan.period}</span>}
                                </div>
                                <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed min-h-[40px]">
                                    {plan.description}
                                </p>
                            </div>

                            <div className="space-y-4 mb-8 flex-1">
                                {plan.features.map((feature) => (
                                    <div key={feature} className="flex items-start gap-3">
                                        <div className="mt-1 bg-emerald-500/10 p-0.5 rounded-full shrink-0">
                                            <Check className="h-4 w-4 text-emerald-500" />
                                        </div>
                                        <span className="text-xs font-bold text-slate-600 dark:text-slate-300 leading-tight">{feature}</span>
                                    </div>
                                ))}
                            </div>

                            <Button
                                className={`w-full h-14 rounded-2xl font-black text-xs uppercase tracking-[0.2em] transition-all active:scale-95 ${plan.highlight
                                    ? "bg-primary hover:bg-primary/90 text-white shadow-xl shadow-primary/20"
                                    : "bg-slate-100 dark:bg-slate-800 hover:bg-primary/5 hover:text-primary text-slate-600 dark:text-slate-300"
                                    }`}
                                variant={plan.variant}
                                onClick={() => handleSubscribe(plan.href)}
                                disabled={currentPlan === plan.name}
                            >
                                {currentPlan === plan.name ? "Plano Atual" : plan.buttonText}
                                {currentPlan !== plan.name && <ArrowRight className="ml-2 h-4 w-4" />}
                            </Button>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
