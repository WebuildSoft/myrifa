"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { KeyRound, ExternalLink, Loader2, CheckCircle2, ChevronDown, ListChecks, ShieldCheck } from "lucide-react"
import { saveMercadoPagoToken } from "@/actions/user/settings"
import { toast } from "sonner"

export function MercadoPagoSettings({ initialToken }: { initialToken?: string | null }) {
    const [token, setToken] = useState(initialToken || "")
    const [isLoading, setIsLoading] = useState(false)

    const handleSave = async () => {
        setIsLoading(true)
        try {
            const result = await saveMercadoPagoToken(token)
            if (result.error) {
                toast.error(result.error)
            } else {
                toast.success(result.message)
            }
        } catch (error) {
            toast.error("Erro inesperado ao salvar.")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Card className="border-slate-200/60 dark:border-slate-800/60 bg-white dark:bg-slate-900/50 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.2)] rounded-2xl md:rounded-[2rem] overflow-hidden relative group/mp">
            {/* Manutenção Frosted Luxe */}
            <div className="absolute inset-0 z-50 bg-white/40 dark:bg-slate-950/40 backdrop-blur-md flex flex-col items-center justify-center p-6 md:p-10 text-center transition-all duration-700 group-hover/mp:backdrop-blur-lg">
                <div className="relative mb-8">
                    <div className="absolute inset-0 bg-blue-500/20 rounded-full blur-3xl animate-pulse" />
                    <div className="size-20 bg-slate-900 dark:bg-white rounded-3xl flex items-center justify-center text-white dark:text-slate-900 shadow-2xl relative z-10 outline outline-8 outline-blue-500/5 scale-110">
                        <Loader2 className="size-8 animate-spin-slow" />
                    </div>
                </div>

                <h3 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white mb-3 tracking-tighter italic">GATEWAY OFFLINE</h3>
                <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 max-w-[320px] font-bold leading-relaxed uppercase tracking-tighter">
                    Estamos calibrando os sistemas de segurança do Mercado Pago para sua proteção.
                </p>

                <div className="mt-8 px-6 py-2.5 bg-blue-600 text-white rounded-full text-[10px] font-black uppercase tracking-[0.3em] shadow-[0_10px_30px_rgba(37,99,235,0.4)] hover:scale-105 transition-transform">
                    Liberado em breve
                </div>
            </div>

            <CardHeader className="border-b border-slate-100 dark:border-slate-800/50 p-5 md:p-6 pb-4 opacity-20 grayscale pointer-events-none">
                <div className="flex items-center gap-3">
                    <div className="size-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-600/20 shadow-inner">
                        <KeyRound className="size-5" />
                    </div>
                    <div>
                        <CardTitle className="text-lg font-black tracking-tight italic">Mercado Pago</CardTitle>
                        <CardDescription className="text-[10px] font-medium text-slate-500">Conexão via API de Produção.</CardDescription>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="p-5 md:p-6 space-y-6 opacity-20 grayscale pointer-events-none">
                <div className="space-y-2">
                    <Label htmlFor="mpToken" className="text-[9px] font-black uppercase tracking-[0.15em] text-slate-400 ml-1">Chave Mestra (Access Token)</Label>
                    <div className="relative">
                        <div className="absolute left-4 top-3 flex items-center text-slate-400">
                            <ShieldCheck className="size-4" />
                        </div>
                        <Input
                            id="mpToken"
                            type="password"
                            value={token}
                            onChange={(e) => setToken(e.target.value)}
                            className="pl-12 h-11 bg-slate-50 dark:bg-slate-950/50 border-slate-200 dark:border-slate-800 rounded-xl font-mono text-[10px] tracking-widest"
                            placeholder="SECRET_TOKEN_HASH"
                            disabled
                        />
                    </div>
                </div>

                <div className="bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 shadow-inner">
                    <div className="flex items-center gap-2 mb-4">
                        <div className="h-0.5 w-4 bg-blue-600 rounded-full" />
                        <h4 className="font-black text-[9px] uppercase tracking-[0.2em] text-slate-500">Protocolo de Instalação</h4>
                    </div>

                    <ul className="space-y-3">
                        {[
                            "Abra o Console de Engenharia do MP.",
                            "Capture suas credenciais em 'Production'.",
                            "Injete o Access Token acima."
                        ].map((text, i) => (
                            <li key={i} className="flex gap-3 items-start group/step">
                                <span className="flex-shrink-0 size-6 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 flex items-center justify-center text-[10px] font-black shadow-sm transition-colors">{i + 1}</span>
                                <p className="text-[11px] text-slate-500 dark:text-slate-400 font-bold leading-tight pt-1 uppercase tracking-tighter">{text}</p>
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="pt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-t border-slate-100 dark:border-slate-800 border-dashed">
                    {initialToken ? (
                        <div className="flex items-center gap-2">
                            <span className="size-1.5 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                            <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600">Link Ativo</span>
                        </div>
                    ) : (
                        <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 italic">Desconectado</div>
                    )}
                    <Button disabled variant="outline" className="rounded-xl font-black h-10 px-4 uppercase text-[9px] tracking-widest border-slate-200">Revogar</Button>
                </div>
            </CardContent>
        </Card>
    )
}
