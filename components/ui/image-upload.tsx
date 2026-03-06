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
    onMultipleChange?: (urls: string[]) => void
    multiple?: boolean
    label: string
    helperText?: string
}

export function ImageUpload({ value, onChange, onMultipleChange, multiple, label, helperText }: ImageUploadProps) {
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
        const files = e.target.files
        if (!files || files.length === 0) return

        setIsUploading(true)
        setHasError(false)
        const uploadedUrls: string[] = []

        try {
            for (let i = 0; i < files.length; i++) {
                const file = files[i]
                const formData = new FormData()
                formData.append("file", file)

                const res = await uploadImageAction(formData)
                if (res.success && res.url) {
                    uploadedUrls.push(res.url)
                } else {
                    toast.error(res.error || `Erro ao enviar arquivo ${i + 1}`)
                }
            }

            if (uploadedUrls.length > 0) {
                if (multiple && onMultipleChange) {
                    onMultipleChange(uploadedUrls)
                    toast.success(`${uploadedUrls.length} imagens enviadas!`)
                } else if (uploadedUrls[0]) {
                    onChange(uploadedUrls[0])
                    toast.success("Imagem enviada com sucesso!")
                }
            }
        } catch (error) {
            toast.error("Erro interno ao enviar imagens")
        } finally {
            setIsUploading(false)
            // Clear input so same file can be selected again if removed
            e.target.value = ""
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
                                <div className="size-8 md:size-10 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-full flex items-center justify-center mb-1 md:mb-2">
                                    <X className="h-4 w-4 md:h-5 md:w-5" />
                                </div>
                                <p className="text-[10px] md:text-xs font-bold text-slate-800 dark:text-slate-200">Erro ao carregar</p>
                                <Button
                                    variant="link"
                                    size="sm"
                                    className="text-[10px] mt-0.5 h-auto p-0"
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
                                className="rounded-full size-8 md:size-10"
                                onClick={() => onChange("")}
                            >
                                <X className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                ) : (
                    <div className="p-4 md:p-8 flex flex-col items-center justify-center text-center gap-3 md:gap-4">
                        <div className="size-10 md:size-12 bg-primary/10 rounded-xl md:rounded-2xl flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                            {isUploading ? <Loader2 className="h-5 w-5 md:h-6 md:w-6 animate-spin" /> : <UploadCloud className="h-5 w-5 md:h-6 md:w-6" />}
                        </div>

                        {!showUrlInput ? (
                            <div className="space-y-1 md:space-y-1.5 px-2">
                                <p className="text-xs md:text-sm font-bold text-slate-900 dark:text-white line-clamp-1">
                                    {isUploading ? "Enviando..." : "Toque ou arraste para enviar"}
                                </p>
                                <div className="hidden xs:block space-y-0.5">
                                    <p className="text-[10px] md:text-xs text-slate-500 font-medium">PNG, JPG ou WebP &bull; Máx 5MB</p>
                                </div>
                            </div>
                        ) : (
                            <div className="w-full max-w-xs space-y-2 px-2">
                                <Input
                                    placeholder="Link da imagem..."
                                    value={urlValue}
                                    onChange={(e) => setUrlValue(e.target.value)}
                                    className="h-9 md:h-10 rounded-xl text-xs md:text-sm"
                                    onKeyDown={(e) => e.key === "Enter" && handleUrlSubmit()}
                                />
                                <div className="flex gap-2">
                                    <Button type="button" size="sm" className="flex-1 rounded-lg h-8 text-[10px] md:text-xs" onClick={handleUrlSubmit}>
                                        Confirmar
                                    </Button>
                                    <Button type="button" variant="ghost" size="sm" className="rounded-lg h-8 text-[10px] md:text-xs" onClick={() => setShowUrlInput(false)}>
                                        Cancelar
                                    </Button>
                                </div>
                            </div>
                        )}

                        {!isUploading && !showUrlInput && (
                            <div className="flex flex-wrap justify-center gap-2 px-4">
                                <Button
                                    type="button"
                                    variant="secondary"
                                    size="sm"
                                    className="rounded-xl h-8 md:h-9 px-3 md:px-4 font-bold text-[9px] md:text-[10px] uppercase tracking-wider relative overflow-hidden"
                                >
                                    Enviar Foto
                                    <input
                                        type="file"
                                        className="absolute inset-0 opacity-0 cursor-pointer"
                                        accept="image/png,image/jpeg,image/webp,image/gif"
                                        multiple={multiple}
                                        onChange={handleFileChange}
                                    />
                                </Button>
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    className="rounded-xl h-8 md:h-9 font-bold text-[9px] md:text-[10px] uppercase tracking-wider text-slate-400 px-3 md:px-4"
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
