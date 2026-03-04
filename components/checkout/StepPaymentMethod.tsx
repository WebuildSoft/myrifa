"use client"

import { CreditCard, QrCode, FileText, CheckCircle2, ArrowLeft, Lock, Zap, AlertTriangle, ShieldCheck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface StepPaymentMethodProps {
    paymentMethod: "PIX" | "PIX_MANUAL" | "CREDIT_CARD" | "BOLETO" | null
    setPaymentMethod: (method: any) => void
    onProcess: () => void
    onBack: () => void
    loading: boolean
    error?: string
    primaryColor?: string | null
    hasManualPix: boolean // organizador configurou PIX direto?
    hasMercadoPago: boolean // organizador tem MP configurado?
}

export function StepPaymentMethod({ paymentMethod, setPaymentMethod, onProcess, onBack, loading, error, primaryColor, hasManualPix, hasMercadoPago }: StepPaymentMethodProps) {
    const color = primaryColor || '#7c3aed'

    const BUTTON_LABEL: Record<string, string> = {
        PIX_MANUAL: "Ver QR Code e Pagar",
        PIX: "Gerar QR Code PIX",
        CREDIT_CARD: "Pagar com Cartão",
        BOLETO: "Gerar Boleto",
    }

    return (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm p-8">
            <button
                onClick={onBack}
                className="inline-flex items-center gap-2 text-slate-500 font-bold transition-colors text-sm mb-6"
            >
                <ArrowLeft className="w-4 h-4" />
                Voltar
            </button>

            <div className="flex items-center gap-3 mb-8">
                <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center"
                    style={{ backgroundColor: `${color}15`, color }}
                >
                    <CreditCard className="w-5 h-5" />
                </div>
                <div>
                    <h2 className="text-xl font-black text-slate-900 dark:text-white">2. Forma de pagamento</h2>
                    <p className="text-sm text-slate-400 font-medium mt-0.5">Escolha como deseja pagar</p>
                </div>
            </div>

            {/* PIX MANUAL (direto ao organizador) - destaque principal */}
            {hasManualPix && (
                <div className="mb-4">
                    <p className="text-[10px] font-black uppercase tracking-widest text-emerald-600 mb-2 flex items-center gap-1">
                        <ShieldCheck className="w-3.5 h-3.5" /> Recomendado
                    </p>
                    <button
                        onClick={() => setPaymentMethod("PIX_MANUAL")}
                        className={cn(
                            "w-full relative border-2 p-5 rounded-2xl cursor-pointer transition-all duration-200 flex items-center gap-4 text-left group",
                            paymentMethod === "PIX_MANUAL"
                                ? "shadow-md"
                                : "border-slate-100 dark:border-slate-800 hover:bg-emerald-50 dark:hover:bg-emerald-900/10"
                        )}
                        style={paymentMethod === "PIX_MANUAL" ? {
                            borderColor: '#10b981',
                            backgroundColor: '#10b98110',
                            boxShadow: '0 10px 15px -3px #10b98120'
                        } : {}}
                    >
                        <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center shrink-0", paymentMethod === "PIX_MANUAL" ? "bg-emerald-500/20" : "bg-slate-100 dark:bg-slate-800")}>
                            <QrCode className={cn("w-6 h-6", paymentMethod === "PIX_MANUAL" ? "text-emerald-500" : "text-slate-400")} />
                        </div>
                        <div className="flex-1">
                            <div className="flex items-center gap-2">
                                <p className="font-black text-base text-slate-900 dark:text-white">PIX Direto</p>
                                <span className="text-[10px] font-black bg-emerald-500 text-white px-2 py-0.5 rounded-full uppercase tracking-wide">Instantâneo</span>
                            </div>
                            <p className="text-xs text-slate-400 mt-0.5">Pague direto para o organizador via PIX. Zero taxas.</p>
                        </div>
                        {paymentMethod === "PIX_MANUAL" && (
                            <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                        )}
                    </button>
                </div>
            )}

            {/* Separador */}
            {hasManualPix && hasMercadoPago && (
                <div className="flex items-center gap-3 my-4">
                    <div className="flex-1 h-px bg-slate-100 dark:bg-slate-800" />
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">ou outras formas</span>
                    <div className="flex-1 h-px bg-slate-100 dark:bg-slate-800" />
                </div>
            )}

            {/* MP + Cartão + Boleto */}
            {hasMercadoPago && (
                <div className="space-y-3">
                    {/* Aviso MP */}

                    {/* PIX via MP */}
                    <button
                        onClick={() => setPaymentMethod("PIX")}
                        className={cn(
                            "w-full relative border-2 p-4 rounded-2xl cursor-pointer transition-all duration-200 flex items-center gap-4 text-left group",
                            paymentMethod === "PIX"
                                ? "shadow-md"
                                : "border-slate-100 dark:border-slate-800 hover:bg-primary/5"
                        )}
                        style={paymentMethod === "PIX" ? {
                            borderColor: color,
                            backgroundColor: `${color}10`,
                        } : {}}
                    >
                        <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center shrink-0", paymentMethod === "PIX" ? "" : "bg-slate-100 dark:bg-slate-800")} style={paymentMethod === "PIX" ? { backgroundColor: `${color}20` } : {}}>
                            <Zap className={cn("w-5 h-5", paymentMethod === "PIX" ? "" : "text-slate-400")} style={paymentMethod === "PIX" ? { color } : {}} />
                        </div>
                        <div className="flex-1">
                            <p className="font-bold text-sm text-slate-900 dark:text-white">PIX via Mercado Pago</p>
                            <p className="text-xs text-slate-400">Confirmação automática</p>
                        </div>
                        {paymentMethod === "PIX" && <CheckCircle2 className="w-4 h-4 shrink-0" style={{ color }} />}
                    </button>

                    {/* Cartão */}
                    <button
                        onClick={() => setPaymentMethod("CREDIT_CARD")}
                        className={cn(
                            "w-full relative border-2 p-4 rounded-2xl cursor-pointer transition-all duration-200 flex items-center gap-4 text-left group",
                            paymentMethod === "CREDIT_CARD"
                                ? "shadow-md"
                                : "border-slate-100 dark:border-slate-800 hover:bg-primary/5"
                        )}
                        style={paymentMethod === "CREDIT_CARD" ? {
                            borderColor: color,
                            backgroundColor: `${color}10`,
                        } : {}}
                    >
                        <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center shrink-0", paymentMethod === "CREDIT_CARD" ? "" : "bg-slate-100 dark:bg-slate-800")} style={paymentMethod === "CREDIT_CARD" ? { backgroundColor: `${color}20` } : {}}>
                            <CreditCard className={cn("w-5 h-5", paymentMethod === "CREDIT_CARD" ? "" : "text-slate-400")} style={paymentMethod === "CREDIT_CARD" ? { color } : {}} />
                        </div>
                        <div className="flex-1">
                            <p className="font-bold text-sm text-slate-900 dark:text-white">Cartão de Crédito</p>
                            <p className="text-xs text-slate-400">Em até 12x</p>
                        </div>
                        {paymentMethod === "CREDIT_CARD" && <CheckCircle2 className="w-4 h-4 shrink-0" style={{ color }} />}
                    </button>

                    {/* Boleto */}
                    <button
                        onClick={() => setPaymentMethod("BOLETO")}
                        className={cn(
                            "w-full relative border-2 p-4 rounded-2xl cursor-pointer transition-all duration-200 flex items-center gap-4 text-left group",
                            paymentMethod === "BOLETO"
                                ? "shadow-md"
                                : "border-slate-100 dark:border-slate-800 hover:bg-primary/5"
                        )}
                        style={paymentMethod === "BOLETO" ? {
                            borderColor: color,
                            backgroundColor: `${color}10`,
                        } : {}}
                    >
                        <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center shrink-0", paymentMethod === "BOLETO" ? "" : "bg-slate-100 dark:bg-slate-800")} style={paymentMethod === "BOLETO" ? { backgroundColor: `${color}20` } : {}}>
                            <FileText className={cn("w-5 h-5", paymentMethod === "BOLETO" ? "" : "text-slate-400")} style={paymentMethod === "BOLETO" ? { color } : {}} />
                        </div>
                        <div className="flex-1">
                            <p className="font-bold text-sm text-slate-900 dark:text-white">Boleto Bancário</p>
                            <p className="text-xs text-slate-400">Vence em 3 dias úteis</p>
                        </div>
                        {paymentMethod === "BOLETO" && <CheckCircle2 className="w-4 h-4 shrink-0" style={{ color }} />}
                    </button>
                </div>
            )}

            {/* Nenhuma opção disponível */}
            {!hasManualPix && !hasMercadoPago && (
                <div className="text-center py-10 text-slate-400">
                    <AlertTriangle className="w-10 h-10 mx-auto mb-3 text-amber-400" />
                    <p className="font-bold">Nenhuma forma de pagamento disponível</p>
                    <p className="text-sm mt-1">O organizador ainda não configurou o recebimento deste produto.</p>
                </div>
            )}

            {error && <p className="text-sm text-red-500 mb-4 font-bold text-center mt-4">{error}</p>}

            {/* Botão confirmar */}
            {paymentMethod && (
                <div className="animate-in fade-in slide-in-from-bottom-2 duration-300 mt-6">
                    <Button
                        onClick={onProcess}
                        disabled={loading}
                        size="lg"
                        className="w-full h-14 rounded-xl font-black gap-2 text-base shadow-lg active:scale-95 transition-all"
                        style={paymentMethod === "PIX_MANUAL"
                            ? { backgroundColor: '#10b981', boxShadow: '0 10px 15px -3px #10b98130' }
                            : { backgroundColor: color, boxShadow: `0 10px 15px -3px ${color}30` }
                        }
                    >
                        {loading ? (
                            <><span className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" /> Processando...</>
                        ) : (
                            BUTTON_LABEL[paymentMethod]
                        )}
                    </Button>
                </div>
            )}

            <div className="flex justify-end items-center pt-4 border-t border-slate-100 dark:border-slate-800 mt-6">
                <div className="flex items-center gap-2 text-slate-400 text-xs font-bold uppercase tracking-wider">
                    <Lock className="w-3.5 h-3.5 text-emerald-500" />
                    Pagamento 100% Seguro
                </div>
            </div>
        </div>
    )
}
