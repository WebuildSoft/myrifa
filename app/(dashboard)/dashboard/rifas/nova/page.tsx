"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button";
import { ShareRaffleModal } from "@/components/ui/share-raffle-modal";
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { createRifaAction, publishRifaAction } from "@/actions/rifas"
import { useRouter } from "next/navigation"
import {
    Layout,
    Settings,
    Rocket,
    ChevronRight,
    Calendar,
    Bolt,
    TrendingUp,
    Check,
    Info,
    Eye,
    ShieldCheck,
    CheckCircle2,
    CheckCircle,
    AlertCircle,
    FileText,
    Image as ImageIcon,
    X
} from "lucide-react"
import { ImageUpload } from "@/components/ui/image-upload"
import Image from "next/image"

interface RifaInfo {
    id?: string
    slug?: string
    title?: string
    totalNumbers?: number
    numberPrice?: number
    drawDate?: string
}

export default function NovaRifaPage() {
    const [step, setStep] = useState(1)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")
    const [newRifaInfo, setNewRifaInfo] = useState<RifaInfo>({
        totalNumbers: 100,
        numberPrice: 10
    })
    const [coverImage, setCoverImage] = useState("")
    const [galleryImages, setGalleryImages] = useState<string[]>([])
    const router = useRouter()

    const steps = [
        { id: 1, name: "Informações", icon: Layout },
        { id: 2, name: "Números e Preço", icon: Settings },
        { id: 3, name: "Publicação", icon: Rocket }
    ]

    async function handleCreateDraft(formData: FormData) {
        setLoading(true)
        setError("")

        formData.set("coverImage", coverImage)
        formData.set("images", galleryImages.join(","))

        const res = await createRifaAction(formData)

        if (res?.error) {
            setError(res.error)
            setLoading(false)
            return
        }

        if (res?.success) {
            setNewRifaInfo(prev => ({
                ...prev,
                id: res.rifaId,
                slug: res.slug
            }))
            setStep(3)
        }
        setLoading(false)
    }

    async function handlePublish() {
        if (!newRifaInfo.id) return

        setLoading(true)
        const res = await publishRifaAction(newRifaInfo.id)
        if (res?.error) {
            setError(res.error)
            setLoading(false)
        } else {
            router.push(`/dashboard/rifas/${newRifaInfo.id}`)
        }
    }

    const totalRevenue = (newRifaInfo.totalNumbers || 0) * (newRifaInfo.numberPrice || 0)
    const platformFee = totalRevenue * 0.05
    const estimatedProfit = totalRevenue - platformFee

    return (
        <div className="max-w-5xl mx-auto space-y-8 pb-20">
            {/* Breadcrumbs & Header */}
            <div className="space-y-4">
                <nav className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest">
                    <span>Lançar Campanha</span>
                    <ChevronRight className="h-3 w-3" />
                    <span className="text-primary">{steps[step - 1].name}</span>
                </nav>

                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div>
                        <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-wider mb-2">
                            <span>Etapa {step} de 3</span>
                            <div className="h-1 w-32 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-primary transition-all duration-500"
                                    style={{ width: `${(step / 3) * 100}%` }}
                                ></div>
                            </div>
                        </div>
                        <h1 className="text-4xl font-black text-slate-900 dark:text-slate-50 tracking-tight">
                            {step === 1 && "Primeiro, os detalhes da campanha"}
                            {step === 2 && "Configure as cotas e valores"}
                            {step === 3 && "Revise e ative sua campanha"}
                        </h1>
                    </div>
                </div>
            </div>

            {/* Step Indicators */}
            <div className="grid grid-cols-3 gap-4">
                {steps.map((s) => (
                    <div
                        key={s.id}
                        className={`relative p-4 rounded-2xl border transition-all duration-300 ${step === s.id
                            ? "bg-white dark:bg-slate-900 border-primary shadow-lg shadow-primary/5"
                            : step > s.id
                                ? "bg-primary/5 border-primary/20"
                                : "bg-slate-50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-800"
                            }`}
                    >
                        <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${step === s.id ? "bg-primary text-white" : step > s.id ? "bg-primary/20 text-primary" : "bg-slate-200 dark:bg-slate-800 text-slate-400"
                                }`}>
                                {step > s.id ? <Check className="h-6 w-6" /> : <s.icon className="h-5 w-5" />}
                            </div>
                            <div className="hidden md:block">
                                <p className={`text-[10px] font-bold uppercase tracking-wider ${step >= s.id ? "text-primary/60" : "text-slate-400"}`}>Passo 0{s.id}</p>
                                <p className={`text-sm font-bold ${step >= s.id ? "text-slate-900 dark:text-white" : "text-slate-400"}`}>{s.name}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Form Area */}
                <div className="lg:col-span-2 space-y-8">
                    <Card className="border-none shadow-none bg-transparent">
                        <CardContent className="p-0">
                            <form action={handleCreateDraft} id="rifaForm" className="space-y-8">
                                {/* Step 1: Informações Básicas */}
                                <div className={`${step === 1 ? "block" : "hidden"} space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500`}>
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
                                                    value={newRifaInfo.title || ""}
                                                    onChange={(e) => setNewRifaInfo(prev => ({ ...prev, title: e.target.value }))}
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
                                            />
                                            <p className="text-[11px] text-slate-400 ml-1">Escreva as regras que aparecerão para os compradores na página pública.</p>
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="category" className="text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">Categoria da Campanha</Label>
                                            <select
                                                id="category"
                                                name="category"
                                                className="flex h-14 w-full rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 py-2 text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all"
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
                                                                onClick={() => setGalleryImages(prev => prev.filter((_, idx) => idx !== i))}
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
                                                            onChange={(url) => setGalleryImages(prev => [...prev, url])}
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
                                            onClick={() => {
                                                if ((newRifaInfo.title?.length || 0) >= 3) setStep(2)
                                                else setError("O título deve ter no mínimo 3 caracteres.")
                                            }}
                                        >
                                            Próxima Etapa
                                            <ChevronRight className="h-5 w-5" />
                                        </Button>
                                    </div>
                                </div>

                                {/* Step 2: Números e Preços */}
                                <div className={`${step === 2 ? "block" : "hidden"} space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500`}>
                                    <section className="space-y-4">
                                        <Label className="text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">Quantidade de Cotas</Label>
                                        <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
                                            {[10, 50, 100, 250, 500, 1000].map((num) => (
                                                <button
                                                    key={num}
                                                    type="button"
                                                    onClick={() => setNewRifaInfo(prev => ({ ...prev, totalNumbers: num }))}
                                                    className={`h-14 rounded-2xl border-2 font-bold transition-all ${newRifaInfo.totalNumbers === num
                                                        ? "border-primary bg-primary/5 text-primary"
                                                        : "border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:border-primary/30"
                                                        }`}
                                                >
                                                    {num}
                                                </button>
                                            ))}
                                        </div>
                                        <div className="relative group">
                                            <Label htmlFor="totalNumbers" className="text-xs text-slate-500 mb-2 block">Ou digite uma quantidade personalizada:</Label>
                                            <Input
                                                id="totalNumbers"
                                                name="totalNumbers"
                                                type="number"
                                                required
                                                min={10}
                                                max={10000}
                                                placeholder="Ex: 1500"
                                                className="h-14 rounded-2xl border-slate-200 dark:border-slate-800"
                                                value={newRifaInfo.totalNumbers || ""}
                                                onChange={(e) => setNewRifaInfo(prev => ({ ...prev, totalNumbers: Number(e.target.value) }))}
                                            />
                                        </div>
                                    </section>

                                    <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <Label htmlFor="numberPrice" className="text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">Valor por Cota</Label>
                                            <div className="relative group">
                                                <div className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-slate-400 group-focus-within:text-primary transition-colors">R$</div>
                                                <Input
                                                    id="numberPrice"
                                                    name="numberPrice"
                                                    type="number"
                                                    step="0.01"
                                                    required
                                                    min={1}
                                                    className="h-14 pl-12 rounded-2xl border-slate-200 dark:border-slate-800"
                                                    value={newRifaInfo.numberPrice || ""}
                                                    onChange={(e) => setNewRifaInfo(prev => ({ ...prev, numberPrice: Number(e.target.value) }))}
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="drawDate" className="text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">Data Prevista da Premiação</Label>
                                            <div className="relative group">
                                                <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-primary transition-colors" />
                                                <Input
                                                    id="drawDate"
                                                    name="drawDate"
                                                    type="date"
                                                    className="h-14 pl-12 rounded-2xl border-slate-200 dark:border-slate-800"
                                                    value={newRifaInfo.drawDate || ""}
                                                    onChange={(e) => setNewRifaInfo(prev => ({ ...prev, drawDate: e.target.value }))}
                                                />
                                            </div>
                                        </div>
                                    </section>

                                    <section className="p-6 rounded-3xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                                                    <Bolt className="h-6 w-6" />
                                                </div>
                                                <div>
                                                    <p className="font-bold text-slate-900 dark:text-white">Premiação Automática</p>
                                                    <p className="text-xs text-slate-500">O sistema libera o resultado assim que a meta for atingida.</p>
                                                </div>
                                            </div>
                                            <div className="relative inline-flex items-center cursor-pointer">
                                                <input type="checkbox" name="autoDraw" className="sr-only peer" defaultChecked />
                                                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                                            </div>
                                        </div>
                                    </section>

                                    <div className="flex items-center justify-between pt-6 border-t border-slate-100 dark:border-slate-800">
                                        <Button type="button" variant="ghost" size="lg" className="h-14 px-8 rounded-2xl font-bold" onClick={() => setStep(1)}>
                                            Voltar
                                        </Button>
                                        <Button type="submit" size="lg" className="h-14 px-10 rounded-2xl font-bold shadow-lg shadow-primary/20" disabled={loading}>
                                            {loading ? "Salvando..." : "Salvar e Revisar"}
                                        </Button>
                                    </div>
                                </div>

                                {/* Step 3: Revisão e Publicação */}
                                {step === 3 && (
                                    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                            {/* Checklist */}
                                            <div className="space-y-4">
                                                <h3 className="text-lg font-bold flex items-center gap-2">
                                                    <CheckCircle2 className="h-5 w-5 text-primary" />
                                                    Conferência de Dados
                                                </h3>
                                                <div className="space-y-3">
                                                    <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 flex items-start gap-3">
                                                        <div className="w-6 h-6 rounded-full bg-green-100 text-green-600 flex items-center justify-center shrink-0">
                                                            <Check className="h-4 w-4" />
                                                        </div>
                                                        <div>
                                                            <p className="text-sm font-bold">Título e Descrição</p>
                                                            <p className="text-xs text-slate-500">{newRifaInfo.title}</p>
                                                        </div>
                                                    </div>
                                                    <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 flex items-start gap-3">
                                                        <div className="w-6 h-6 rounded-full bg-green-100 text-green-600 flex items-center justify-center shrink-0">
                                                            <Check className="h-4 w-4" />
                                                        </div>
                                                        <div>
                                                            <p className="text-sm font-bold">Configuração de Cotas</p>
                                                            <p className="text-xs text-slate-500">{newRifaInfo.totalNumbers} cotas a R$ {newRifaInfo.numberPrice?.toFixed(2)}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Marketing Card */}
                                            <div className="p-6 rounded-3xl bg-primary/5 border border-primary/10 space-y-4">
                                                <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                                                    <Rocket className="h-6 w-6" />
                                                </div>
                                                <h4 className="font-bold text-slate-900 dark:text-white">Pronto para o lançamento?</h4>
                                                <p className="text-sm text-slate-600 dark:text-slate-400">Ao publicar, sua rifa ficará disponível imediatamente para receber pagamentos e você poderá compartilhar o link.</p>
                                                <ul className="space-y-2">
                                                    {["Link de divulgação exclusivo", "Gestão de cotas em tempo real", "Recebimento via PIX automático"].map((item, i) => (
                                                        <li key={i} className="flex items-center gap-2 text-xs font-medium text-slate-500">
                                                            <CheckCircle className="h-3.5 w-3.5 text-primary" />
                                                            {item}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        </div>

                                        <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-slate-100 dark:border-slate-800">
                                            <Button type="button" variant="outline" size="lg" className="flex-1 h-14 rounded-2xl font-bold" onClick={() => router.push(`/dashboard/rifas/${newRifaInfo.id}`)}>
                                                Manter como Rascunho
                                            </Button>
                                            <Button type="button" size="lg" className="flex-1 h-14 rounded-2xl font-bold shadow-lg shadow-primary/20" onClick={handlePublish} disabled={loading}>
                                                {loading ? "Ativando..." : "Ativar Campanha Agora 🚀"}
                                            </Button>
                                            {newRifaInfo.id && (
                                                <ShareRaffleModal raffleUrl={`${window.location.origin}/dashboard/rifas/${newRifaInfo.id}`} raffleTitle={newRifaInfo.title || "Campanha"} />
                                            )}
                                        </div>
                                    </div>
                                )}

                                {error && (
                                    <div className="flex items-center gap-3 p-4 bg-red-50 text-red-600 rounded-2xl border border-red-100 animate-in shake duration-300">
                                        <AlertCircle className="h-5 w-5" />
                                        <p className="text-sm font-bold">{error}</p>
                                    </div>
                                )}
                            </form>
                        </CardContent>
                    </Card>
                </div>

                {/* Sidebar Summary Area */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="sticky top-8 space-y-6">
                        {/* Meta Card */}
                        <div className="p-8 rounded-[2.5rem] bg-primary text-white shadow-2xl shadow-primary/30 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform">
                                <TrendingUp className="h-24 w-24" />
                            </div>

                            <div className="relative z-10 space-y-6">
                                <div className="space-y-1">
                                    <p className="text-primary-foreground/70 text-xs font-bold uppercase tracking-widest">Meta de Arrecadação</p>
                                    <h3 className="text-4xl font-black tracking-tight">R$ {totalRevenue > 0 ? totalRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 }) : "0,00"}</h3>
                                </div>

                                <div className="space-y-3 bg-white/10 backdrop-blur-md p-5 rounded-3xl border border-white/10">
                                    <div className="flex justify-between items-center text-sm font-medium">
                                        <span className="opacity-70">Cotas</span>
                                        <span>{newRifaInfo.totalNumbers || 0}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-sm font-medium">
                                        <span className="opacity-70">Valor Unitário</span>
                                        <span>R$ {newRifaInfo.numberPrice?.toFixed(2) || "0,00"}</span>
                                    </div>
                                    <div className="h-px bg-white/10 my-1"></div>
                                    <div className="flex justify-between items-center text-sm font-bold">
                                        <span className="opacity-70">Taxa Plataforma (5%)</span>
                                        <span className="text-red-200">- R$ {platformFee.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                                    </div>
                                </div>

                                <div className="pt-2">
                                    <p className="text-primary-foreground/70 text-xs font-bold uppercase tracking-widest">Seu lucro estimado</p>
                                    <p className="text-2xl font-black">R$ {estimatedProfit.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                                </div>
                            </div>
                        </div>

                        {/* Help Desk */}
                        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 space-y-4">
                            <h4 className="font-bold text-slate-900 dark:text-white">Dica de Especialista</h4>
                            <p className="text-sm text-slate-500 leading-relaxed">
                                Campanhas com valores entre <span className="text-primary font-bold">R$ 5,00 e R$ 20,00</span> tendem a engajar 3x mais por serem valores de apoio acessíveis.
                            </p>
                            <Button variant="secondary" className="w-full rounded-2xl h-12 font-bold text-xs uppercase tracking-wider">
                                Ver Dicas de Engajamento
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div >
    )
}
