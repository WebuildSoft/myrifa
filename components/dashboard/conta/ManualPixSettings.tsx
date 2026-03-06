"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { QrCode, Copy, Loader2, CheckCircle2, Upload, X, ShieldCheck, Info } from "lucide-react"
import { saveManualPixSettings } from "@/actions/user/settings"
import { uploadImageAction } from "@/actions/upload"
import { toast } from "sonner"
import Image from "next/image"
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"

interface ManualPixSettingsProps {
    initialPixKey?: string | null
    initialPixQrCodeImage?: string | null
}

export function ManualPixSettings({ initialPixKey, initialPixQrCodeImage }: ManualPixSettingsProps) {
    const [pixKey, setPixKey] = useState(initialPixKey || "")
    const [pixQrCodeImage, setPixQrCodeImage] = useState(initialPixQrCodeImage || "")
    const [isLoading, setIsLoading] = useState(false)
    const [isUploading, setIsUploading] = useState(false)

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        setIsUploading(true)
        try {
            const formData = new FormData()
            formData.append("file", file)
            const result = await uploadImageAction(formData)
            if (result.error) {
                toast.error(result.error)
            } else if (result.url) {
                setPixQrCodeImage(result.url)
                toast.success("QR Code carregado!")
            }
        } catch (error) {
            toast.error("Erro ao fazer upload da imagem.")
        } finally {
            setIsUploading(false)
        }
    }

    const handleSave = async () => {
        setIsLoading(true)
        try {
            const result = await saveManualPixSettings({
                pixKey: pixKey || undefined,
                pixQrCodeImage: pixQrCodeImage || undefined
            })
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

    const hasChanges = pixKey !== (initialPixKey || "") || pixQrCodeImage !== (initialPixQrCodeImage || "")

    return (
        <Card id="pix-manual" className="border-slate-200/60 dark:border-slate-800/60 bg-white dark:bg-slate-900/50 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.2)] rounded-2xl md:rounded-[2rem] overflow-hidden">
            <CardHeader className="border-b border-slate-100 dark:border-slate-800/50 p-5 md:p-6 pb-4">
                <div className="flex items-center gap-3">
                    <div className="size-10 bg-emerald-500 rounded-xl flex items-center justify-center text-white shadow-lg shadow-emerald-500/20 rotate-3 group-hover:rotate-0 transition-transform duration-500">
                        <QrCode className="size-5" />
                    </div>
                    <div>
                        <CardTitle className="text-lg font-black tracking-tight italic">PIX Manual (Recebimento Direto)</CardTitle>
                        <CardDescription className="text-[10px] font-medium text-slate-500 leading-relaxed max-w-md">
                            Configure sua chave PIX e QR Code para receber pagamentos diretamente, sem depender de plataformas externas. Você precisará confirmar os pagamentos manualmente.
                        </CardDescription>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="p-5 md:p-6 space-y-6">
                {/* Nota de Transparência de Luxo */}
                <div className="relative group overflow-hidden rounded-2xl border border-emerald-100 dark:border-emerald-900/30 bg-emerald-50/30 dark:bg-emerald-950/20 p-5">
                    <div className="absolute -right-4 -top-4 size-24 bg-emerald-500/10 rounded-full blur-3xl group-hover:bg-emerald-500/20 transition-colors" />

                    <div className="flex items-center gap-3 mb-3">
                        <div className="p-1.5 bg-white dark:bg-slate-900 rounded-lg shadow-sm border border-emerald-100 dark:border-emerald-900/20">
                            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                        </div>
                        <h4 className="text-[9px] font-black uppercase tracking-[0.2em] text-emerald-700 dark:text-emerald-400">Transparência nas Taxas</h4>
                    </div>

                    <div className="space-y-4 relative z-10">
                        <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
                            Ao usar o PIX Manual, a comissão de <strong className="text-emerald-600 font-black">5% da plataforma</strong> (destinada à infraestrutura e WhatsApp) é coletada através do{" "}
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <strong className="italic text-emerald-600 underline decoration-emerald-500/30 underline-offset-4 cursor-help hover:text-emerald-500 transition-colors">
                                        Split Inteligente
                                    </strong>
                                </TooltipTrigger>
                                <TooltipContent className="bg-slate-900 border-slate-800 text-white p-3 rounded-xl shadow-2xl max-w-xs">
                                    <div className="space-y-2">
                                        <p className="text-[10px] font-black uppercase tracking-widest text-emerald-400">O que é Split?</p>
                                        <p className="text-[11px] leading-relaxed text-slate-300">
                                            É a <span className="text-emerald-400 font-bold">divisão automática</span> de pagamentos (do inglês <span className="italic text-slate-400">partition</span>).
                                        </p>
                                        <p className="text-[11px] leading-relaxed text-slate-400">
                                            Isso garante que a comissão seja separada para manter sua infraestrutura e WhatsApp ativos, sem que você precise fazer repasses manuais depois.
                                        </p>
                                    </div>
                                </TooltipContent>
                            </Tooltip>
                            .
                        </p>

                        <div className="flex gap-3 p-3 rounded-xl bg-white/50 dark:bg-slate-950/40 border border-emerald-100/50 dark:border-emerald-900/20 shadow-sm">
                            <Info className="size-3.5 text-emerald-500 shrink-0 mt-0.5" />
                            <p className="text-[10px] text-emerald-800 dark:text-emerald-300/80 leading-relaxed font-bold">
                                O sistema alternará automaticamente algumas vendas para o checkout oficial da plataforma até que o valor da manutenção seja quitado. Após isso, <span className="text-emerald-600 dark:text-emerald-400">100% das vendas restantes</span> cairão direto na sua conta.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="pixKey" className="text-[9px] font-black uppercase tracking-[0.15em] text-slate-400 ml-1">Chave PIX de Recebimento</Label>
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <Copy className="h-4 w-4 text-slate-400 group-focus-within:text-emerald-500 transition-colors" />
                            </div>
                            <Input
                                id="pixKey"
                                value={pixKey}
                                onChange={(e) => setPixKey(e.target.value)}
                                className="pl-12 h-12 bg-slate-50 dark:bg-slate-950/50 border-slate-200 dark:border-slate-800 rounded-xl focus:border-emerald-500 focus-visible:ring-emerald-500/10 transition-all font-bold text-base tracking-tight shadow-sm"
                                placeholder="CPF, E-mail ou Chave Aleatória"
                            />
                            {pixKey && (
                                <div className="absolute right-3 top-2.5 px-3 py-1 bg-emerald-500/10 text-emerald-600 rounded-lg text-[9px] font-black uppercase tracking-tighter shadow-inner border border-emerald-500/10">
                                    OK
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="p-4 rounded-3xl bg-slate-50 dark:bg-slate-950/50 border border-slate-100 dark:border-slate-800 space-y-4">
                        <div className="flex items-center gap-3">
                            <div className="p-1.5 bg-emerald-500/10 rounded-lg">
                                <QrCode className="size-3.5 text-emerald-500" />
                            </div>
                            <span className="text-[9px] font-black uppercase tracking-widest text-slate-500">QR Code Estático</span>
                        </div>

                        <div className="flex flex-col sm:flex-row items-center gap-6">
                            {pixQrCodeImage ? (
                                <div className="flex flex-col items-center gap-3">
                                    <div className="relative group/qr p-2 bg-white rounded-2xl shadow-xl border border-slate-200 size-32 shrink-0">
                                        <div className="relative w-full h-full overflow-hidden rounded-lg">
                                            <Image
                                                src={pixQrCodeImage}
                                                alt="QR Code PIX"
                                                fill
                                                className="object-contain"
                                                unoptimized
                                            />
                                        </div>
                                    </div>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        className="h-8 px-3 rounded-lg border-red-200 text-red-600 hover:bg-red-50 text-[10px] uppercase font-black tracking-widest gap-2"
                                        onClick={() => setPixQrCodeImage("")}
                                    >
                                        <X className="size-3" />
                                        Remover QR
                                    </Button>
                                </div>
                            ) : (
                                <div className="relative size-32 shrink-0">
                                    <input
                                        type="file"
                                        id="pixQrUpload"
                                        className="hidden"
                                        accept="image/*"
                                        onChange={handleFileUpload}
                                        disabled={isUploading}
                                    />
                                    <label
                                        htmlFor="pixQrUpload"
                                        className="flex flex-col items-center justify-center aspect-square w-full border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl cursor-pointer hover:bg-emerald-50/50 dark:hover:bg-emerald-500/5 hover:border-emerald-300 dark:hover:border-emerald-800 transition-all gap-2 group/upload"
                                    >
                                        {isUploading ? (
                                            <Loader2 className="size-6 text-emerald-500 animate-spin" />
                                        ) : (
                                            <>
                                                <div className="size-8 bg-white dark:bg-slate-800 rounded-lg flex items-center justify-center group-hover/upload:scale-110 group-hover/upload:bg-emerald-100 dark:group-hover/upload:bg-emerald-900/30 transition-all shadow-sm">
                                                    <Upload className="size-4 text-slate-400 group-hover/upload:text-emerald-500" />
                                                </div>
                                                <span className="text-[8px] font-black text-slate-400 group-hover/upload:text-emerald-600 uppercase tracking-tight text-center px-2">Upload QR</span>
                                            </>
                                        )}
                                    </label>
                                </div>
                            )}

                            <div className="space-y-2 flex-1 text-center sm:text-left">
                                <h5 className="text-xs font-bold text-slate-900 dark:text-white italic">Ativação Visual</h5>
                                <p className="text-[11px] text-slate-500 leading-tight">
                                    Otimize o checkout com o QR gerado pelo seu banco.
                                </p>
                                <div className="inline-flex items-center gap-2 px-2 py-0.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-full">
                                    <div className={`size-1 rounded-full ${pixQrCodeImage ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                                    <span className="text-[8px] font-black uppercase tracking-widest text-slate-500">
                                        {pixQrCodeImage ? "Configurado" : "Pendente"}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-slate-50 dark:border-slate-800/50">
                        <div className="flex items-center gap-3">
                            {initialPixKey || initialPixQrCodeImage ? (
                                <div className="flex items-center gap-2 group/status">
                                    <div className="size-2 bg-emerald-500 rounded-full shadow-[0_0_10px_rgba(16,185,129,0.5)] animate-pulse" />
                                    <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600 dark:text-emerald-400">Ativo</span>
                                </div>
                            ) : (
                                <div className="flex items-center gap-2 grayscale brightness-125">
                                    <div className="size-2 bg-slate-300 rounded-full" />
                                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Pendente</span>
                                </div>
                            )}
                        </div>

                        <Button
                            onClick={handleSave}
                            disabled={isLoading || isUploading || !hasChanges}
                            className="h-11 px-6 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-emerald-500/10 hover:shadow-emerald-500/20 active:scale-95 transition-all w-full sm:w-auto"
                        >
                            {isLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                            Salvar Alterações
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
