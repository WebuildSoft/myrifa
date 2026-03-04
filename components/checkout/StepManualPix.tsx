"use client"

import Image from "next/image"
import { QrCode, Copy, Check, CheckCircle, Clock, Smartphone, MessageCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { buyerConfirmPaymentAction } from "@/actions/confirm-payment"

interface StepManualPixProps {
    transactionId: string
    pixKey: string | null
    pixQrCodeImage: string | null
    primaryColor?: string | null
    onConfirmed: () => void
}

export function StepManualPix({ transactionId, pixKey, pixQrCodeImage, primaryColor, onConfirmed }: StepManualPixProps) {
    const [copied, setCopied] = useState(false)
    const [confirming, setConfirming] = useState(false)
    const [confirmed, setConfirmed] = useState(false)
    const [error, setError] = useState("")

    const handleCopy = () => {
        if (pixKey) {
            navigator.clipboard.writeText(pixKey)
            setCopied(true)
            setTimeout(() => setCopied(false), 2500)
        }
    }

    const handleConfirmPayment = async () => {
        setConfirming(true)
        setError("")
        try {
            const result = await buyerConfirmPaymentAction(transactionId)
            if (result.error) {
                setError(result.error)
            } else {
                setConfirmed(true)
                setTimeout(() => onConfirmed(), 1500)
            }
        } catch {
            setError("Erro ao confirmar. Tente novamente.")
        }
        setConfirming(false)
    }

    return (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm p-8">
            <div className="flex flex-col items-center text-center">
                <div
                    className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4"
                    style={{ backgroundColor: `${primaryColor || '#7c3aed'}15` }}
                >
                    <QrCode className="w-7 h-7" style={{ color: primaryColor || '#7c3aed' }} />
                </div>

                <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-2">
                    Pague com PIX
                </h2>
                <p className="text-slate-500 text-sm mb-8 max-w-sm">
                    Realize o pagamento via PIX para o organizador da campanha e depois clique em <strong>"Já Paguei"</strong>.
                    O organizador confirmará sua participação em breve.
                </p>

                {/* QR Code do organizador */}
                {pixQrCodeImage && (
                    <div
                        className="bg-white p-5 rounded-2xl shadow-xl mb-6"
                        style={{ border: `1px solid ${primaryColor || '#7c3aed'}20` }}
                    >
                        <div className="w-52 h-52 relative">
                            <Image
                                src={pixQrCodeImage}
                                alt="QR Code PIX do organizador"
                                fill
                                className="object-contain rounded-xl"
                                unoptimized
                            />
                        </div>
                    </div>
                )}

                {/* Chave PIX copiável */}
                {pixKey && (
                    <div className="w-full max-w-sm mb-6">
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">
                            Chave PIX
                        </p>
                        <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3">
                            <code className="text-sm text-slate-700 dark:text-slate-300 flex-1 truncate font-mono">
                                {pixKey}
                            </code>
                            <button onClick={handleCopy} className="hover:opacity-80 shrink-0 ml-2" style={{ color: primaryColor || '#7c3aed' }}>
                                {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                            </button>
                        </div>
                        {copied && <p className="text-xs text-emerald-600 font-bold mt-2">Chave copiada!</p>}
                    </div>
                )}

                {!pixKey && !pixQrCodeImage && (
                    <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700/30 rounded-xl p-4 mb-6 text-sm text-amber-700 dark:text-amber-300">
                        O organizador ainda não configurou os dados de PIX. Entre em contato diretamente.
                    </div>
                )}

                {/* Instruções */}
                <div className="w-full max-w-sm mb-8 space-y-2 text-left">
                    {[
                        { icon: Smartphone, text: "Abra o app do seu banco e acesse a seção PIX" },
                        { icon: QrCode, text: "Escaneie o QR Code acima ou cole a chave PIX" },
                        { icon: Check, text: "Confirme o valor e finalize o pagamento" },
                        { icon: MessageCircle, text: "Clique em \"Já Paguei\" abaixo para notificar o organizador" },
                    ].map(({ icon: Icon, text }, i) => (
                        <div key={i} className="flex items-start gap-3">
                            <div
                                className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5"
                                style={{ backgroundColor: `${primaryColor || '#7c3aed'}15` }}
                            >
                                <Icon className="w-3.5 h-3.5" style={{ color: primaryColor || '#7c3aed' }} />
                            </div>
                            <span className="text-sm text-slate-500 dark:text-slate-400">{text}</span>
                        </div>
                    ))}
                </div>

                {error && <p className="text-sm text-red-500 font-bold mb-4">{error}</p>}

                {confirmed ? (
                    <div className="flex items-center gap-3 text-emerald-600 font-black text-lg animate-in fade-in">
                        <CheckCircle className="w-6 h-6" />
                        Confirmado! Aguarde a validação do organizador.
                    </div>
                ) : (
                    <Button
                        onClick={handleConfirmPayment}
                        disabled={confirming || (!pixKey && !pixQrCodeImage)}
                        size="lg"
                        className="w-full max-w-sm h-14 rounded-xl font-black gap-2 text-base shadow-lg active:scale-95 transition-all"
                        style={{
                            backgroundColor: primaryColor || '#7c3aed',
                            boxShadow: `0 10px 15px -3px ${primaryColor || '#7c3aed'}30`
                        }}
                    >
                        {confirming ? (
                            <><span className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" /> Confirmando...</>
                        ) : (
                            <><CheckCircle className="w-5 h-5" /> Já Paguei</>
                        )}
                    </Button>
                )}

                <div className="flex items-center gap-2 mt-6 bg-amber-50 dark:bg-amber-900/20 border border-amber-200/50 dark:border-amber-700/20 rounded-xl px-4 py-3 max-w-sm w-full">
                    <Clock className="w-4 h-4 text-amber-600 shrink-0" />
                    <p className="text-xs text-amber-700 dark:text-amber-300">
                        Sua reserva ficará ativa por <strong>24 horas</strong>. O organizador precisa confirmar o pagamento neste prazo.
                    </p>
                </div>
            </div>
        </div>
    )
}
