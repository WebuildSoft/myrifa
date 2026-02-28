"use client"

import { User, Phone, Mail, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface StepUserDataProps {
    buyerInfo: { name: string; whatsapp: string; email: string }
    onChange: (info: { name: string; whatsapp: string; email: string }) => void
    onSubmit: (e: React.FormEvent) => void
    selectedNumbersCount: number
    error?: string
}

export function StepUserData({
    buyerInfo,
    onChange,
    onSubmit,
    selectedNumbersCount,
    error,
}: StepUserDataProps) {
    return (
        <div className="flex flex-col flex-1">
            <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-1">Seus dados</h2>
            <p className="text-sm text-slate-500 mb-6">Para quem ficarão reservados os {selectedNumbersCount} números?</p>

            <form onSubmit={onSubmit} className="flex flex-col flex-1 gap-5">
                <div className="space-y-1.5">
                    <Label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Nome Completo *</Label>
                    <div className="relative">
                        <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <Input
                            value={buyerInfo.name}
                            onChange={(e) => onChange({ ...buyerInfo, name: e.target.value })}
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
                            onChange={(e) => onChange({ ...buyerInfo, whatsapp: e.target.value })}
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
                            onChange={(e) => onChange({ ...buyerInfo, email: e.target.value })}
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
    )
}
