"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { AlertCircle, ChevronRight, Check, Layout, Settings, Rocket } from "lucide-react"

import { createRifaAction, publishRifaAction } from "@/actions/rifas"
import { InfoStep } from "@/components/dashboard/rifas/nova/InfoStep"
import { ThemeStep } from "@/components/dashboard/rifas/nova/ThemeStep"
import { NumbersStep } from "@/components/dashboard/rifas/nova/NumbersStep"
import { ReviewStep } from "@/components/dashboard/rifas/nova/ReviewStep"
import { WizardSummary } from "@/components/dashboard/rifas/nova/WizardSummary"
import { RifaTheme } from "@/lib/themes"
import { Paintbrush } from "lucide-react"
import { BalloonShape } from "@prisma/client"

interface RifaInfo {
    id?: string
    slug?: string
    title: string
    description: string
    rules: string
    totalNumbers: number
    numberPrice: number
    drawDate: string
    category: string
    theme: string
    balloonShape: BalloonShape
}

interface NovaRifaPageProps {
    userPlan: string
}

export default function NovaRifaPage({ userPlan }: NovaRifaPageProps) {
    const [step, setStep] = useState(1)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")
    const [rifaInfo, setRifaInfo] = useState<RifaInfo>({
        title: "",
        description: "",
        rules: "",
        totalNumbers: 100,
        numberPrice: 10,
        drawDate: "",
        category: "SORTEIO",
        theme: "DEFAULT",
        balloonShape: "ROUNDED"
    })
    const [coverImage, setCoverImage] = useState("")
    const [galleryImages, setGalleryImages] = useState<string[]>([])
    const [prizes, setPrizes] = useState([{ title: "", position: 1 }])
    const router = useRouter()

    const steps = [
        { id: 1, name: "Informações", icon: Layout },
        { id: 2, name: "Visual e Preview", icon: Paintbrush },
        { id: 3, name: "Números e Preço", icon: Settings },
        { id: 4, name: "Publicação", icon: Rocket }
    ]

    const handleCreateDraft = async (e?: React.FormEvent) => {
        if (e) e.preventDefault()
        setLoading(true)
        setError("")

        const formData = new FormData()
        formData.append("title", rifaInfo.title)
        formData.append("description", rifaInfo.description)
        formData.append("rules", rifaInfo.rules)
        formData.append("totalNumbers", rifaInfo.totalNumbers.toString())
        formData.append("numberPrice", rifaInfo.numberPrice.toString())
        formData.append("drawDate", rifaInfo.drawDate)
        formData.append("category", rifaInfo.category)
        formData.append("theme", rifaInfo.theme)
        formData.append("balloonShape", rifaInfo.balloonShape)
        formData.append("coverImage", coverImage)
        formData.append("images", galleryImages.join(","))
        formData.append("prizes", JSON.stringify(prizes.filter(p => p.title.trim() !== "")))

        const res = await createRifaAction(formData)

        if (res?.error) {
            setError(res.error)
            setLoading(false)
            return
        }

        if (res?.success) {
            setRifaInfo(prev => ({ ...prev, id: res.rifaId, slug: res.slug }))
            setStep(4)
        }
        setLoading(false)
    }

    const handlePublish = async () => {
        if (!rifaInfo.id) return
        setLoading(true)
        const res = await publishRifaAction(rifaInfo.id)
        if (res?.error) {
            setError(res.error)
            setLoading(false)
        } else {
            router.push(`/dashboard/rifas/${rifaInfo.id}`)
        }
    }

    return (
        <div className="max-w-5xl mx-auto space-y-8 pb-20">
            {/* Header */}
            <div className="space-y-4">
                <nav className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest">
                    <span>Lançar Campanha</span>
                    <ChevronRight className="h-3 w-3" />
                    <span className="text-primary">{steps[step - 1].name}</span>
                </nav>

                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div>
                        <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-wider mb-2">
                            <span>Etapa {step} de 4</span>
                            <div className="h-1 w-32 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-primary transition-all duration-500"
                                    style={{ width: `${(step / 4) * 100}%` }}
                                ></div>
                            </div>
                        </div>
                        <h1 className="text-4xl font-black text-slate-900 dark:text-slate-50 tracking-tight">
                            {step === 1 && "Primeiro, os detalhes da campanha"}
                            {step === 2 && "Personalize o visual da página"}
                            {step === 3 && "Configure as cotas e valores"}
                            {step === 4 && "Revise e ative sua campanha"}
                        </h1>
                    </div>
                </div>
            </div>

            {/* Step Indicators */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
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
                <div className="lg:col-span-2 space-y-8">
                    <Card className="border-none shadow-none bg-transparent">
                        <CardContent className="p-0">
                            <form onSubmit={handleCreateDraft}>
                                {step === 1 && (
                                    <InfoStep
                                        title={rifaInfo.title} setTitle={(val) => setRifaInfo(p => ({ ...p, title: val }))}
                                        description={rifaInfo.description} setDescription={(val) => setRifaInfo(p => ({ ...p, description: val }))}
                                        rules={rifaInfo.rules} setRules={(val) => setRifaInfo(p => ({ ...p, rules: val }))}
                                        prizes={prizes} setPrizes={setPrizes}
                                        category={rifaInfo.category} setCategory={(val) => setRifaInfo(p => ({ ...p, category: val }))}
                                        coverImage={coverImage} setCoverImage={setCoverImage}
                                        galleryImages={galleryImages} setGalleryImages={setGalleryImages}
                                        onNext={() => setStep(2)}
                                        setError={setError}
                                    />
                                )}

                                {step === 2 && (
                                    <ThemeStep
                                        title={rifaInfo.title}
                                        coverImage={coverImage}
                                        theme={rifaInfo.theme as RifaTheme}
                                        setTheme={(val) => setRifaInfo(p => ({ ...p, theme: val }))}
                                        shape={rifaInfo.balloonShape}
                                        setShape={(val) => setRifaInfo(p => ({ ...p, balloonShape: val }))}
                                        userPlan={userPlan}
                                        onBack={() => setStep(1)}
                                        onNext={() => setStep(3)}
                                    />
                                )}

                                {step === 3 && (
                                    <NumbersStep
                                        totalNumbers={rifaInfo.totalNumbers} setTotalNumbers={(val) => setRifaInfo(p => ({ ...p, totalNumbers: val }))}
                                        numberPrice={rifaInfo.numberPrice} setNumberPrice={(val) => setRifaInfo(p => ({ ...p, numberPrice: val }))}
                                        drawDate={rifaInfo.drawDate} setDrawDate={(val) => setRifaInfo(p => ({ ...p, drawDate: val }))}
                                        loading={loading}
                                        onBack={() => setStep(2)}
                                    />
                                )}

                                {step === 4 && (
                                    <ReviewStep
                                        rifaId={rifaInfo.id}
                                        title={rifaInfo.title}
                                        description={rifaInfo.description}
                                        prizes={prizes}
                                        totalNumbers={rifaInfo.totalNumbers}
                                        numberPrice={rifaInfo.numberPrice}
                                        drawDate={rifaInfo.drawDate}
                                        theme={rifaInfo.theme}
                                        loading={loading}
                                        onPublish={handlePublish}
                                        onKeepDraft={() => router.push(`/dashboard/rifas/${rifaInfo.id}`)}
                                    />
                                )}
                            </form>
                        </CardContent>
                    </Card>

                    {error && (
                        <div className="flex items-center gap-3 p-4 bg-red-50 text-red-600 rounded-2xl border border-red-100 animate-in shake duration-300">
                            <AlertCircle className="h-5 w-5" />
                            <p className="text-sm font-bold">{error}</p>
                        </div>
                    )}
                </div>

                <div className="lg:col-span-1">
                    <WizardSummary
                        totalNumbers={rifaInfo.totalNumbers}
                        numberPrice={rifaInfo.numberPrice}
                        currentStep={step}
                    />
                </div>
            </div>
        </div>
    )
}
