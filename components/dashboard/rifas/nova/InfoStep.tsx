"use client"

import React from "react"

import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ImageUpload } from "@/components/ui/image-upload"
import { FileText, X, ChevronRight, Sparkles } from "lucide-react"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import Image from "next/image"

const RULE_TEMPLATES = [
    {
        label: "Sorteio no Site (Digital)",
        text: "- Sorteio processado por software auditável diretamente na plataforma.\n- O resultado é aleatório, transparente e divulgado instantaneamente após a venda de todas as cotas.\n- A tecnologia MyRifa garante a idoneidade do sorteio, sem intervenção humana no resultado."
    },
    {
        label: "Pela Loteria Federal",
        text: "- Sorteio baseado na extração da Loteria Federal.\n- A data será definida assim que 100% das cotas forem vendidas.\n- Utilizaremos os últimos dígitos do 1º prêmio para definir o ganhador.\n- Caso a extração seja adiada, prevalece a próxima data oficial da CEF."
    },
    {
        label: "Regras de Pagamento & Reserva",
        text: "- Reservas não pagas em até 30 minutos (ou prazo definido pelo sistema) são canceladas automaticamente.\n- O pagamento via PIX é identificado de imediato, sem necessidade de envio de comprovante.\n- Certifique-se de que os dados de contato (WhatsApp/E-mail) estão corretos para o recebimento de notificações."
    },
    {
        label: "Segurança e Responsabilidade",
        text: "- Esta plataforma é um serviço de licenciamento de software (SaaS).\n- O Organizador é o único responsável pela entrega do prêmio e pela legalidade da campanha.\n- Ao participar, o apoiador reconhece que sua relação jurídica é direta com o Organizador, conforme os Termos de Uso."
    },
    {
        label: "Entrega e Premiação",
        text: "- A entrega ou retirada do prêmio deve ser combinada diretamente com o Organizador.\n- O frete/envio do prêmio é por conta do ganhador, salvo se houver acordo contrário.\n- O ganhador tem o prazo de 30 dias para reivindicar seu brinde após a realização do sorteio."
    },
    {
        label: "Arrecadação Solidária",
        text: "- 100% dos valores arrecadados (subtraindo taxas bancárias) serão destinados à causa descrita.\n- O Organizador compromete-se a realizar a prestação de contas de forma transparente.\n- Esta ação não possui fins lucrativos para o organizador."
    }
]

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
    const topRef = React.useRef<HTMLDivElement>(null)

    const handleNext = () => {
        if (!title || title.length < 3) {
            setError("O título deve ter no mínimo 3 caracteres.")
            topRef.current?.scrollIntoView({ behavior: 'smooth' })
            return
        }

        // Remove empty prizes before validation or just ignore them
        const activePrizes = prizes.filter(p => p.title.trim().length > 0)

        if (activePrizes.some(p => p.title.trim().length < 3)) {
            setError("Os prêmios preenchidos devem ter no mínimo 3 caracteres.")
            topRef.current?.scrollIntoView({ behavior: 'smooth' })
            return
        }

        setError("")
        onNext()
    }

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && (e.target as HTMLElement).tagName !== 'TEXTAREA') {
            e.preventDefault()
        }
    }

    return (
        <div ref={topRef} onKeyDown={handleKeyDown} className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
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

                <div className="space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <Label htmlFor="rules" className="text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">
                            Regras e Condições
                            <span className="ml-2 text-[10px] text-slate-400 font-normal normal-case">(opcional)</span>
                        </Label>

                        <div className="flex items-center gap-2">
                            <Sparkles className="h-3.5 w-3.5 text-primary animate-pulse" />
                            <Select onValueChange={(val) => setRules(val)}>
                                <SelectTrigger className="h-9 w-full sm:w-[220px] rounded-xl text-[10px] font-black uppercase tracking-wider bg-primary/5 border-primary/20 text-primary">
                                    <SelectValue placeholder="USAR MODELO PRONTO" />
                                </SelectTrigger>
                                <SelectContent className="rounded-xl border-slate-200">
                                    {RULE_TEMPLATES.map((template, idx) => (
                                        <SelectItem key={idx} value={template.text} className="text-xs font-bold">
                                            {template.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <textarea
                        id="rules"
                        name="rules"
                        className="flex min-h-[120px] w-full rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 py-3 text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                        placeholder="Escolha um modelo acima ou escreva as suas próprias regras..."
                        maxLength={2000}
                        value={rules}
                        onChange={(e) => setRules(e.target.value)}
                    />
                    <p className="text-[11px] text-slate-400 ml-1">Escreva as regras que aparecerão para os compradores na página pública.</p>
                </div>

                {/* Premiação Section */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <Label className="text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">
                            Premiação da Campanha
                            <span className="ml-2 text-[10px] text-slate-400 font-normal normal-case">(opcional)</span>
                        </Label>
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
                                        placeholder="Ex: iPhone 15 Pro Max (opcional)"
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
                    <div className="space-y-3">
                        <Label htmlFor="coverImage" className="text-sm font-bold text-slate-700 dark:text-slate-300 ml-1 flex items-center gap-2">
                            Imagem de Capa
                            <span className="text-[10px] text-slate-400 font-normal">(Principal)</span>
                        </Label>
                        <ImageUpload
                            label=""
                            value={coverImage}
                            onChange={setCoverImage}
                            helperText="Esta será a primeira imagem que seus clientes verão."
                        />
                    </div>

                    <div className="space-y-3 overflow-hidden">
                        <Label className="text-sm font-bold text-slate-700 dark:text-slate-300 ml-1 flex items-center gap-2">
                            Galeria de Fotos (até 5)
                            <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest">PRO</span>
                        </Label>

                        <div className="flex md:grid md:grid-cols-2 gap-3 overflow-x-auto pb-4 md:pb-0 no-scrollbar snap-x snap-mandatory">
                            {galleryImages.map((img, i) => (
                                <div key={i} className="relative aspect-square w-[140px] h-[140px] md:w-auto md:h-auto rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 flex-shrink-0 snap-center shadow-sm">
                                    <Image src={img} alt={`Gallery ${i}`} fill className="object-cover" unoptimized />
                                    <button
                                        type="button"
                                        onClick={() => setGalleryImages(galleryImages.filter((_, idx) => idx !== i))}
                                        className="absolute top-2 right-2 p-1.5 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors backdrop-blur-sm"
                                        title="Remover imagem"
                                    >
                                        <X className="h-3.5 w-3.5" />
                                    </button>
                                </div>
                            ))}

                            {galleryImages.length < 5 && (
                                <div className="w-[140px] h-[140px] md:w-auto md:h-auto flex-shrink-0 snap-center">
                                    <ImageUpload
                                        label=""
                                        value=""
                                        multiple
                                        onMultipleChange={(urls) => {
                                            const remaining = 5 - galleryImages.length;
                                            const toAdd = urls.slice(0, remaining);
                                            setGalleryImages([...galleryImages, ...toAdd]);
                                        }}
                                        onChange={(url) => setGalleryImages([...galleryImages, url])}
                                    />
                                </div>
                            )}
                        </div>
                        <p className="md:hidden text-[10px] text-slate-400 font-medium ml-1">
                            {galleryImages.length > 0 ? "← Deslize para ver todas as fotos" : "Adicione até 5 fotos extras do prêmio."}
                        </p>
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
