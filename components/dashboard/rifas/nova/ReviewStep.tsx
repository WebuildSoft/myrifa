"use client"

import { Button } from "@/components/ui/button"
import { CheckCircle2, Check, Rocket, CheckCircle, Trophy, Calendar, Palette, TrendingUp, AlertTriangle } from "lucide-react"
import Link from "next/link"
import { ShareRaffleModal } from "@/components/ui/share-raffle-modal"

interface ReviewStepProps {
    rifaId?: string
    title: string
    description: string
    prizes: { title: string; position: number }[]
    totalNumbers: number
    numberPrice: number
    drawDate: string
    theme: string
    loading: boolean
    userPlan: string
    hasPixConfig: boolean
    onPublish: () => void
    onKeepDraft: () => void
}

export function ReviewStep({
    rifaId,
    title,
    description,
    prizes,
    totalNumbers,
    numberPrice,
    drawDate,
    theme,
    loading,
    userPlan,
    hasPixConfig,
    onPublish,
    onKeepDraft
}: ReviewStepProps) {
    const origin = typeof window !== "undefined" ? window.location.origin : ""
    const totalRevenue = totalNumbers * numberPrice

    // Fee percentage based on plan
    const feePercentage = userPlan === "INSTITUTIONAL" ? 0.01 : userPlan === "PRO" ? 0.02 : 0.05
    const platformFee = totalRevenue * feePercentage
    const estimatedProfit = totalRevenue - platformFee

    const formatCurrency = (val: number) => {
        return val.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
    }

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Checklist & Details */}
                <div className="space-y-6">
                    <h3 className="text-lg font-bold flex items-center gap-2">
                        <CheckCircle2 className="h-5 w-5 text-primary" />
                        Conferência de Dados
                    </h3>

                    <div className="grid gap-4">
                        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 flex items-start gap-4">
                            <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                                <Check className="h-5 w-5" />
                            </div>
                            <div className="space-y-1">
                                <p className="text-sm font-bold uppercase tracking-tight">Título e Resumo</p>
                                <p className="text-sm text-slate-900 dark:text-white font-medium">{title}</p>
                                <p className="text-xs text-slate-500 whitespace-pre-wrap">{description}</p>
                            </div>
                        </div>

                        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 flex items-start gap-4">
                            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center shrink-0">
                                <Trophy className="h-5 w-5" />
                            </div>
                            <div className="space-y-2">
                                <p className="text-sm font-bold uppercase tracking-tight">Premiação</p>
                                <div className="space-y-1">
                                    {prizes.map((p, i) => (
                                        <div key={i} className="flex items-center gap-2">
                                            <span className="text-[10px] font-black bg-amber-50 text-amber-600 px-1.5 py-0.5 rounded-md border border-amber-100 italic">
                                                {p.position}º
                                            </span>
                                            <span className="text-xs font-bold text-slate-700 dark:text-slate-300">{p.title}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 flex items-start gap-4">
                                <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                                    <Calendar className="h-5 w-5" />
                                </div>
                                <div className="space-y-1">
                                    <p className="text-sm font-bold uppercase tracking-tight">Sorteio</p>
                                    <p className="text-xs font-bold text-slate-700 dark:text-slate-300">
                                        {drawDate ? new Date(drawDate).toLocaleDateString('pt-BR') : "A definir"}
                                    </p>
                                </div>
                            </div>
                            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 flex items-start gap-4">
                                <div className="w-10 h-10 rounded-xl bg-violet-100 text-violet-600 flex items-center justify-center shrink-0">
                                    <Palette className="h-5 w-5" />
                                </div>
                                <div className="space-y-1">
                                    <p className="text-sm font-bold uppercase tracking-tight">Visual</p>
                                    <p className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">{theme}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Financial Summary & Marketing */}
                <div className="space-y-6">
                    <div className="p-8 rounded-[2.5rem] bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white shadow-2xl relative overflow-hidden group border border-white/5">
                        <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform duration-500">
                            <TrendingUp className="h-20 w-20" />
                        </div>
                        <div className="relative z-10 space-y-6">
                            <div className="space-y-1">
                                <p className="text-slate-300 text-[10px] font-bold uppercase tracking-widest opacity-80">Resumo Financeiro</p>
                                <div className="flex items-baseline gap-2">
                                    <h3 className="text-4xl font-black tracking-tight text-white">{formatCurrency(totalRevenue)}</h3>
                                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Arrecadação Total</span>
                                </div>
                            </div>

                            <div className="h-px bg-white/10"></div>

                            <div className="grid grid-cols-2 gap-8">
                                <div className="space-y-1">
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider italic">Total de Cotas</p>
                                    <p className="text-2xl font-black text-white">{totalNumbers}</p>
                                    <p className="text-[10px] text-slate-400 font-bold italic">{formatCurrency(numberPrice)} /cada</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[10px] font-bold text-primary uppercase tracking-wider">Lucro Estimado</p>
                                    <p className="text-2xl font-black text-primary drop-shadow-[0_0_10px_rgba(var(--primary),0.2)]">{formatCurrency(estimatedProfit)}</p>
                                    <p className="text-[10px] text-slate-400 font-bold italic">Livre de Taxas</p>
                                </div>
                            </div>

                            <div className="mt-6 p-5 rounded-3xl bg-white/5 border border-white/10 space-y-3">
                                <div className="flex items-center justify-between">
                                    <span className="text-[10px] font-black uppercase text-slate-400">Manutenção da Plataforma ({feePercentage * 100}%)</span>
                                    <span className="text-xs font-black text-red-400">-{formatCurrency(platformFee)}</span>
                                </div>
                                <p className="text-[10px] text-slate-400 leading-tight font-medium italic opacity-70">
                                    Este valor é destinado ao custeio de infraestrutura, gateways de pagamento e segurança da sua campanha.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="p-6 rounded-3xl bg-primary/5 border border-primary/10 space-y-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                                <Rocket className="h-5 w-5" />
                            </div>
                            <h4 className="font-bold text-slate-900 dark:text-white uppercase text-xs tracking-tight">Pronto para o lançamento?</h4>
                        </div>
                        <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-medium italic">"Ao ativar, sua página estará pronta para receber vendas via PIX automático."</p>
                        <ul className="space-y-2">
                            {["Link de divulgação exclusivo", "Gestão de cotas em tempo real", "Recebimento via PIX automático"].map((item, i) => (
                                <li key={i} className="flex items-center gap-2 text-[10px] font-bold text-slate-500 uppercase tracking-tight">
                                    <CheckCircle className="h-3.5 w-3.5 text-primary" />
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>

            {!hasPixConfig && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/50 p-4 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 mb-2 animate-in fade-in slide-in-from-bottom-2 duration-500">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-red-100 dark:bg-red-900/40 rounded-xl">
                            <AlertTriangle className="h-5 w-5 text-red-600" />
                        </div>
                        <div>
                            <p className="text-sm font-black text-red-800 dark:text-red-400">Configuração de Recebimento Obrigatória!</p>
                            <p className="text-[10px] text-red-700 dark:text-red-500 font-medium leading-tight">Você deve configurar sua Chave PIX e QR Code no perfil antes de ativar as vendas.</p>
                        </div>
                    </div>
                    <Link
                        href="/conta?tab=financeiro#pix-manual"
                        className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-lg shadow-red-600/10 active:scale-95 whitespace-nowrap"
                    >
                        Configurar Agora
                    </Link>
                </div>
            )}

            <div className="flex flex-col sm:flex-row-reverse gap-4 pt-6 border-t border-slate-100 dark:border-slate-800">
                <Button
                    type="button"
                    size="lg"
                    className={`flex-[2] h-16 rounded-2xl font-black uppercase text-xs tracking-widest gap-3 transition-all active:scale-95 ${!hasPixConfig ? 'bg-slate-200 text-slate-400 cursor-not-allowed dark:bg-slate-800' : 'bg-primary hover:bg-primary/90 shadow-xl shadow-primary/20 text-white'}`}
                    onClick={onPublish}
                    disabled={loading || !hasPixConfig}
                >
                    <Rocket className={`h-5 w-5 ${loading ? 'animate-bounce' : 'animate-pulse'}`} />
                    {loading ? "Ativando..." : "Lançar Campanha Agora 🚀"}
                </Button>

                <div className="flex flex-col sm:flex-row flex-1 gap-4">
                    {rifaId && (
                        <ShareRaffleModal raffleUrl={`${origin}/r/${rifaId}`} raffleTitle={title} />
                    )}

                    <Button
                        type="button"
                        variant="outline"
                        size="lg"
                        className="flex-1 h-16 rounded-2xl font-bold uppercase text-[10px] tracking-widest border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900 transition-all"
                        onClick={onKeepDraft}
                    >
                        Salvar Rascunho
                    </Button>
                </div>
            </div>
        </div>
    )
}
