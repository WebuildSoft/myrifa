"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    CheckCircle2,
    Type,
    FileText,
    Loader2,
    X
} from "lucide-react"
import { updateRifaAction } from "@/actions/rifas"
import { toast } from "sonner"
import { ImageUpload } from "@/components/ui/image-upload"
import Image from "next/image"

interface EditRifaFormProps {
    rifa: {
        id: string
        title: string
        description: string | null
        rules: string | null
        coverImage: string | null
        images: string[]
    }
}

export default function EditRifaForm({ rifa }: EditRifaFormProps) {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [coverImage, setCoverImage] = useState(rifa.coverImage || "") // Added state for coverImage
    const [galleryImages, setGalleryImages] = useState<string[]>(rifa.images || []) // Added state for galleryImages

    async function handleSubmit(formData: FormData) {
        setLoading(true)
        formData.set("coverImage", coverImage) // Added coverImage to formData
        formData.set("images", galleryImages.join(",")) // Added images to formData

        try {
            const res = await updateRifaAction(rifa.id, formData)
            if (res.success) {
                toast.success("Campanha atualizada com sucesso!")
                router.push(`/dashboard/rifas/${rifa.id}`)
                router.refresh()
            } else {
                toast.error(res.error || "Erro ao atualizar rifa")
            }
        } catch (error) {
            toast.error("Erro inesperado ao atualizar campanha")
        } finally {
            setLoading(false)
        }
    }

    return (
        <form action={handleSubmit} className="space-y-8">
            <div className="bg-white dark:bg-slate-800 p-8 rounded-[2.5rem] border border-primary/5 shadow-sm space-y-8">
                <div className="flex items-center gap-3 border-l-2 border-primary pl-4">
                    <h3 className="font-black text-slate-900 dark:text-white text-[10px] uppercase tracking-widest">Informações Básicas</h3>
                </div>

                <div className="space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="title" className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Nome da Campanha</Label>
                        <div className="relative group">
                            <Type className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-300 group-focus-within:text-primary transition-colors" />
                            <Input
                                id="title"
                                name="title"
                                defaultValue={rifa.title}
                                required
                                minLength={3}
                                maxLength={80}
                                className="h-14 bg-slate-50 dark:bg-slate-900 border-none rounded-2xl pl-12 pr-4 font-bold focus-visible:ring-2 focus-visible:ring-primary/30 transition-all placeholder:text-slate-300"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="description" className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Descrição Detalhada</Label>
                        <div className="relative group">
                            <FileText className="absolute left-4 top-5 h-5 w-5 text-slate-300 group-focus-within:text-primary transition-colors" />
                            <textarea
                                id="description"
                                name="description"
                                defaultValue={rifa.description || ""}
                                placeholder="Conte os detalhes da campanha, objetivos e data da premiação..."
                                className="flex min-h-[160px] w-full bg-slate-50 dark:bg-slate-900 border-none rounded-[2rem] pl-12 pr-6 py-5 text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:ring-offset-0 disabled:cursor-not-allowed disabled:opacity-50 transition-all placeholder:text-slate-300 resize-none h-auto"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="rules" className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Regras e Condições <span className="text-slate-300 font-normal normal-case">(opcional)</span></Label>
                        <textarea
                            id="rules"
                            name="rules"
                            defaultValue={rifa.rules || ""}
                            placeholder={`Ex:\n- Entrega garantida pela Instituição\n- Resultado divulgado via redes sociais\n- Pagamento confirmado automaticamente via PIX`}
                            className="flex min-h-[120px] w-full bg-slate-50 dark:bg-slate-900 border-none rounded-[2rem] px-6 py-5 text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 transition-all placeholder:text-slate-300 resize-none"
                            maxLength={2000}
                        />
                        <p className="text-[11px] text-slate-400 ml-1">Aparecerão na página pública da sua campanha.</p>
                    </div>

                    <div className="grid gap-8 md:grid-cols-2 pt-4">
                        <ImageUpload
                            label="Imagem de Capa"
                            value={coverImage}
                            onChange={setCoverImage}
                            helperText="Esta é a imagem principal que aparece no topo da campanha."
                        />

                        <div className="space-y-3">
                            <Label className="text-sm font-bold text-slate-700 dark:text-slate-300 ml-1 flex items-center gap-2">
                                Galeria de Fotos
                                <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest">PRO</span>
                            </Label>

                            <div className="grid grid-cols-2 gap-4">
                                {galleryImages.map((img, i) => (
                                    <div key={i} className="relative aspect-square rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800">
                                        <Image src={img} alt={`Gallery ${i}`} fill className="object-cover" />
                                        <button
                                            type="button"
                                            onClick={() => setGalleryImages(prev => prev.filter((_, idx) => idx !== i))}
                                            className="absolute top-2 right-2 p-1.5 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors"
                                        >
                                            <X className="h-3 w-3" />
                                        </button>
                                    </div>
                                ))}

                                {galleryImages.length < 5 && (
                                    <ImageUpload
                                        label=""
                                        value=""
                                        onChange={(url) => setGalleryImages(prev => [...prev, url])}
                                    />
                                )}
                            </div>
                            <p className="text-[10px] text-slate-400 font-medium ml-1">Máximo 5 imagens na galeria.</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex flex-col-reverse md:flex-row gap-4 pt-4">
                <Button
                    type="button"
                    variant="outline"
                    className="flex-1 h-14 rounded-2xl font-black text-xs uppercase tracking-[0.2em] border-primary/10 hover:bg-primary/5 active:scale-95 transition-all"
                    onClick={() => router.back()}
                >
                    Descartar
                </Button>
                <Button
                    type="submit"
                    disabled={loading}
                    className="flex-[2] h-14 bg-primary hover:bg-primary/90 text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-primary/20 active:scale-95 transition-all flex items-center gap-3"
                >
                    {loading ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                        <CheckCircle2 className="h-4 w-4" />
                    )}
                    {loading ? "Salvando..." : "Salvar Alterações"}
                </Button>
            </div>
        </form>
    )
}
