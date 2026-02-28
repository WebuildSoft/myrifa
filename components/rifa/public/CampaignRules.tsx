"use client"

import { CalendarDays, CheckCircle2, Shield, Clock, Trophy } from "lucide-react"

interface CampaignRulesProps {
    rules?: string | null
}

export function CampaignRules({ rules }: CampaignRulesProps) {
    return (
        <section className="mt-4">
            <div className="flex items-center gap-3 mb-4">
                <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                    <CalendarDays className="w-4 h-4" />
                </div>
                <h3 className="text-lg font-black text-slate-900 dark:text-white">Regras e Instruções</h3>
            </div>
            {rules ? (
                <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm leading-relaxed whitespace-pre-wrap text-sm font-medium text-slate-600 dark:text-slate-300">
                    {rules}
                </div>
            ) : (
                <ul className="grid gap-3">
                    {[
                        { icon: CheckCircle2, text: "Resultado baseado no sorteio oficial da Loteria Federal.", color: "text-emerald-500" },
                        { icon: Shield, text: "Apoio 100% seguro e criptografado.", color: "text-blue-500" },
                        { icon: Clock, text: "Reserva de 30 minutos após a seleção.", color: "text-amber-500" },
                        { icon: Trophy, text: "Entrega garantida pela plataforma MyRifa.", color: "text-violet-500" }
                    ].map((rule, i) => (
                        <li key={i} className="flex items-center gap-3 bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm">
                            <rule.icon className={`w-5 h-5 shrink-0 ${rule.color}`} />
                            <span className="text-sm font-bold text-slate-600 dark:text-slate-300">{rule.text}</span>
                        </li>
                    ))}
                </ul>
            )}
        </section>
    )
}
