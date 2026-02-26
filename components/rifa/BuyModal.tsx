"use client"

import { useState, useEffect, useRef } from "react"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    CheckCircle2,
    ChevronRight,
    QrCode,
    CreditCard,
    Copy,
    Check,
    ArrowLeft,
    Shield,
    Lock,
    Clock,
    Ticket,
    User,
    Phone,
    Mail,
    FileText,
    Sparkles,
} from "lucide-react"
import { processCheckoutAction } from "@/actions/checkout"
import Image from "next/image"
import { cn } from "@/lib/utils"

interface BuyModalProps {
    rifaId: string
    selectedNumbers: number[]
    totalPrice: number
    isOpen: boolean
    onClose: () => void
    rifaTitle?: string
    rifaCover?: string | null
}

const STEP_LABELS = ["Seus dados", "Forma de pagamento", "Pagamento"]
const PAYMENT_EXPIRY_SECONDS = 30 * 60 // 30 minutes

export function BuyModal({
    rifaId,
    selectedNumbers,
    totalPrice,
    isOpen,
    onClose,
    rifaTitle = "Sorteio",
    rifaCover,
}: BuyModalProps) {
    const [step, setStep] = useState<1 | 2 | 3 | 4>(1)
    const [buyerInfo, setBuyerInfo] = useState({ name: "", whatsapp: "", email: "" })
    const [paymentMethod, setPaymentMethod] = useState<"PIX" | "CREDIT_CARD" | "BOLETO" | null>(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")
    const [pixData, setPixData] = useState<{ qrCode?: string; qrCodeCopy?: string; txId?: string }>({})
    const [copied, setCopied] = useState(false)
    const [secondsLeft, setSecondsLeft] = useState(PAYMENT_EXPIRY_SECONDS)
    const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

    const formattedTotal = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(totalPrice)
    const pricePerNumber = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(
        selectedNumbers.length > 0 ? totalPrice / selectedNumbers.length : 0
    )

    const minutesLeft = String(Math.floor(secondsLeft / 60)).padStart(2, "0")
    const secsLeft = String(secondsLeft % 60).padStart(2, "0")

    // Countdown timer for PIX payment
    useEffect(() => {
        if (step === 3) {
            setSecondsLeft(PAYMENT_EXPIRY_SECONDS)
            timerRef.current = setInterval(() => {
                setSecondsLeft((s) => {
                    if (s <= 1) {
                        clearInterval(timerRef.current!)
                        return 0
                    }
                    return s - 1
                })
            }, 1000)
        }
        return () => {
            if (timerRef.current) clearInterval(timerRef.current)
        }
    }, [step])

    const handleNextStep1 = (e: React.FormEvent) => {
        e.preventDefault()
        setError("")
        if (!buyerInfo.name.trim()) { setError("Informe seu nome."); return }
        if (!buyerInfo.whatsapp.trim()) { setError("Informe seu WhatsApp."); return }
        setStep(2)
    }

    const handleProcessPayment = async () => {
        if (!paymentMethod) return
        setError("")
        setLoading(true)

        try {
            const result = await processCheckoutAction({
                rifaId,
                numbers: selectedNumbers,
                name: buyerInfo.name,
                whatsapp: buyerInfo.whatsapp,
                email: buyerInfo.email,
                paymentMethod,
            })

            if (result.error) {
                setError(result.error)
                setLoading(false)
                return
            }

            if (paymentMethod === "PIX" && result.success) {
                setPixData({ qrCode: result.qrCode, qrCodeCopy: result.qrCodeCopy, txId: result.transactionId })
                setStep(3)
            }
        } catch {
            setError("Erro ao processar pagamento. Tente novamente.")
        }

        setLoading(false)
    }

    const copyToClipboard = () => {
        if (pixData.qrCodeCopy) {
            navigator.clipboard.writeText(pixData.qrCodeCopy)
            setCopied(true)
            setTimeout(() => setCopied(false), 2500)
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="max-w-[880px] p-0 overflow-hidden rounded-3xl gap-0">
                <div className="flex flex-col lg:flex-row min-h-[520px]">

                    {/* ── LEFT PANEL ────────────────────────────────────────── */}
                    <div className="flex-1 p-6 md:p-8 flex flex-col">

                        {/* Step Indicator */}
                        {step < 4 && (
                            <div className="flex items-center gap-2 mb-8">
                                {STEP_LABELS.map((label, i) => {
                                    const stepNum = i + 1
                                    const done = step > stepNum
                                    const active = step === stepNum
                                    return (
                                        <div key={label} className="flex items-center gap-2 flex-1">
                                            <div className="flex items-center gap-2 shrink-0">
                                                <span className={cn(
                                                    "w-7 h-7 rounded-full text-xs font-black flex items-center justify-center transition-all",
                                                    active ? "bg-primary text-white shadow-lg shadow-primary/30" :
                                                        done ? "bg-emerald-500 text-white" :
                                                            "bg-slate-100 dark:bg-slate-800 text-slate-400"
                                                )}>
                                                    {done ? <Check className="w-3.5 h-3.5" /> : stepNum}
                                                </span>
                                                <span className={cn(
                                                    "text-xs font-bold hidden md:block",
                                                    active ? "text-primary" : done ? "text-emerald-600" : "text-slate-400"
                                                )}>{label}</span>
                                            </div>
                                            {i < STEP_LABELS.length - 1 && (
                                                <div className="flex-1 h-px bg-slate-100 dark:bg-slate-800 mx-1" />
                                            )}
                                        </div>
                                    )
                                })}
                            </div>
                        )}

                        {/* ── STEP 1: Buyer data ──────────────────────────── */}
                        {step === 1 && (
                            <div className="flex flex-col flex-1">
                                <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-1">Seus dados</h2>
                                <p className="text-sm text-slate-500 mb-6">Para quem ficarão reservados os {selectedNumbers.length} números?</p>

                                <form onSubmit={handleNextStep1} className="flex flex-col flex-1 gap-5">
                                    <div className="space-y-1.5">
                                        <Label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Nome Completo *</Label>
                                        <div className="relative">
                                            <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                            <Input
                                                value={buyerInfo.name}
                                                onChange={(e) => setBuyerInfo({ ...buyerInfo, name: e.target.value })}
                                                placeholder="Ex: João da Silva"
                                                className="pl-10 h-12 rounded-xl"
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-1.5">
                                        <Label className="text-xs font-bold text-slate-500 uppercase tracking-wider">WhatsApp *</Label>
                                        <div className="relative">
                                            <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                            <Input
                                                value={buyerInfo.whatsapp}
                                                onChange={(e) => setBuyerInfo({ ...buyerInfo, whatsapp: e.target.value })}
                                                placeholder="(11) 99999-9999"
                                                className="pl-10 h-12 rounded-xl"
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-1.5">
                                        <Label className="text-xs font-bold text-slate-500 uppercase tracking-wider">E-mail (opcional)</Label>
                                        <div className="relative">
                                            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                            <Input
                                                type="email"
                                                value={buyerInfo.email}
                                                onChange={(e) => setBuyerInfo({ ...buyerInfo, email: e.target.value })}
                                                placeholder="Para receber o comprovante"
                                                className="pl-10 h-12 rounded-xl"
                                            />
                                        </div>
                                    </div>

                                    {error && <p className="text-sm text-red-500">{error}</p>}

                                    <div className="flex-1" />

                                    <Button type="submit" size="lg" className="w-full h-12 rounded-xl font-bold gap-2">
                                        Continuar <ChevronRight className="w-4 h-4" />
                                    </Button>
                                </form>
                            </div>
                        )}

                        {/* ── STEP 2: Payment method ──────────────────────── */}
                        {step === 2 && (
                            <div className="flex flex-col flex-1">
                                <div className="flex items-center gap-3 mb-6">
                                    <button onClick={() => setStep(1)} className="text-slate-400 hover:text-primary transition-colors">
                                        <ArrowLeft className="w-5 h-5" />
                                    </button>
                                    <div>
                                        <h2 className="text-2xl font-black text-slate-900 dark:text-white">Forma de pagamento</h2>
                                        <p className="text-sm text-slate-500">Como deseja pagar {formattedTotal}?</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 gap-3 mb-6">
                                    {/* PIX */}
                                    <button
                                        onClick={() => setPaymentMethod("PIX")}
                                        className={cn(
                                            "relative flex items-center gap-4 p-4 rounded-2xl border-2 text-left transition-all",
                                            paymentMethod === "PIX"
                                                ? "border-primary bg-primary/5"
                                                : "border-slate-100 dark:border-slate-800 hover:border-primary/30"
                                        )}
                                    >
                                        <div className={cn(
                                            "w-12 h-12 rounded-xl flex items-center justify-center shrink-0 transition-colors",
                                            paymentMethod === "PIX" ? "bg-primary text-white" : "bg-slate-100 dark:bg-slate-800 text-slate-500"
                                        )}>
                                            <QrCode className="w-5 h-5" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="font-bold text-slate-900 dark:text-white">PIX</p>
                                            <p className="text-xs text-emerald-600 font-medium">Aprovação instantânea ✓</p>
                                        </div>
                                        <span className="text-[10px] bg-emerald-100 text-emerald-700 font-bold px-2 py-0.5 rounded-full uppercase">Recomendado</span>
                                        {paymentMethod === "PIX" && <CheckCircle2 className="absolute top-3 right-3 w-4 h-4 text-primary" />}
                                    </button>

                                    {/* Card */}
                                    <button
                                        onClick={() => setPaymentMethod("CREDIT_CARD")}
                                        className={cn(
                                            "flex items-center gap-4 p-4 rounded-2xl border-2 text-left transition-all",
                                            paymentMethod === "CREDIT_CARD"
                                                ? "border-primary bg-primary/5"
                                                : "border-slate-100 dark:border-slate-800 hover:border-primary/30"
                                        )}
                                    >
                                        <div className={cn(
                                            "w-12 h-12 rounded-xl flex items-center justify-center shrink-0 transition-colors",
                                            paymentMethod === "CREDIT_CARD" ? "bg-primary text-white" : "bg-slate-100 dark:bg-slate-800 text-slate-500"
                                        )}>
                                            <CreditCard className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <p className="font-bold text-slate-900 dark:text-white">Cartão de Crédito</p>
                                            <p className="text-xs text-slate-500">Até 12x com juros</p>
                                        </div>
                                        {paymentMethod === "CREDIT_CARD" && <CheckCircle2 className="ml-auto w-4 h-4 text-primary" />}
                                    </button>

                                    {/* Boleto */}
                                    <button
                                        onClick={() => setPaymentMethod("BOLETO")}
                                        className={cn(
                                            "flex items-center gap-4 p-4 rounded-2xl border-2 text-left transition-all",
                                            paymentMethod === "BOLETO"
                                                ? "border-primary bg-primary/5"
                                                : "border-slate-100 dark:border-slate-800 hover:border-primary/30"
                                        )}
                                    >
                                        <div className={cn(
                                            "w-12 h-12 rounded-xl flex items-center justify-center shrink-0 transition-colors",
                                            paymentMethod === "BOLETO" ? "bg-primary text-white" : "bg-slate-100 dark:bg-slate-800 text-slate-500"
                                        )}>
                                            <FileText className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <p className="font-bold text-slate-900 dark:text-white">Boleto Bancário</p>
                                            <p className="text-xs text-slate-500">Prazo de 1-3 dias úteis</p>
                                        </div>
                                        {paymentMethod === "BOLETO" && <CheckCircle2 className="ml-auto w-4 h-4 text-primary" />}
                                    </button>
                                </div>

                                {error && <p className="text-sm text-red-500 mb-3">{error}</p>}

                                <div className="flex-1" />

                                <Button
                                    onClick={handleProcessPayment}
                                    disabled={!paymentMethod || loading}
                                    size="lg"
                                    className="w-full h-12 rounded-xl font-bold gap-2"
                                >
                                    {loading ? (
                                        <><span className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" /> Processando...</>
                                    ) : (
                                        <>Prosseguir para Pagamento <ChevronRight className="w-4 h-4" /></>
                                    )}
                                </Button>

                                <div className="flex items-center justify-center gap-2 mt-4 text-xs text-slate-400">
                                    <Lock className="w-3 h-3 text-emerald-500" />
                                    Pagamento 100% seguro e criptografado
                                </div>
                            </div>
                        )}

                        {/* ── STEP 3: PIX payment ─────────────────────────── */}
                        {step === 3 && (
                            <div className="flex flex-col flex-1 items-center text-center">
                                <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-1">Pague com PIX</h2>
                                <p className="text-sm text-slate-500 mb-6 max-w-xs">
                                    Escaneie o QR Code com o app do seu banco para confirmar a participação.
                                </p>

                                {/* QR code */}
                                <div className="bg-white p-4 rounded-2xl shadow-xl ring-4 ring-primary/10 mb-6">
                                    <div className="w-48 h-48 relative flex items-center justify-center">
                                        {pixData.qrCode ? (
                                            <Image
                                                src={`data:image/jpeg;base64,${pixData.qrCode}`}
                                                alt="QR Code PIX"
                                                fill
                                                className="object-contain rounded-xl"
                                            />
                                        ) : (
                                            <QrCode className="w-16 h-16 text-slate-300" />
                                        )}
                                    </div>
                                </div>

                                {/* Copy-paste code */}
                                <div className="flex items-center gap-2 w-full max-w-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2.5 mb-4">
                                    <code className="text-xs text-slate-600 dark:text-slate-400 flex-1 truncate font-mono">
                                        {pixData.qrCodeCopy ?? "Gerando código..."}
                                    </code>
                                    <button onClick={copyToClipboard} className="text-primary hover:text-primary/80 transition-colors shrink-0">
                                        {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                                    </button>
                                </div>

                                {copied && (
                                    <p className="text-xs text-emerald-600 font-bold mb-3">Código copiado!</p>
                                )}

                                {/* Timer */}
                                <div className="flex items-center gap-2 text-slate-500 text-sm mb-6">
                                    <Clock className="w-4 h-4 text-primary" />
                                    Expira em{" "}
                                    <span className={cn(
                                        "font-black tabular-nums",
                                        secondsLeft < 300 ? "text-red-500" : "text-primary"
                                    )}>
                                        {minutesLeft}:{secsLeft}
                                    </span>
                                </div>

                                {/* Waiting indicator */}
                                <div className="flex items-center gap-2 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 text-xs p-3 rounded-xl w-full max-w-sm">
                                    <span className="animate-spin rounded-full h-3 w-3 border-2 border-blue-600 border-t-transparent shrink-0" />
                                    Aguardando confirmação do pagamento...
                                </div>

                                {/* Dev helper */}
                                <button
                                    onClick={() => setStep(4)}
                                    className="mt-6 text-xs text-slate-300 hover:text-slate-500 underline"
                                >
                                    Simular aprovação (Dev)
                                </button>
                            </div>
                        )}

                        {/* ── STEP 4: Success ─────────────────────────────── */}
                        {step === 4 && (
                            <div className="flex flex-col flex-1 items-center justify-center text-center py-4 space-y-4">
                                <div className="w-24 h-24 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center mb-2">
                                    <CheckCircle2 className="w-12 h-12 text-emerald-500" />
                                </div>
                                <div className="space-y-1">
                                    <h2 className="text-3xl font-black text-slate-900 dark:text-white">Pagamento confirmado!</h2>
                                    <p className="text-slate-500 max-w-xs mx-auto">
                                        Você comprou <strong>{selectedNumbers.length} número{selectedNumbers.length > 1 ? "s" : ""}</strong>. A confirmação foi enviada para o seu WhatsApp. Boa sorte! 🍀
                                    </p>
                                </div>
                                <div className="flex flex-wrap justify-center gap-2 mt-2">
                                    {selectedNumbers.slice(0, 8).map((n) => (
                                        <span key={n} className="bg-primary/10 text-primary px-3 py-1 rounded-full font-black text-sm">
                                            {String(n).padStart(3, "0")}
                                        </span>
                                    ))}
                                    {selectedNumbers.length > 8 && (
                                        <span className="bg-slate-100 text-slate-500 px-3 py-1 rounded-full font-bold text-sm">
                                            +{selectedNumbers.length - 8}
                                        </span>
                                    )}
                                </div>
                                <Button
                                    onClick={() => { onClose(); window.location.reload() }}
                                    size="lg"
                                    className="w-full max-w-xs h-12 rounded-xl font-bold mt-4"
                                >
                                    Voltar ao Sorteio
                                </Button>
                            </div>
                        )}
                    </div>

                    {/* ── RIGHT PANEL: Order Summary ─────────────────────── */}
                    {step < 4 && (
                        <div className="w-full lg:w-72 xl:w-80 bg-slate-50 dark:bg-slate-900 border-t lg:border-t-0 lg:border-l border-slate-100 dark:border-slate-800 flex flex-col shrink-0">
                            {/* Cover image */}
                            <div className="w-full h-40 overflow-hidden shrink-0 relative">
                                {rifaCover ? (
                                    <Image src={rifaCover} alt={rifaTitle} fill className="object-cover" />
                                ) : (
                                    <div className="w-full h-full bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center">
                                        <Sparkles className="w-10 h-10 text-white/30" />
                                    </div>
                                )}
                            </div>

                            <div className="p-6 flex flex-col flex-1">
                                {/* Title */}
                                <p className="text-[10px] font-black text-primary uppercase tracking-widest mb-1">Você está concorrendo a</p>
                                <h3 className="text-lg font-black text-slate-900 dark:text-white leading-tight mb-6">{rifaTitle}</h3>

                                {/* Numbers breakdown */}
                                <div className="space-y-4 border-t border-slate-200 dark:border-slate-700 pt-4">
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-slate-500">Quantidade</span>
                                        <span className="font-bold">{selectedNumbers.length} número{selectedNumbers.length > 1 ? "s" : ""}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-slate-500">Preço unitário</span>
                                        <span className="font-bold">{pricePerNumber}</span>
                                    </div>

                                    {/* Numbered chips */}
                                    <div className="bg-white dark:bg-slate-800 rounded-xl p-4">
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-1">
                                            <Ticket className="w-3 h-3" /> Seus números
                                        </p>
                                        <div className="flex flex-wrap gap-1.5">
                                            {selectedNumbers.slice(0, 12).map((n) => (
                                                <span key={n} className="bg-primary/10 text-primary px-2 py-0.5 rounded-full font-black text-xs">
                                                    {String(n).padStart(3, "0")}
                                                </span>
                                            ))}
                                            {selectedNumbers.length > 12 && (
                                                <span className="bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full font-bold text-xs">
                                                    +{selectedNumbers.length - 12} mais
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    {/* Total */}
                                    <div className="flex justify-between items-center pt-3 border-t border-slate-200 dark:border-slate-700">
                                        <span className="font-bold text-slate-900 dark:text-white">Total</span>
                                        <span className="text-2xl font-black text-emerald-600">{formattedTotal}</span>
                                    </div>
                                </div>

                                {/* Trust badge */}
                                <div className="mt-auto pt-4">
                                    <div className="bg-primary/5 rounded-xl p-4 flex items-start gap-3">
                                        <Shield className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                                        <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                                            Ao finalizar, você concorda com os <strong>Termos de Uso</strong> e as regras desta rifa. Seus dados estão protegidos.
                                        </p>
                                    </div>
                                    <div className="grid grid-cols-2 gap-2 mt-3">
                                        <div className="flex flex-col items-center p-3 bg-white dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700">
                                            <Shield className="w-4 h-4 text-primary mb-1" />
                                            <span className="text-[10px] font-bold text-slate-400 uppercase text-center">Site Seguro</span>
                                        </div>
                                        <div className="flex flex-col items-center p-3 bg-white dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700">
                                            <Lock className="w-4 h-4 text-primary mb-1" />
                                            <span className="text-[10px] font-bold text-slate-400 uppercase text-center">Dados Seguros</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    )
}
