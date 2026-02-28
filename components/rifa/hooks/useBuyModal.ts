"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { processCheckoutAction } from "@/actions/checkout"

export type Step = 1 | 2 | 3 | 4
export type PaymentMethod = "PIX" | "CREDIT_CARD" | "BOLETO"

interface UseBuyModalProps {
    rifaId: string
    selectedNumbers: number[]
    expirySeconds: number
}

export function useBuyModal({
    rifaId,
    selectedNumbers,
    expirySeconds,
}: UseBuyModalProps) {
    const [step, setStep] = useState<Step>(1)
    const [buyerInfo, setBuyerInfo] = useState({ name: "", whatsapp: "", email: "" })
    const [paymentMethod, setPaymentMethod] = useState<PaymentMethod | null>(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")
    const [pixData, setPixData] = useState<{ qrCode?: string; qrCodeCopy?: string; txId?: string }>({})
    const [copied, setCopied] = useState(false)
    const [secondsLeft, setSecondsLeft] = useState(expirySeconds)
    const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

    // Countdown timer logic
    const startTimer = useCallback(() => {
        setSecondsLeft(expirySeconds)
        if (timerRef.current) clearInterval(timerRef.current)

        timerRef.current = setInterval(() => {
            setSecondsLeft((s) => {
                if (s <= 1) {
                    if (timerRef.current) clearInterval(timerRef.current)
                    return 0
                }
                return s - 1
            })
        }, 1000)
    }, [expirySeconds])

    useEffect(() => {
        if (step === 3) {
            startTimer()
        }
        return () => {
            if (timerRef.current) clearInterval(timerRef.current)
        }
    }, [step, startTimer])

    const nextStep = useCallback(() => {
        setStep((s) => (s < 4 ? (s + 1) as Step : s))
    }, [])

    const prevStep = useCallback(() => {
        setStep((s) => (s > 1 ? (s - 1) as Step : s))
    }, [])

    const handleUserDataSubmit = useCallback((e: React.FormEvent) => {
        e.preventDefault()
        setError("")
        if (!buyerInfo.name.trim()) { setError("Informe seu nome."); return }
        if (!buyerInfo.whatsapp.trim()) { setError("Informe seu WhatsApp."); return }
        setStep(2)
    }, [buyerInfo])

    const handleProcessPayment = useCallback(async () => {
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
                setPixData({
                    qrCode: result.qrCode,
                    qrCodeCopy: result.qrCodeCopy,
                    txId: result.transactionId
                })
                setStep(3)
            } else if (result.success) {
                // If other methods succeed instantly or have different success flows
                setStep(4)
            }
        } catch (err) {
            console.error("Payment processing error:", err)
            setError("Erro ao processar pagamento. Tente novamente.")
        } finally {
            setLoading(false)
        }
    }, [rifaId, selectedNumbers, buyerInfo, paymentMethod])

    const copyToClipboard = useCallback(() => {
        if (pixData.qrCodeCopy) {
            navigator.clipboard.writeText(pixData.qrCodeCopy)
            setCopied(true)
            setTimeout(() => setCopied(false), 2500)
        }
    }, [pixData.qrCodeCopy])

    return {
        step,
        setStep,
        buyerInfo,
        setBuyerInfo,
        paymentMethod,
        setPaymentMethod,
        loading,
        error,
        pixData,
        copied,
        secondsLeft,
        handleUserDataSubmit,
        handleProcessPayment,
        copyToClipboard,
        nextStep,
        prevStep,
    }
}
