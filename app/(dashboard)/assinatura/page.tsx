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

const plans = [
    {
        name: "FREE",
        price: "R$ 0",
        description: "Ideal para iniciantes que querem testar o potencial das rifas.",
        features: [
            "Até 3 rifas ativas",
            "Taxa de 5% por venda",
            "Números ilimitados",
            "Suporte via e-mail",
        ],
        buttonText: "Plano Atual",
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
            "Rifas ativas ilimitadas",
            "Taxa reduzida de 2%",
            "Imagens personalizadas premium",
            "Visual de balões exclusivos",
            "Suporte VIP via WhatsApp",
        ],
        buttonText: "Fazer Upgrade",
        variant: "default" as const,
        highlight: true,
        icon: <Crown className="h-5 w-5 text-white" />,
        color: "primary"
    },
    {
        name: "INSTITUTIONAL",
        price: "R$ 149,90",
        period: "/mês",
        description: "Estrutura completa para ONGs e grandes organizações de sorteio.",
        features: [
            "Tudo do plano PRO",
            "Menor taxa: apenas 1%",
            "Dashboard multi-org",
            "Auditória detalhada",
            "Gerente exclusivo",
        ],
        buttonText: "Falar com Consultor",
        variant: "outline" as const,
        icon: <ShieldCheck className="h-5 w-5 text-slate-400" />,
        color: "slate"
    },
]

export default async function PlanosPage() {
    const session = await auth()
    if (!session?.user?.id) redirect("/login")

    const user = await prisma.user.findUnique({
        where: { id: session.user.id }
    })

    return (
        <div className="min-h-screen bg-[#f7f6f8] dark:bg-[#171121] text-slate-900 dark:text-slate-100 pb-24 -m-4 md:-m-8">
            {/* Hero Section */}
            <div className="relative overflow-hidden bg-white dark:bg-slate-900 border-b border-primary/10">
                <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-primary/5 to-transparent pointer-events-none"></div>
                <div className="absolute -top-24 -left-24 size-64 bg-primary/10 rounded-full blur-[100px] pointer-events-none"></div>

                <div className="max-w-4xl mx-auto px-6 py-16 text-center relative z-10 space-y-4">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20 text-[10px] font-black uppercase tracking-widest mb-2">
                        <Star className="h-3 w-3 fill-primary" />
                        Upgrade de Nível
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white leading-tight">
                        Escolha o Plano Perfeito <br /> para o seu Sucesso
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 font-medium max-w-xl mx-auto">
                        De iniciantes a grandes organizações, temos a estrutura certa para você profissionalizar seus sorteios.
                    </p>
                </div>
            </div>

            <main className="p-6 md:p-12 space-y-16">
                {/* Plans Grid */}
                <div className="max-w-6xl mx-auto grid gap-8 md:grid-cols-3">
                    {plans.map((plan) => (
                        <div
                            key={plan.name}
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
                                    <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-1 leading-relaxed">
                                        {plan.description}
                                    </p>
                                </div>

                                <div className="py-4 border-y border-slate-50 dark:border-slate-700">
                                    <div className="flex items-baseline gap-1">
                                        <span className="text-4xl font-black text-slate-900 dark:text-white">{plan.price}</span>
                                        {plan.period && <span className="text-slate-400 font-bold">{plan.period}</span>}
                                    </div>
                                </div>

                                <ul className="space-y-4">
                                    {plan.features.map((feature) => (
                                        <li key={feature} className="flex items-start gap-3">
                                            <div className={`mt-1 size-5 rounded-full flex items-center justify-center shrink-0 ${plan.highlight ? "bg-primary/20 text-primary" : "bg-slate-50 dark:bg-slate-900 text-slate-400"
                                                }`}>
                                                <Check className="h-3 w-3" />
                                            </div>
                                            <span className="text-xs font-bold text-slate-600 dark:text-slate-300 leading-tight">{feature}</span>
                                        </li>
                                    ))}
                                </ul>

                                <Button
                                    className={`w-full h-14 rounded-2xl font-black text-xs uppercase tracking-[0.2em] transition-all active:scale-95 ${plan.highlight
                                            ? "bg-primary hover:bg-primary/90 text-white shadow-xl shadow-primary/20"
                                            : "bg-slate-50 dark:bg-slate-900 hover:bg-primary/5 hover:text-primary text-slate-600 dark:text-slate-300 border-none"
                                        }`}
                                    disabled={user?.plan === plan.name}
                                >
                                    {user?.plan === plan.name ? "Plano Atual" : plan.buttonText}
                                    {!user?.plan?.includes(plan.name) && plan.name !== "FREE" && <ArrowRight className="ml-2 h-4 w-4" />}
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Features Comparison Highlight */}
                <section className="max-w-4xl mx-auto bg-gradient-to-br from-primary/5 to-purple-500/5 dark:from-primary/10 dark:to-purple-500/10 p-10 rounded-[3rem] border border-primary/10 space-y-8">
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
