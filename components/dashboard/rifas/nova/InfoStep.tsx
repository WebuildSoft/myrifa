"use client"

import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ImageUpload } from "@/components/ui/image-upload"
import { FileText, X, ChevronRight } from "lucide-react"
import Image from "next/image"

interface Prize {
    title: string
    position: number
}

interface InfoStepProps {
    title: string
    setTitle: (val: string) => void
    description: string
    setDescription: (val: string) => void
    rules: string
    setRules: (val: string) => void
    prizes: Prize[]
    setPrizes: (val: Prize[]) => void
    category: string
    setCategory: (val: string) => void
    coverImage: string
    setCoverImage: (val: string) => void
    galleryImages: string[]
    setGalleryImages: (val: string[]) => void
    onNext: () => void
    setError: (val: string) => void
}

export function InfoStep({
    title, setTitle,
    description, setDescription,
    rules, setRules,
    prizes, setPrizes,
    category, setCategory,
    coverImage, setCoverImage,
    galleryImages, setGalleryImages,
    onNext,
    setError
}: InfoStepProps) {

    const handleNext = () => {
        if (!title || title.length < 3) {
            setError("O título deve ter no mínimo 3 caracteres.")
            return
        }
        if (prizes.some(p => p.title.trim().length < 3)) {
            setError("Todos os prêmios devem ter nomes válidos (mín. 3 caracteres).")
            return
        }
        setError("")
        onNext()
    }

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="grid gap-6">
                <div className="space-y-2">
                    <Label htmlFor="title" className="text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">Nome da Campanha</Label>
                    <div className="relative group">
                        <FileText className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-primary transition-colors" />
                        <Input
                            id="title"
                            name="title"
                            required
                            minLength={3}
                            maxLength={80}
                            placeholder="Ex: Ação Solidária para Instituição X"
                            className="h-14 pl-12 rounded-2xl border-slate-200 dark:border-slate-800 focus:ring-primary/20"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="description" className="text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">Descrição Detalhada</Label>
                    <textarea
                        id="description"
                        name="description"
                        className="flex min-h-[120px] w-full rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 py-3 text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                        placeholder="Descreva o propósito da campanha, os objetivos e como os fundos serão utilizados..."
                        maxLength={500}
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="rules" className="text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">
                        Regras e Condições
                        <span className="ml-2 text-[10px] text-slate-400 font-normal normal-case">(opcional)</span>
                    </Label>
                    <textarea
                        id="rules"
                        name="rules"
                        className="flex min-h-[100px] w-full rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 py-3 text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                        placeholder={`Ex:\n- Entrega garantida pela Instituição\n- Divulgação do resultado via redes sociais\n- Pagamento via PIX com confirmação automática`}
                        maxLength={2000}
                        value={rules}
                        onChange={(e) => setRules(e.target.value)}
                    />
                    <p className="text-[11px] text-slate-400 ml-1">Escreva as regras que aparecerão para os compradores na página pública.</p>
                </div>

                {/* Premiação Section */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <Label className="text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">Premiação da Campanha</Label>
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            className="rounded-xl border-primary/20 text-primary hover:bg-primary/5 h-9"
                            onClick={() => setPrizes([...prizes, { title: "", position: prizes.length + 1 }])}
                        >
                            + Adicionar Prêmio
                        </Button>
                    </div>

                    <div className="space-y-3">
                        {prizes.map((prize, index) => (
                            <div key={index} className="flex gap-3 group animate-in slide-in-from-left-2 duration-300">
                                <div className="flex-1 relative">
                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
                                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{index + 1}º</span>
                                        <div className="h-4 w-px bg-slate-200"></div>
                                    </div>
                                    <Input
                                        placeholder="Ex: iPhone 15 Pro Max"
                                        className="h-12 pl-16 rounded-xl border-slate-200 dark:border-slate-800"
                                        value={prize.title}
                                        onChange={(e) => {
                                            const newPrizes = [...prizes]
                                            newPrizes[index].title = e.target.value
                                            setPrizes(newPrizes)
                                        }}
                                        required
                                    />
                                </div>
                                {prizes.length > 1 && (
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        className="h-12 w-12 rounded-xl text-slate-400 hover:text-red-500 hover:bg-red-50"
                                        onClick={() => setPrizes(prizes.filter((_, i) => i !== index).map((p, i) => ({ ...p, position: i + 1 })))}
                                    >
                                        <X className="h-4 w-4" />
                                    </Button>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="category" className="text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">Categoria da Campanha</Label>
                    <select
                        id="category"
                        name="category"
                        className="flex h-14 w-full rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 py-2 text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                    >
                        <option value="SORTEIO">Sorteio de Produto</option>
                        <option value="ARRECADACAO">Arrecadação Solidária</option>
                        <option value="VIAGEM">Viagem & Experiência</option>
                        <option value="MISSAO">Missão & Ação Entre Amigos</option>
                        <option value="SAUDE">Saúde & Tratamento</option>
                        <option value="ESPORTE">Esporte & Lazer</option>
                        <option value="OUTRO">Outro</option>
                    </select>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                    <ImageUpload
                        label="Imagem de Capa"
                        value={coverImage}
                        onChange={setCoverImage}
                        helperText="Foto principal do prêmio."
                    />

                    <div className="space-y-3">
                        <Label className="text-sm font-bold text-slate-700 dark:text-slate-300 ml-1 flex items-center gap-2">
                            Galeria de Fotos (até 5)
                            <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest">PRO</span>
                        </Label>

                        <div className="grid grid-cols-2 gap-3">
                            {galleryImages.map((img, i) => (
                                <div key={i} className="relative aspect-square rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800">
                                    <Image src={img} alt={`Gallery ${i}`} fill className="object-cover" />
                                    <button
                                        type="button"
                                        onClick={() => setGalleryImages(galleryImages.filter((_, idx) => idx !== i))}
                                        className="absolute top-1.5 right-1.5 p-1 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors"
                                        title="Remover imagem"
                                    >
                                        <X className="h-3 w-3" />
                                    </button>
                                </div>
                            ))}

                            {galleryImages.length < 5 && (
                                <ImageUpload
                                    label=""
                                    value=""
                                    onChange={(url) => setGalleryImages([...galleryImages, url])}
                                />
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex justify-end pt-4">
                <Button
                    type="button"
                    size="lg"
                    className="h-14 px-10 rounded-2xl font-bold gap-2 shadow-lg shadow-primary/20"
                    onClick={handleNext}
                >
                    Próxima Etapa
                    <ChevronRight className="h-5 w-5" />
                </Button>
            </div>
        </div>
    )
}
