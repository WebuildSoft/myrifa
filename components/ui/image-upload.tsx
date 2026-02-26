"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ImageIcon, X, Loader2, UploadCloud, Link as LinkIcon } from "lucide-react"
import { uploadImageAction } from "@/actions/upload"
import { toast } from "sonner"
import Image from "next/image"

interface ImageUploadProps {
    value?: string
    onChange: (url: string) => void
    label: string
    helperText?: string
}

export function ImageUpload({ value, onChange, label, helperText }: ImageUploadProps) {
    const [isUploading, setIsUploading] = useState(false)
    const [showUrlInput, setShowUrlInput] = useState(false)
    const [urlValue, setUrlValue] = useState("")
    const [hasError, setHasError] = useState(false)

    // Reset error when value changes
    if (value && value !== urlValue && !showUrlInput && hasError) {
        // This is a bit tricky to sync without useEffect, but we can try 
        // a simple check or just reset when a new image is set via onChange
    }

    async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0]
        if (!file) return

        const formData = new FormData()
        formData.append("file", file)

        setIsUploading(true)
        setHasError(false) // Reset error on new upload
        try {
            const res = await uploadImageAction(formData)
            if (res.success && res.url) {
                onChange(res.url)
                toast.success("Imagem enviada com sucesso!")
            } else {
                toast.error(res.error || "Erro ao enviar imagem")
            }
        } catch (error) {
            toast.error("Erro interno ao enviar imagem")
        } finally {
            setIsUploading(false)
        }
    }

    function handleUrlSubmit() {
        if (!urlValue) return
        try {
            new URL(urlValue)
            setHasError(false) // Reset error on new URL
            onChange(urlValue)
            setShowUrlInput(false)
            setUrlValue("")
            toast.success("Link da imagem adicionado!")
        } catch (e) {
            toast.error("URL inválida")
        }
    }

    return (
        <div className="space-y-3">
            <Label className="text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">{label}</Label>

            <div className="relative group overflow-hidden bg-slate-50 dark:bg-slate-900 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-3xl transition-all hover:border-primary/50">
                {value ? (
                    <div className="relative aspect-video w-full overflow-hidden rounded-2xl">
                        {!hasError ? (
                            <Image
                                src={value}
                                alt="Preview"
                                fill
                                className="object-cover"
                                onError={() => setHasError(true)}
                            />
                        ) : (
                            <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-100 dark:bg-slate-800 p-4 text-center">
                                <div className="size-10 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-full flex items-center justify-center mb-2">
                                    <X className="h-5 w-5" />
                                </div>
                                <p className="text-xs font-bold text-slate-800 dark:text-slate-200">Não foi possível carregar</p>
                                <p className="text-[10px] text-slate-500 mt-1">Domínio não permitido ou link quebrado.</p>
                                <Button
                                    variant="link"
                                    size="sm"
                                    className="text-xs mt-1 h-auto p-0"
                                    onClick={() => {
                                        setHasError(false)
                                        onChange("")
                                    }}
                                >
                                    Remover
                                </Button>
                            </div>
                        )}
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                            <Button
                                type="button"
                                variant="destructive"
                                size="icon"
                                className="rounded-full"
                                onClick={() => onChange("")}
                            >
                                <X className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                ) : (
                    <div className="p-8 flex flex-col items-center justify-center text-center gap-4">
                        <div className="size-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                            {isUploading ? <Loader2 className="h-6 w-6 animate-spin" /> : <UploadCloud className="h-6 w-6" />}
                        </div>

                        {!showUrlInput ? (
                            <div className="space-y-1.5">
                                <p className="text-sm font-bold text-slate-900 dark:text-white">
                                    {isUploading ? "Enviando..." : "Arraste ou clique para enviar"}
                                </p>
                                <div className="space-y-0.5">
                                    <p className="text-xs text-slate-500 font-medium">PNG, JPG, WebP ou GIF &bull; Máx 5MB</p>
                                    <p className="text-[10px] text-primary/70 font-bold">📐 Tamanho ideal: <span className="font-black">1200 × 800px</span></p>
                                    <p className="text-[10px] text-slate-400">Mobile compatível: mínimo 800 × 600px</p>
                                </div>
                            </div>
                        ) : (
                            <div className="w-full max-w-xs space-y-2">
                                <Input
                                    placeholder="Cole o link da imagem aqui..."
                                    value={urlValue}
                                    onChange={(e) => setUrlValue(e.target.value)}
                                    className="h-10 rounded-xl"
                                    onKeyDown={(e) => e.key === "Enter" && handleUrlSubmit()}
                                />
                                <div className="flex gap-2">
                                    <Button type="button" size="sm" className="flex-1 rounded-lg" onClick={handleUrlSubmit}>
                                        Confirmar
                                    </Button>
                                    <Button type="button" variant="ghost" size="sm" className="rounded-lg" onClick={() => setShowUrlInput(false)}>
                                        Cancelar
                                    </Button>
                                </div>
                            </div>
                        )}

                        {!isUploading && !showUrlInput && (
                            <div className="flex gap-2">
                                <Button
                                    type="button"
                                    variant="secondary"
                                    size="sm"
                                    className="rounded-xl h-9 font-bold text-[10px] uppercase tracking-wider relative overflow-hidden"
                                >
                                    Selecionar Arquivo
                                    <input
                                        type="file"
                                        className="absolute inset-0 opacity-0 cursor-pointer"
                                        accept="image/png,image/jpeg,image/webp,image/gif"
                                        onChange={handleFileChange}
                                    />
                                </Button>
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    className="rounded-xl h-9 font-bold text-[10px] uppercase tracking-wider text-slate-400"
                                    onClick={() => setShowUrlInput(true)}
                                >
                                    <LinkIcon className="h-3 w-3 mr-1" /> Usar Link
                                </Button>
                            </div>
                        )}
                    </div>
                )}
            </div>
            {helperText && <p className="text-[10px] text-slate-400 font-medium ml-1">{helperText}</p>}
        </div>
    )
}
