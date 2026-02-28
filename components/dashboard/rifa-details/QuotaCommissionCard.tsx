import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { ShieldCheck, TrendingUp, Info } from "lucide-react"

interface QuotaCommissionCardProps {
    paid: number
    goal: number
    percent: number
}

export function QuotaCommissionCard({ paid, goal, percent }: QuotaCommissionCardProps) {
    const progress = goal > 0 ? (paid / goal) * 100 : 100
    const isCompleted = paid >= goal && goal > 0

    return (
        <Card className="p-6 bg-white dark:bg-[#1f162d] border-primary/10 overflow-hidden relative group">
            <div className="flex flex-col gap-4 relative z-10">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="p-2 bg-primary/10 rounded-lg">
                            <ShieldCheck className="w-5 w-5 text-primary" />
                        </div>
                        <div>
                            <h3 className="font-black text-sm uppercase tracking-wider">Cotas do Sistema</h3>
                            <p className="text-[10px] text-slate-500 font-bold uppercase">Taxa de Manutenção ({(percent * 100).toFixed(0)}%)</p>
                        </div>
                    </div>
                    {isCompleted && (
                        <div className="bg-emerald-500/10 text-emerald-500 text-[10px] font-black px-2 py-1 rounded-full uppercase">
                            Meta Atingida
                        </div>
                    )}
                </div>

                <div className="space-y-2">
                    <div className="flex justify-between items-end">
                        <div className="flex flex-col">
                            <span className="text-2xl font-black text-primary">
                                {new Intl.NumberFormat("pt-BR", {
                                    style: "currency",
                                    currency: "BRL"
                                }).format(paid)}
                            </span>
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                                de {new Intl.NumberFormat("pt-BR", {
                                    style: "currency",
                                    currency: "BRL"
                                }).format(goal)} integralizados
                            </span>
                        </div>
                        <div className="text-right">
                            <span className="text-sm font-black text-slate-500">{progress.toFixed(1)}%</span>
                        </div>
                    </div>
                    <Progress value={progress} className="h-2 bg-primary/5" />
                </div>

                <div className="p-3 bg-slate-50 dark:bg-white/5 rounded-lg flex gap-3">
                    <Info className="w-4 w-4 text-slate-400 shrink-0 mt-0.5" />
                    <p className="text-[10px] leading-relaxed text-slate-500 font-medium">
                        {isCompleted
                            ? "A meta de comissão foi atingida! A partir de agora, 100% das vendas serão destinadas diretamente à sua conta do Mercado Pago."
                            : `O sistema redireciona aleatoriamente ~${(percent * 100).toFixed(0)}% das vendas para a plataforma via Stripe até atingir a meta. O restante (${(100 - percent * 100).toFixed(0)}%) cai na sua conta.`
                        }
                    </p>
                </div>
            </div>

            {/* Decorative background icon */}
            <TrendingUp className="absolute -right-4 -bottom-4 w-24 h-24 text-primary/5 -rotate-12 group-hover:rotate-0 transition-transform duration-500" />
        </Card>
    )
}
