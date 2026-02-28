import Link from "next/link"
import { User, Phone, Mail, ArrowLeft, ChevronRight } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"

interface StepBuyerInfoProps {
    buyerInfo: { name: string; whatsapp: string; email: string }
    setBuyerInfo: (info: any) => void
    rifaSlug: string
    onNext: (e: React.FormEvent) => void
    error?: string
}

export function StepBuyerInfo({ buyerInfo, setBuyerInfo, rifaSlug, onNext, error }: StepBuyerInfoProps) {
    return (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm p-8">
            <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                    <User className="w-5 h-5" />
                </div>
                <h2 className="text-xl font-black text-slate-900 dark:text-white">1. Seus dados</h2>
            </div>

            <form onSubmit={onNext} className="space-y-5">
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

                {error && <p className="text-sm text-red-500 font-bold">{error}</p>}

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
    )
}
