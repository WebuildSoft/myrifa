"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { QrCode, Copy, Loader2, CheckCircle2, Upload, X } from "lucide-react"
import { saveManualPixSettings } from "@/actions/user/settings"
import { uploadImageAction } from "@/actions/upload"
import { toast } from "sonner"
import Image from "next/image"

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
        <Card className="border-emerald-200 bg-emerald-50/30 dark:bg-emerald-900/5">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <div className="size-8 bg-emerald-500 rounded-lg flex items-center justify-center text-white">
                        <QrCode className="size-5" />
                    </div>
                    PIX Manual (Recebimento Direto)
                </CardTitle>
                <CardDescription>
                    Configure sua chave PIX e QR Code para receber pagamentos diretamente, sem depender de plataformas externas. Você precisará confirmar os pagamentos manualmente.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="space-y-2">
                    <Label htmlFor="pixKey">Sua Chave PIX</Label>
                    <div className="relative">
                        <Copy className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                            id="pixKey"
                            value={pixKey}
                            onChange={(e) => setPixKey(e.target.value)}
                            className="pl-10"
                            placeholder="CPF, E-mail, Celular ou Chave Aleatória"
                        />
                    </div>
                    <p className="text-[10px] text-muted-foreground">
                        Esta chave será exibida para o comprador no momento do checkout.
                    </p>
                </div>

                <div className="space-y-3">
                    <Label>QR Code (Imagem)</Label>

                    {pixQrCodeImage ? (
                        <div className="relative w-40 h-40 border-2 border-emerald-200 rounded-2xl overflow-hidden group">
                            <Image
                                src={pixQrCodeImage}
                                alt="QR Code PIX"
                                fill
                                className="object-contain p-2"
                                unoptimized
                            />
                            <button
                                onClick={() => setPixQrCodeImage("")}
                                className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                            >
                                <X className="size-4" />
                            </button>
                        </div>
                    ) : (
                        <div className="relative">
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
                                className="flex flex-col items-center justify-center w-40 h-40 border-2 border-dashed border-emerald-300 dark:border-emerald-800 rounded-2xl cursor-pointer hover:bg-emerald-100/50 dark:hover:bg-emerald-900/20 transition-all gap-2"
                            >
                                {isUploading ? (
                                    <Loader2 className="size-8 text-emerald-500 animate-spin" />
                                ) : (
                                    <>
                                        <Upload className="size-8 text-emerald-400" />
                                        <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">Upload QR Code</span>
                                    </>
                                )}
                            </label>
                        </div>
                    )}
                    <p className="text-[10px] text-muted-foreground">
                        Dica: Gere um QR Code estático no app do seu banco e faça o upload aqui.
                    </p>
                </div>

                <div className="pt-4 flex items-center justify-between border-t border-emerald-100 dark:border-emerald-800 border-dashed">
                    {(initialPixKey || initialPixQrCodeImage) ? (
                        <div className="flex items-center gap-2 text-sm text-emerald-600 dark:text-emerald-500 font-medium">
                            <CheckCircle2 className="h-4 w-4" />
                            Ativo no Checkout
                        </div>
                    ) : (
                        <div className="text-sm text-yellow-600 dark:text-yellow-500 font-medium">
                            Não configurado
                        </div>
                    )}

                    <Button
                        onClick={handleSave}
                        disabled={isLoading || isUploading || !hasChanges}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white"
                    >
                        {isLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                        Salvar Configurações
                    </Button>
                </div>
            </CardContent>
        </Card>
    )
}
