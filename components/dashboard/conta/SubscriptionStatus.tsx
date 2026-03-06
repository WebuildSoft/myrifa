"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CreditCard, Star, Zap, Calendar, Crown } from "lucide-react"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import Link from "next/link"

interface SubscriptionStatusProps {
    plan: "FREE" | "PRO" | "INSTITUTIONAL"
    userId: string
    expiresAt?: Date | null
}

export function SubscriptionStatus({ plan, userId, expiresAt }: SubscriptionStatusProps) {
    const isGrowth = plan === "PRO"
    const isBusiness = plan === "INSTITUTIONAL"
    const isPro = isGrowth || isBusiness

    const handleDirectPayment = () => {
        const growthStripeUrl = "https://buy.stripe.com/cNifZgcsR0o27GB6QJgQE02"
        try {
            const url = new URL(growthStripeUrl)
            url.searchParams.set("client_reference_id", userId)
            // also prefill email if we had it, but userId is the critical one for the webhook
            window.location.href = url.toString()
        } catch (err) {
            window.location.href = growthStripeUrl
        }
    }

    const planInfo = {
        FREE: { label: "START", color: "text-slate-400", bg: "bg-slate-100", border: "border-slate-200" },
        PRO: { label: "GROWTH", color: "text-primary", bg: "bg-primary/20", border: "border-primary/30" },
        INSTITUTIONAL: { label: "BUSINESS", color: "text-violet-500", bg: "bg-violet-500/20", border: "border-violet-500/30" }
    }

    const currentPlanInfo = planInfo[plan] || planInfo.FREE

    return (
        <Card className="border-slate-200/60 dark:border-slate-800/60 bg-white dark:bg-slate-900/50 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.2)] rounded-2xl md:rounded-[2rem] overflow-hidden">
            <CardHeader className="border-b border-slate-100 dark:border-slate-800/50 p-5 md:p-6 pb-4 bg-slate-50/30 dark:bg-slate-900/30">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                        <div className={`p-2 rounded-xl border shadow-sm ${currentPlanInfo.bg} ${currentPlanInfo.border} ${currentPlanInfo.color}`}>
                            {isBusiness ? <Crown className="size-3.5" /> : isPro ? <Zap className="size-3.5" /> : <Star className="size-3.5" />}
                        </div>
                        <div>
                            <CardTitle className="text-lg font-black tracking-tight italic">Plano {currentPlanInfo.label}</CardTitle>
                            <CardDescription className="text-[9px] font-black uppercase tracking-widest text-slate-500">Gestão de Assinatura</CardDescription>
                        </div>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="p-5 md:p-6 space-y-4">
                <div className="space-y-4">
                    <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-950/50 border border-slate-100 dark:border-slate-800">
                        <Calendar className="size-3.5 text-slate-400" />
                        <div>
                            <p className="text-[8px] font-black uppercase tracking-widest text-slate-400 mb-0.5">Status</p>
                            <p className="text-[11px] font-bold text-slate-900 dark:text-slate-100">
                                {expiresAt ? `Ativo até ${format(new Date(expiresAt), "dd/MM/yyyy", { locale: ptBR })}` : "Acesso Vitalício Start"}
                            </p>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <h4 className="text-[8px] font-black uppercase tracking-widest text-slate-400 ml-1">Vantagens do Level</h4>
                        <div className="space-y-1.5">
                            <BenefitItem active={true} text={isPro ? "Campanhas Ilimitadas" : "Até 3 Campanhas Ativas"} />
                            <BenefitItem active={isPro} text={isBusiness ? "Taxa Mínima 1%" : isGrowth ? "Taxa Reduzida 2%" : "Taxa Padrão ~5%"} />
                            <BenefitItem active={isPro} text="Suporte VIP WhatsApp" />
                            {isBusiness && <BenefitItem active={true} text="Gerente de Conta Dedicado" />}
                        </div>
                    </div>
                </div>

                <div className="pt-1">
                    {isPro ? (
                        <Button asChild className="w-full h-10 rounded-xl font-black tracking-[0.05em] uppercase text-[10px] shadow-lg transition-all hover:scale-[1.02] active:scale-95 bg-slate-900 border border-slate-800 hover:bg-slate-800 text-white">
                            <Link href="/planos">Gerenciar Plano</Link>
                        </Button>
                    ) : (
                        <Button
                            onClick={handleDirectPayment}
                            className="w-full h-10 rounded-xl font-black tracking-[0.05em] uppercase text-[10px] shadow-lg transition-all hover:scale-[1.02] active:scale-95 bg-primary text-slate-950 hover:bg-primary/90"
                        >
                            Assinar Growth Agora
                        </Button>
                    )}
                </div>
            </CardContent>
        </Card>
    )
}

function BenefitItem({ active, text }: { active: boolean, text: string }) {
    return (
        <div className={`flex items-center gap-2 ${active ? 'opacity-100' : 'opacity-25'}`}>
            <div className={`size-1 rounded-full ${active ? 'bg-primary' : 'bg-slate-400'}`} />
            <span className="text-[11px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-tighter">{text}</span>
        </div>
    )
}
