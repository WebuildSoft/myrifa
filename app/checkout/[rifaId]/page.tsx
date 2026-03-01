"use client"

import { useEffect, useState, useRef, use } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, ChevronRight, Ticket } from "lucide-react"

import { processCheckoutAction, checkPaymentStatusAction } from "@/actions/checkout"
import { CheckoutHeader } from "@/components/checkout/CheckoutHeader"
import { CheckoutSteps } from "@/components/checkout/CheckoutSteps"
import { OrderSummary } from "@/components/checkout/OrderSummary"
import { StepBuyerInfo } from "@/components/checkout/StepBuyerInfo"
import { StepPaymentMethod } from "@/components/checkout/StepPaymentMethod"
import { StepPixPayment } from "@/components/checkout/StepPixPayment"
import { StepSuccess } from "@/components/checkout/StepSuccess"

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

    // State
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
            router.replace('/')
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

    // PIX Payment Status Polling
    useEffect(() => {
        let pollingInterval: NodeJS.Timeout

        if (step === 3 && pixData.txId) {
            // Check status every 3 seconds
            pollingInterval = setInterval(async () => {
                try {
                    const result = await checkPaymentStatusAction(pixData.txId!)
                    if (result.status === "PAID") {
                        clearInterval(pollingInterval)
                        setStep(4)
                    }
                } catch (error) {
                    console.error("Error polling payment status:", error)
                }
            }, 3000)
        }

        return () => {
            if (pollingInterval) clearInterval(pollingInterval)
        }
    }, [step, pixData.txId])

    if (!checkoutData) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent" />
            </div>
        )
    }

    const handleNextStep1 = (e: React.FormEvent) => {
        e.preventDefault()
        setError("")
        if (!buyerInfo.name.trim()) { setError("Informe seu nome."); return }
        if (!buyerInfo.whatsapp.trim()) { setError("Informe seu WhatsApp."); return }
        setStep(2)
    }

    const handleProcessPayment = async () => {
        if (!paymentMethod || !checkoutData) return
        setError("")
        setLoading(true)
        try {
            const result = await processCheckoutAction({
                rifaId: checkoutData.rifaId,
                numbers: checkoutData.numbers,
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
                setPixData({
                    qrCode: result.qrCode,
                    qrCodeCopy: result.qrCodeCopy,
                    txId: result.transactionId
                })
                setStep(3)
            }
        } catch {
            setError("Erro ao processar pagamento. Tente novamente.")
        }
        setLoading(false)
    }

    const handleCopyPix = () => {
        if (pixData.qrCodeCopy) {
            navigator.clipboard.writeText(pixData.qrCodeCopy)
            setCopied(true)
            setTimeout(() => setCopied(false), 2500)
        }
    }

    const minutesLeft = String(Math.floor(secondsLeft / 60)).padStart(2, "0")
    const secsLeft = String(secondsLeft % 60).padStart(2, "0")

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-20">
            <CheckoutHeader />

            <main className="max-w-7xl mx-auto px-4 py-10 lg:px-8">
                {/* Title Section */}
                <div className="mb-10">
                    <div className="flex items-center gap-2 text-sm text-slate-500 mb-4">
                        <Link href={`/r/${checkoutData.rifaSlug}`} className="hover:text-primary flex items-center gap-1">
                            <ArrowLeft className="w-4 h-4" />
                            {checkoutData.rifaTitle}
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
                    <div className="lg:col-span-8 space-y-6">
                        <CheckoutSteps currentStep={step} />

                        {step === 1 && (
                            <StepBuyerInfo
                                buyerInfo={buyerInfo}
                                setBuyerInfo={setBuyerInfo}
                                rifaSlug={checkoutData.rifaSlug}
                                onNext={handleNextStep1}
                                error={error}
                            />
                        )}

                        {step === 2 && (
                            <StepPaymentMethod
                                paymentMethod={paymentMethod}
                                setPaymentMethod={setPaymentMethod}
                                onProcess={handleProcessPayment}
                                onBack={() => setStep(1)}
                                loading={loading}
                                error={error}
                            />
                        )}

                        {step === 3 && (
                            <StepPixPayment
                                pixData={pixData}
                                secondsLeft={secondsLeft}
                                minutesLeft={minutesLeft}
                                secsLeft={secsLeft}
                                copied={copied}
                                onCopy={handleCopyPix}
                            />
                        )}

                        {step === 4 && (
                            <StepSuccess
                                numbers={checkoutData.numbers}
                                rifaSlug={checkoutData.rifaSlug}
                            />
                        )}
                    </div>

                    <div className="lg:col-span-4 sticky top-24">
                        {step < 4 && (
                            <OrderSummary
                                rifaTitle={checkoutData.rifaTitle}
                                rifaCover={checkoutData.rifaCover}
                                numbers={checkoutData.numbers}
                                price={checkoutData.price}
                            />
                        )}
                    </div>
                </div>
            </main>

            <footer className="bg-white dark:bg-slate-950 py-12 border-t border-slate-100 dark:border-slate-800 mt-20">
                <div className="max-w-7xl mx-auto px-4 text-center">
                    <div className="flex justify-center items-center gap-2 text-primary font-black mb-4">
                        <Ticket className="w-5 h-5" />
                        MyRifa
                    </div>
                    <p className="text-slate-400 text-sm max-w-md mx-auto leading-relaxed">
                        MyRifa Intermediações LTDA.<br />
                        Sua contribuição faz a diferença. Apoie com responsabilidade.
                    </p>
                </div>
            </footer>
        </div>
    )
}
