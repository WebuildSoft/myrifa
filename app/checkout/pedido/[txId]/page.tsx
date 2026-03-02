"use client"

import { useEffect, useState, use } from "react"
import Link from "next/link"
import { ArrowLeft, Ticket, CheckCircle2, Clock, AlertCircle, Copy, Check } from "lucide-react"
import { getTransactionDetailsAction, checkPaymentStatusAction } from "@/actions/checkout"
import { Button } from "@/components/ui/button"
import { CheckoutHeader } from "@/components/checkout/CheckoutHeader"
import { OrderSummary } from "@/components/checkout/OrderSummary"
import { StepPixPayment } from "@/components/checkout/StepPixPayment"
import { StepSuccess } from "@/components/checkout/StepSuccess"
import Image from "next/image"

export default function OrderCheckoutPage({ params }: { params: Promise<{ txId: string }> }) {
    const { txId } = use(params)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [transaction, setTransaction] = useState<any>(null)
    const [copied, setCopied] = useState(false)

    useEffect(() => {
        const fetchDetails = async () => {
            const result = await getTransactionDetailsAction(txId)
            if (result.error) {
                setError(result.error)
            } else {
                setTransaction(result.transaction)
            }
            setLoading(false)
        }
        fetchDetails()
    }, [txId])

    // Polling for status
    useEffect(() => {
        let interval: NodeJS.Timeout
        if (transaction && transaction.status === "PENDING") {
            interval = setInterval(async () => {
                const result = await checkPaymentStatusAction(txId)
                if (result.status === "PAID") {
                    setTransaction((prev: any) => ({ ...prev, status: "PAID" }))
                    clearInterval(interval)
                }
            }, 3000)
        }
        return () => { if (interval) clearInterval(interval) }
    }, [transaction, txId])

    const handleCopyPix = () => {
        if (transaction?.pixQrCodeText) {
            navigator.clipboard.writeText(transaction.pixQrCodeText)
            setCopied(true)
            setTimeout(() => setCopied(false), 2500)
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
                <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent" />
            </div>
        )
    }

    if (error || !transaction) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-950 p-6 text-center">
                <AlertCircle className="w-16 h-16 text-red-500 mb-4" />
                <h1 className="text-2xl font-black text-slate-900 dark:text-white mb-2">Pedido não encontrado</h1>
                <p className="text-slate-500 mb-8 max-w-sm">{error || "Não conseguimos localizar os detalhes deste pedido."}</p>
                <Button asChild>
                    <Link href="/">Voltar para o Início</Link>
                </Button>
            </div>
        )
    }

    const isPaid = transaction.status === "PAID"
    const isExpired = transaction.status === "EXPIRED" || transaction.status === "CANCELLED"
    const isPending = transaction.status === "PENDING"

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-20">
            <CheckoutHeader />

            <main className="max-w-7xl mx-auto px-4 py-10 lg:px-8">
                <div className="mb-10">
                    <div className="flex items-center gap-2 text-sm text-slate-500 mb-4">
                        <Link href={`/r/${transaction.rifa.slug}`} className="hover:text-primary flex items-center gap-1">
                            <ArrowLeft className="w-4 h-4" />
                            {transaction.rifa.title}
                        </Link>
                    </div>
                    <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">
                        {isPaid ? "Pagamento Confirmado!" : "Finalizar Pagamento"}
                    </h1>
                    <p className="text-slate-500 mt-2 text-lg">
                        Pedido #{transaction.id.slice(-6).toUpperCase()}
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    <div className="lg:col-span-8 space-y-6">
                        {isPaid && (
                            <StepSuccess
                                numbers={transaction.numbers}
                                rifaSlug={transaction.rifa.slug}
                            />
                        )}

                        {isPending && (
                            <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 md:p-12 border border-slate-100 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-none text-center space-y-8 animate-in fade-in zoom-in-95 duration-500">
                                <div className="space-y-2">
                                    <div className="size-16 bg-amber-500/10 rounded-3xl flex items-center justify-center mx-auto mb-4">
                                        <Clock className="w-8 h-8 text-amber-500 animate-pulse" />
                                    </div>
                                    <h2 className="text-3xl font-black text-slate-900 dark:text-white">Aguardando Pagamento</h2>
                                    <p className="text-slate-500 font-medium">Use o QR Code ou Copia e Cola abaixo para pagar.</p>
                                </div>

                                {transaction.pixQrCode && (
                                    <div className="relative inline-block p-4 bg-white rounded-3xl border-4 border-slate-50 shadow-inner">
                                        <Image
                                            src={transaction.pixQrCode.startsWith('http') ? transaction.pixQrCode : `data:image/png;base64,${transaction.pixQrCode}`}
                                            alt="QR Code PIX"
                                            width={240}
                                            height={240}
                                            className="rounded-xl"
                                        />
                                    </div>
                                )}

                                <div className="max-w-md mx-auto space-y-4">
                                    <div className="text-left space-y-2">
                                        <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">PIX Copia e Cola</label>
                                        <div className="flex gap-2">
                                            <div className="flex-1 bg-slate-50 dark:bg-slate-800 px-4 py-4 rounded-2xl border border-slate-200 dark:border-slate-700 font-mono text-sm break-all line-clamp-2 text-slate-600 dark:text-slate-300">
                                                {transaction.pixQrCodeText || "Gerando código..."}
                                            </div>
                                            <Button
                                                onClick={handleCopyPix}
                                                className={cn(
                                                    "h-auto px-6 rounded-2xl transition-all font-bold",
                                                    copied ? "bg-emerald-500 hover:bg-emerald-600" : "bg-primary hover:bg-primary/90"
                                                )}
                                            >
                                                {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                                            </Button>
                                        </div>
                                    </div>
                                </div>

                                <div className="pt-8 border-t border-slate-100 dark:border-slate-800 grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div className="text-center space-y-1">
                                        <div className="text-[10px] font-black uppercase tracking-widest text-slate-400">Status</div>
                                        <div className="text-sm font-bold text-amber-500">Pendente</div>
                                    </div>
                                    <div className="text-center space-y-1">
                                        <div className="text-[10px] font-black uppercase tracking-widest text-slate-400">Expira em</div>
                                        <div className="text-sm font-bold text-slate-700 dark:text-slate-200">30 minutos</div>
                                    </div>
                                    <div className="text-center space-y-1">
                                        <div className="text-[10px] font-black uppercase tracking-widest text-slate-400">Total</div>
                                        <div className="text-sm font-black text-primary">R$ {Number(transaction.amount).toFixed(2).replace('.', ',')}</div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {isExpired && (
                            <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-12 border border-slate-100 dark:border-slate-800 text-center space-y-6">
                                <AlertCircle className="w-16 h-16 text-slate-300 mx-auto" />
                                <h2 className="text-2xl font-black text-slate-900 dark:text-white">Este pedido expirou</h2>
                                <p className="text-slate-500">As cotas foram liberadas para outros compradores. Por favor, realize uma nova reserva.</p>
                                <Button asChild variant="outline">
                                    <Link href={`/r/${transaction.rifa.slug}`}>Ver Campanha</Link>
                                </Button>
                            </div>
                        )}
                    </div>

                    <div className="lg:col-span-4 sticky top-24">
                        <OrderSummary
                            rifaTitle={transaction.rifa.title}
                            rifaCover={transaction.rifa.coverImage}
                            numbers={transaction.numbers}
                            price={Number(transaction.amount) / transaction.numbers.length}
                        />
                    </div>
                </div>
            </main>
        </div>
    )
}

function cn(...classes: any[]) {
    return classes.filter(Boolean).join(" ")
}
