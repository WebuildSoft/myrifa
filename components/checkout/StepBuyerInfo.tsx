"use client"

import Link from "next/link"
import { User, Phone, Mail, ArrowLeft, ChevronRight, CheckCircle2, AlertCircle } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface StepBuyerInfoProps {
    buyerInfo: { name: string; whatsapp: string; email: string }
    setBuyerInfo: (info: any) => void
    rifaSlug: string
    onNext: (e: React.FormEvent) => void
    error?: string
}

/**
 * Apply Brazilian phone mask: (XX) XXXXX-XXXX
 * Supports 10 digits (landline) and 11 digits (mobile with 9th digit)
 */
function maskPhone(value: string): string {
    const digits = value.replace(/\D/g, "").slice(0, 11)
    if (digits.length <= 2) return digits.length ? `(${digits}` : ""
    if (digits.length <= 6) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`
    if (digits.length <= 10) return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`
}

/**
 * Validate that the number has 10 or 11 digits and
 * for mobile (11 digits), the 9th digit starts with 9.
 */
function isValidPhone(value: string): boolean {
    const digits = value.replace(/\D/g, "")
    if (digits.length === 10) return true           // landline
    if (digits.length === 11 && digits[2] === "9") return true  // mobile with 9
    return false
}

/**
 * Normalize to international format expected by Evolution API / WhatsApp:
 * 55 + DDD + number (without any symbols)
 * e.g. "(11) 99999-0000" → "5511999990000"
 */
export function normalizeWhatsApp(value: string): string {
    const digits = value.replace(/\D/g, "")
    if (digits.startsWith("55") && digits.length >= 12) return digits
    return `55${digits}`
}

export function StepBuyerInfo({ buyerInfo, setBuyerInfo, rifaSlug, onNext, error }: StepBuyerInfoProps) {
    const phoneValid = isValidPhone(buyerInfo.whatsapp)
    const phoneHasInput = buyerInfo.whatsapp.replace(/\D/g, "").length > 0

    const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const masked = maskPhone(e.target.value)
        setBuyerInfo({ ...buyerInfo, whatsapp: masked })
    }

    const handleSubmit = (e: React.FormEvent) => {
        // Normalize WhatsApp to international format before advancing
        setBuyerInfo((prev: any) => ({
            ...prev,
            whatsapp: normalizeWhatsApp(prev.whatsapp)
        }))
        onNext(e)
    }

    return (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm p-8">
            <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                    <User className="w-5 h-5" />
                </div>
                <div>
                    <h2 className="text-xl font-black text-slate-900 dark:text-white">1. Seus dados</h2>
                    <p className="text-sm text-slate-400 font-medium mt-0.5">Para enviarmos sua confirmação no WhatsApp</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid md:grid-cols-2 gap-5">
                    {/* Nome */}
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

                    {/* WhatsApp */}
                    <div className="space-y-1.5">
                        <Label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                            WhatsApp * <span className="text-slate-400 normal-case font-normal">(com DDD)</span>
                        </Label>
                        <div className="relative">
                            <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                            <Input
                                value={buyerInfo.whatsapp}
                                onChange={handlePhoneChange}
                                placeholder="(11) 99999-0000"
                                inputMode="numeric"
                                className={cn(
                                    "pl-10 pr-10 h-13 rounded-xl transition-all",
                                    phoneHasInput && !phoneValid && "border-red-400 focus-visible:ring-red-400/30",
                                    phoneHasInput && phoneValid && "border-emerald-400 focus-visible:ring-emerald-400/30"
                                )}
                                required
                            />
                            {/* Live validation icon */}
                            {phoneHasInput && (
                                <div className="absolute right-3.5 top-1/2 -translate-y-1/2">
                                    {phoneValid
                                        ? <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                                        : <AlertCircle className="h-4 w-4 text-red-400" />
                                    }
                                </div>
                            )}
                        </div>
                        {/* Inline validation message */}
                        {phoneHasInput && !phoneValid && (
                            <p className="text-xs text-red-500 font-semibold flex items-center gap-1 mt-1">
                                <AlertCircle className="h-3 w-3" />
                                Número inválido. Informe DDD + 9 dígitos (ex: 11 99999-0000)
                            </p>
                        )}
                        {phoneHasInput && phoneValid && (
                            <p className="text-xs text-emerald-600 font-semibold flex items-center gap-1 mt-1">
                                <CheckCircle2 className="h-3 w-3" />
                                WhatsApp válido ✓
                            </p>
                        )}
                    </div>
                </div>

                {/* Email */}
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

                {error && <p className="text-sm text-red-500 font-bold">{error}</p>}

                <div className="flex justify-between items-center pt-4 border-t border-slate-100 dark:border-slate-800">
                    <Link href={`/r/${rifaSlug}`} className="flex items-center gap-2 text-slate-500 hover:text-primary font-bold transition-colors text-sm">
                        <ArrowLeft className="w-4 h-4" />
                        Voltar ao sorteio
                    </Link>
                    <Button
                        type="submit"
                        size="lg"
                        disabled={phoneHasInput && !phoneValid}
                        className="h-12 px-8 rounded-xl font-bold gap-2"
                    >
                        Continuar <ChevronRight className="w-4 h-4" />
                    </Button>
                </div>
            </form>
        </div>
    )
}
