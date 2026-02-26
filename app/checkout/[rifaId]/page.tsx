"use client"

import { useEffect, useState, useRef, use } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { processCheckoutAction } from "@/actions/checkout"
import {
    ArrowLeft,
    Check,
    CheckCircle2,
    Clock,
    Copy,
    CreditCard,
    FileText,
    Lock,
    Mail,
    Phone,
    QrCode,
    Shield,
    Sparkles,
    Ticket,
    User,
    ChevronRight,
} from "lucide-react"
import { cn } from "@/lib/utils"

const STEP_LABELS = ["Seus dados", "Pagamento", "PIX"]
const PAYMENT_EXPIRY_SECONDS = 30 * 60

interface CheckoutData {
    rifaId: string
    rifaTitle: string
    rifaCover: string | null
    rifaSlug: string
    numbers: number[]
    price: number
}

export default function CheckoutPage({ params }: { params: Promise<{ rifaId: string }> }) {
    const { rifaId: routeRifaId } = use(params)
    const router = useRouter()
    const [checkoutData, setCheckoutData] = useState<CheckoutData | null>(null)
    const [step, setStep] = useState<1 | 2 | 3 | 4>(1)
    const [buyerInfo, setBuyerInfo] = useState({ name: "", whatsapp: "", email: "" })
    const [paymentMethod, setPaymentMethod] = useState<"PIX" | "CREDIT_CARD" | "BOLETO" | null>(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")
    const [pixData, setPixData] = useState<{ qrCode?: string; qrCodeCopy?: string; txId?: string }>({})
    const [copied, setCopied] = useState(false)
    const [secondsLeft, setSecondsLeft] = useState(PAYMENT_EXPIRY_SECONDS)
    const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

    // Load data from sessionStorage
    useEffect(() => {
        const raw = sessionStorage.getItem(`checkout_${routeRifaId}`)
        if (!raw) {
            router.replace('/') // Redirect to home if no data
            return
        }
        try {
            setCheckoutData(JSON.parse(raw))
        } catch {
            router.replace('/')
        }
    }, [routeRifaId, router])

    // PIX countdown
    useEffect(() => {
        if (step === 3) {
            setSecondsLeft(PAYMENT_EXPIRY_SECONDS)
            timerRef.current = setInterval(() => {
                setSecondsLeft(s => {
                    if (s <= 1) { clearInterval(timerRef.current!); return 0 }
                    return s - 1
                })
            }, 1000)
        }
        return () => { if (timerRef.current) clearInterval(timerRef.current) }
    }, [step])

    if (!checkoutData) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent" />
            </div>
        )
    }

    const { rifaId, rifaTitle, rifaCover, rifaSlug, numbers, price } = checkoutData
    const total = numbers.length * price
    const formattedTotal = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(total)
    const pricePerNumber = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(price)
    const minutesLeft = String(Math.floor(secondsLeft / 60)).padStart(2, "0")
    const secsLeft = String(secondsLeft % 60).padStart(2, "0")

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
                numbers,
                name: buyerInfo.name,
                whatsapp: buyerInfo.whatsapp,
                email: buyerInfo.email,
                paymentMethod,
            })
            if (result.error) { setError(result.error); setLoading(false); return }
            if (paymentMethod === "PIX" && result.success) {
                setPixData({ qrCode: result.qrCode, qrCodeCopy: result.qrCodeCopy, txId: result.transactionId })
                setStep(3)
            }
        } catch { setError("Erro ao processar pagamento. Tente novamente.") }
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
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-20">
            {/* Header */}
            <header className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-100 dark:border-slate-800 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-2 font-black text-primary text-lg">
                        <div className="bg-primary p-1.5 rounded-lg text-white">
                            <Ticket className="w-5 h-5" />
                        </div>
                        MyRifa
                    </Link>
                    <nav className="hidden md:flex items-center gap-6 text-sm text-slate-500">
                        <Link href="/rifas" className="hover:text-primary transition-colors">Sorteios</Link>
                        <Link href="#" className="hover:text-primary transition-colors">Ajuda</Link>
                    </nav>
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider">
                        <Lock className="w-3.5 h-3.5 text-emerald-500" />
                        Pagamento Seguro
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 py-10 lg:px-8">
                {/* Breadcrumb + Title */}
                <div className="mb-10">
                    <div className="flex items-center gap-2 text-sm text-slate-500 mb-4">
                        <Link href={`/r/${rifaSlug}`} className="hover:text-primary flex items-center gap-1">
                            <ArrowLeft className="w-4 h-4" />
                            {rifaTitle}
                        </Link>
                        <ChevronRight className="w-4 h-4" />
                        <span className="text-primary font-semibold">Checkout</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
                        Finalizar Compra
                    </h1>
                    <p className="text-slate-500 mt-2 text-lg">Garanta seus números agora com segurança.</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    {/* ── LEFT COLUMN ─────────────────────────────────────── */}
                    <div className="lg:col-span-8 space-y-6">
                        {/* Step Indicator */}
                        {step < 4 && (
                            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm p-6">
                                <div className="flex flex-col md:flex-row justify-between gap-4 md:items-center">
                                    {STEP_LABELS.map((label, i) => {
                                        const stepNum = (i + 1) as 1 | 2 | 3
                                        const done = step > stepNum
                                        const active = step === stepNum
                                        return (
                                            <div key={label} className="flex items-center gap-2 flex-1">
                                                <span className={cn(
                                                    "w-8 h-8 rounded-full text-sm font-black flex items-center justify-center shrink-0 transition-all",
                                                    active ? "bg-primary text-white shadow-lg shadow-primary/30" :
                                                        done ? "bg-emerald-500 text-white" :
                                                            "bg-slate-100 dark:bg-slate-800 text-slate-400"
                                                )}>
                                                    {done ? <Check className="w-4 h-4" /> : stepNum}
                                                </span>
                                                <span className={cn(
                                                    "font-bold text-sm",
                                                    active ? "text-primary" : done ? "text-emerald-600" : "text-slate-400"
                                                )}>{label}</span>
                                                {i < STEP_LABELS.length - 1 && (
                                                    <div className="hidden md:block flex-1 h-px bg-slate-100 dark:bg-slate-800 mx-4" />
                                                )}
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>
                        )}

                        {/* ── STEP 1: Buyer data ─────────────────────────── */}
                        {step === 1 && (
                            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm p-8">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                                        <User className="w-5 h-5" />
                                    </div>
                                    <h2 className="text-xl font-black text-slate-900 dark:text-white">1. Seus dados</h2>
                                </div>

                                <form onSubmit={handleNextStep1} className="space-y-5">
                                    <div className="grid md:grid-cols-2 gap-5">
                                        <div className="space-y-1.5">
                                            <Label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Nome Completo *</Label>
                                            <div className="relative">
                                                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                                <Input
                                                    value={buyerInfo.name}
                                                    onChange={e => setBuyerInfo({ ...buyerInfo, name: e.target.value })}
                                                    placeholder="João da Silva Santos"
                                                    className="pl-10 h-13 rounded-xl"
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
                                                    onChange={e => setBuyerInfo({ ...buyerInfo, whatsapp: e.target.value })}
                                                    placeholder="(11) 99999-0000"
                                                    className="pl-10 h-13 rounded-xl"
                                                    required
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="space-y-1.5">
                                        <Label className="text-xs font-bold text-slate-500 uppercase tracking-wider">E-mail (opcional)</Label>
                                        <div className="relative">
                                            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                            <Input
                                                type="email"
                                                value={buyerInfo.email}
                                                onChange={e => setBuyerInfo({ ...buyerInfo, email: e.target.value })}
                                                placeholder="Para receber o comprovante"
                                                className="pl-10 h-13 rounded-xl"
                                            />
                                        </div>
                                    </div>

                                    {error && <p className="text-sm text-red-500">{error}</p>}

                                    <div className="flex justify-between items-center pt-4 border-t border-slate-100 dark:border-slate-800">
                                        <Link href={`/r/${rifaSlug}`} className="flex items-center gap-2 text-slate-500 hover:text-primary font-bold transition-colors text-sm">
                                            <ArrowLeft className="w-4 h-4" />
                                            Voltar ao sorteio
                                        </Link>
                                        <Button type="submit" size="lg" className="h-12 px-8 rounded-xl font-bold gap-2">
                                            Continuar <ChevronRight className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </form>
                            </div>
                        )}

                        {/* ── STEP 2: Payment method ──────────────────────── */}
                        {step === 2 && (
                            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm p-8">
                                <div className="flex items-center gap-3 mb-8">
                                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                                        <CreditCard className="w-5 h-5" />
                                    </div>
                                    <h2 className="text-xl font-black text-slate-900 dark:text-white">2. Forma de pagamento</h2>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                                    {/* PIX */}
                                    <button
                                        onClick={() => setPaymentMethod("PIX")}
                                        className={cn(
                                            "relative border-2 p-5 rounded-2xl cursor-pointer transition-all flex flex-col items-center text-center gap-2",
                                            paymentMethod === "PIX"
                                                ? "border-primary bg-primary/5"
                                                : "border-slate-100 dark:border-slate-800 hover:border-primary/30"
                                        )}
                                    >
                                        <div className="absolute -top-3 right-4 bg-emerald-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full uppercase">Instantâneo</div>
                                        <QrCode className={cn("w-8 h-8", paymentMethod === "PIX" ? "text-primary" : "text-slate-400")} />
                                        <span className={cn("font-black", paymentMethod === "PIX" ? "text-primary" : "text-slate-600 dark:text-slate-400")}>PIX</span>
                                        {paymentMethod === "PIX" && <CheckCircle2 className="absolute top-2 left-2 w-4 h-4 text-primary" />}
                                    </button>

                                    {/* Card */}
                                    <button
                                        onClick={() => setPaymentMethod("CREDIT_CARD")}
                                        className={cn(
                                            "border-2 p-5 rounded-2xl cursor-pointer transition-all flex flex-col items-center text-center gap-2",
                                            paymentMethod === "CREDIT_CARD"
                                                ? "border-primary bg-primary/5"
                                                : "border-slate-100 dark:border-slate-800 hover:border-primary/30"
                                        )}
                                    >
                                        <CreditCard className={cn("w-8 h-8", paymentMethod === "CREDIT_CARD" ? "text-primary" : "text-slate-400")} />
                                        <span className={cn("font-black", paymentMethod === "CREDIT_CARD" ? "text-primary" : "text-slate-600 dark:text-slate-400")}>Cartão até 12x</span>
                                    </button>

                                    {/* Boleto */}
                                    <button
                                        onClick={() => setPaymentMethod("BOLETO")}
                                        className={cn(
                                            "border-2 p-5 rounded-2xl cursor-pointer transition-all flex flex-col items-center text-center gap-2",
                                            paymentMethod === "BOLETO"
                                                ? "border-primary bg-primary/5"
                                                : "border-slate-100 dark:border-slate-800 hover:border-primary/30"
                                        )}
                                    >
                                        <FileText className={cn("w-8 h-8", paymentMethod === "BOLETO" ? "text-primary" : "text-slate-400")} />
                                        <span className={cn("font-black", paymentMethod === "BOLETO" ? "text-primary" : "text-slate-600 dark:text-slate-400")}>Boleto</span>
                                    </button>
                                </div>

                                {/* PIX Detail block */}
                                <div className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-8 flex flex-col items-center text-center">
                                    <h3 className="text-lg font-black mb-2">Pague com PIX</h3>
                                    <p className="text-slate-500 text-sm max-w-sm mb-6">Escaneie o QR Code com o aplicativo do seu banco para confirmar a participação.</p>

                                    <div className="bg-white p-4 rounded-2xl shadow-xl mb-6 ring-4 ring-primary/5">
                                        <Image
                                            src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=pagamento_demo`}
                                            alt="QR Code Preview"
                                            width={200}
                                            height={200}
                                            className="rounded-xl opacity-40"
                                            unoptimized
                                        />
                                    </div>

                                    {error && <p className="text-sm text-red-500 mb-4">{error}</p>}

                                    <div className="flex flex-col gap-4 w-full max-w-sm">
                                        <Button
                                            onClick={handleProcessPayment}
                                            disabled={!paymentMethod || loading}
                                            size="lg"
                                            className="w-full h-13 rounded-xl font-black gap-2"
                                        >
                                            {loading ? (
                                                <><span className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" /> Processando...</>
                                            ) : (
                                                <><Check className="w-5 h-5" /> Pagar Agora</>
                                            )}
                                        </Button>
                                    </div>
                                </div>

                                <div className="flex justify-between items-center pt-6 border-t border-slate-100 dark:border-slate-800 mt-6">
                                    <button onClick={() => setStep(1)} className="flex items-center gap-2 text-slate-500 hover:text-primary font-bold transition-colors text-sm">
                                        <ArrowLeft className="w-4 h-4" />
                                        Voltar
                                    </button>
                                    <div className="flex items-center gap-2 text-slate-400 text-xs font-bold uppercase tracking-wider">
                                        <Lock className="w-3.5 h-3.5 text-emerald-500" />
                                        Pagamento 100% Seguro
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* ── STEP 3: PIX QR code ─────────────────────────── */}
                        {step === 3 && (
                            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm p-8">
                                <div className="flex flex-col items-center text-center">
                                    <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-2">Pague com PIX</h2>
                                    <p className="text-slate-500 text-sm mb-8 max-w-sm">
                                        Escaneie o QR Code com o app do seu banco para confirmar a participação.
                                    </p>

                                    {/* QR Code */}
                                    <div className="bg-white p-5 rounded-2xl shadow-xl ring-4 ring-primary/10 mb-6">
                                        <div className="w-52 h-52 relative">
                                            {pixData.qrCode ? (
                                                <Image
                                                    src={`data:image/jpeg;base64,${pixData.qrCode}`}
                                                    alt="QR Code PIX"
                                                    fill
                                                    className="object-contain rounded-xl"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center">
                                                    <QrCode className="w-16 h-16 text-slate-300" />
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Copy code */}
                                    <div className="flex items-center gap-2 w-full max-w-md bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 mb-4">
                                        <code className="text-xs text-slate-600 dark:text-slate-400 flex-1 truncate font-mono">
                                            {pixData.qrCodeCopy ?? "Gerando código..."}
                                        </code>
                                        <button onClick={copyToClipboard} className="text-primary hover:text-primary/80 shrink-0 ml-2">
                                            {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                                        </button>
                                    </div>
                                    {copied && <p className="text-xs text-emerald-600 font-bold mb-3">Código copiado!</p>}

                                    {/* Timer */}
                                    <div className="flex items-center gap-2 text-slate-500 text-sm mb-6">
                                        <Clock className="w-4 h-4 text-primary" />
                                        Expira em{" "}
                                        <span className={cn("font-black tabular-nums ml-1", secondsLeft < 300 ? "text-red-500" : "text-primary")}>
                                            {minutesLeft}:{secsLeft}
                                        </span>
                                    </div>

                                    {/* Waiting */}
                                    <div className="flex items-center gap-2 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 text-xs p-3 rounded-xl w-full max-w-md">
                                        <span className="animate-spin rounded-full h-3 w-3 border-2 border-blue-600 border-t-transparent shrink-0" />
                                        Aguardando confirmação do pagamento... Esta tela será atualizada automaticamente.
                                    </div>

                                    <button onClick={() => setStep(4)} className="mt-6 text-xs text-slate-300 hover:text-slate-500 underline">
                                        Simular aprovação (Dev)
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* ── STEP 4: Success ─────────────────────────────── */}
                        {step === 4 && (
                            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm p-12 flex flex-col items-center text-center space-y-6">
                                <div className="w-24 h-24 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                                    <CheckCircle2 className="w-12 h-12 text-emerald-500" />
                                </div>
                                <div>
                                    <h2 className="text-4xl font-black text-slate-900 dark:text-white">Pagamento Confirmado!</h2>
                                    <p className="text-slate-500 mt-2 max-w-md mx-auto">
                                        Sua compra de <strong>{numbers.length} número{numbers.length > 1 ? "s" : ""}</strong> foi recebida. A confirmação foi enviada para o seu WhatsApp. Boa sorte! 🍀
                                    </p>
                                </div>
                                <div className="flex flex-wrap justify-center gap-2">
                                    {numbers.slice(0, 12).map(n => (
                                        <span key={n} className="bg-primary/10 text-primary px-3 py-1 rounded-full font-black text-sm">
                                            {String(n).padStart(3, "0")}
                                        </span>
                                    ))}
                                    {numbers.length > 12 && (
                                        <span className="bg-slate-100 text-slate-500 px-3 py-1 rounded-full font-bold text-sm">+{numbers.length - 12} mais</span>
                                    )}
                                </div>
                                <Button asChild size="lg" className="h-13 px-10 rounded-xl font-black">
                                    <Link href={`/r/${rifaSlug}`}>Voltar ao Sorteio</Link>
                                </Button>
                            </div>
                        )}
                    </div>

                    {/* ── RIGHT COLUMN: Order Summary ──────────────────────── */}
                    {step < 4 && (
                        <div className="lg:col-span-4 sticky top-24">
                            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden">
                                {/* Cover */}
                                <div className="w-full h-48 relative overflow-hidden">
                                    {rifaCover ? (
                                        <Image src={rifaCover} alt={rifaTitle} fill className="object-cover" />
                                    ) : (
                                        <div className="w-full h-full bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center">
                                            <Sparkles className="w-12 h-12 text-white/30" />
                                        </div>
                                    )}
                                </div>

                                <div className="p-6">
                                    <p className="text-[10px] font-black text-primary uppercase tracking-widest mb-1">Você está concorrendo a</p>
                                    <h3 className="text-xl font-black text-slate-900 dark:text-white leading-tight mb-6">{rifaTitle}</h3>

                                    <div className="space-y-4 border-t border-slate-100 dark:border-slate-800 pt-6">
                                        <div className="flex justify-between items-center text-sm">
                                            <span className="text-slate-500">Quantidade</span>
                                            <span className="font-bold">{numbers.length} número{numbers.length > 1 ? "s" : ""} selecionados</span>
                                        </div>

                                        {/* Number chips */}
                                        <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-xl">
                                            <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-3 flex items-center gap-1.5">
                                                <Ticket className="w-3 h-3" /> Seus números
                                            </p>
                                            <div className="flex flex-wrap gap-1.5">
                                                {numbers.slice(0, 12).map(n => (
                                                    <span key={n} className="bg-primary/10 text-primary px-2.5 py-0.5 rounded-full font-black text-xs">
                                                        {String(n).padStart(3, "0")}
                                                    </span>
                                                ))}
                                                {numbers.length > 12 && (
                                                    <span className="bg-slate-200 text-slate-500 px-2.5 py-0.5 rounded-full font-bold text-xs">
                                                        +{numbers.length - 12}
                                                    </span>
                                                )}
                                            </div>
                                        </div>

                                        {/* Price per number */}
                                        <div className="flex justify-between items-center text-sm">
                                            <span className="text-slate-500">Valor por número</span>
                                            <span className="font-bold">{pricePerNumber}</span>
                                        </div>

                                        {/* Total */}
                                        <div className="flex justify-between items-center pt-4 border-t border-slate-100 dark:border-slate-800">
                                            <span className="text-lg font-black text-slate-900 dark:text-white">Total</span>
                                            <span className="text-2xl font-black text-emerald-600">{formattedTotal}</span>
                                        </div>
                                    </div>

                                    {/* Terms */}
                                    <div className="mt-6 p-4 bg-primary/5 rounded-xl flex items-start gap-3">
                                        <Shield className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                                        <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                                            Ao finalizar a compra, você concorda com os <strong>Termos de Uso</strong> e as regras deste sorteio. Seus dados estão protegidos.
                                        </p>
                                    </div>

                                    {/* Trust badges */}
                                    <div className="grid grid-cols-2 gap-3 mt-4">
                                        <div className="flex flex-col items-center p-3 bg-white dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700">
                                            <Shield className="w-5 h-5 text-primary mb-1" />
                                            <span className="text-[10px] font-bold text-slate-400 uppercase">Site Seguro</span>
                                        </div>
                                        <div className="flex flex-col items-center p-3 bg-white dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700">
                                            <Lock className="w-5 h-5 text-primary mb-1" />
                                            <span className="text-[10px] font-bold text-slate-400 uppercase">Suporte 24/7</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </main>

            {/* Footer */}
            <footer className="bg-white dark:bg-slate-950 py-12 border-t border-slate-100 dark:border-slate-800 mt-20">
                <div className="max-w-7xl mx-auto px-4 text-center">
                    <div className="flex justify-center items-center gap-2 text-primary font-black mb-4">
                        <Ticket className="w-5 h-5" />
                        MyRifa
                    </div>
                    <p className="text-slate-400 text-sm max-w-md mx-auto leading-relaxed">
                        MyRifa Intermediações LTDA.<br />
                        A sorte está a um clique de distância. Jogue com responsabilidade.
                    </p>
                </div>
            </footer>
        </div>
    )
}
