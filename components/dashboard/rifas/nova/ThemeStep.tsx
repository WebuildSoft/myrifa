"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ChevronRight, ChevronLeft, Smartphone, Ticket, Sparkles, Monitor, CreditCard, Eye, Layout } from "lucide-react"
import { ThemePicker } from "./ThemePicker"
import { RifaTheme, getThemeConfig } from "@/lib/themes"
import { ShapePicker } from "./ShapePicker"
import { SHAPE_CONFIGS } from "@/lib/shapes"
import { BalloonShape } from "@prisma/client"
import { cn } from "@/lib/utils"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"

interface ThemeStepProps {
    title: string
    coverImage: string
    theme: RifaTheme
    setTheme: (val: RifaTheme) => void
    shape: BalloonShape
    setShape: (val: BalloonShape) => void
    userPlan: string
    onNext: () => void
    onBack: () => void
}

export function ThemeStep({
    title,
    coverImage,
    theme,
    setTheme,
    shape,
    setShape,
    userPlan,
    onNext,
    onBack
}: ThemeStepProps) {
    const [previewMode, setPreviewMode] = useState<'mobile' | 'desktop'>('mobile')
    const themeConfig = getThemeConfig(theme)
    const shapeConfig = SHAPE_CONFIGS[shape] || SHAPE_CONFIGS.ROUNDED

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                {/* Selector Column */}
                <div className="space-y-6">
                    <div>
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">Identidade Visual</h3>
                        <p className="text-sm text-slate-500">O tema altera cores e o visual geral da sua página.</p>
                    </div>

                    <ThemePicker value={theme} onChange={setTheme} userPlan={userPlan} />

                    <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
                        <ShapePicker value={shape} onChange={setShape} userPlan={userPlan} />
                    </div>
                </div>

                {/* Modal Trigger/Card Column */}
                <div className="space-y-6">
                    <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border-2 border-slate-100 dark:border-slate-800 shadow-xl relative overflow-hidden group">
                        {/* Decorative Background */}
                        <div className={cn("absolute inset-0 opacity-5 transition-colors duration-500", themeConfig.body)} />

                        <div className="relative z-10 text-center space-y-6">
                            <div className={cn(
                                "size-16 rounded-2xl mx-auto flex items-center justify-center transition-transform group-hover:scale-110 duration-500 shadow-lg",
                                themeConfig.accent, themeConfig.primary
                            )}>
                                <Layout className="h-8 w-8" />
                            </div>

                            <div>
                                <h4 className="text-xl font-black text-slate-900 dark:text-white mb-2">Veja o resultado final</h4>
                                <p className="text-sm text-slate-500 max-w-[280px] mx-auto">
                                    Confira como sua página de rifa aparecerá tanto no celular quanto no computador antes de continuar.
                                </p>
                            </div>

                            <Dialog>
                                <DialogTrigger asChild>
                                    <Button
                                        size="lg"
                                        className={cn("h-14 px-8 rounded-2xl font-black gap-2 shadow-xl transition-all hover:scale-105 active:scale-95", themeConfig.primary.replace('text-', 'bg-'))}
                                    >
                                        <Eye className="h-5 w-5" />
                                        Visualizar Página
                                    </Button>
                                </DialogTrigger>

                                <DialogContent className="max-w-[95vw] lg:max-w-6xl h-[90vh] p-0 overflow-hidden border-none bg-slate-100 dark:bg-slate-950">
                                    <div className="h-full flex flex-col">
                                        <DialogHeader className="p-6 pb-2 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
                                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                                <DialogTitle className="text-xl font-black flex items-center gap-2">
                                                    <Sparkles className={cn("h-5 w-5", themeConfig.primary)} />
                                                    Visualização da Campanha
                                                </DialogTitle>

                                                <div className="flex p-1 bg-slate-100 dark:bg-slate-800 rounded-xl self-center md:self-auto">
                                                    <button
                                                        onClick={() => setPreviewMode('mobile')}
                                                        className={cn(
                                                            "flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all",
                                                            previewMode === 'mobile' ? "bg-white dark:bg-slate-700 shadow-sm text-primary" : "text-slate-500"
                                                        )}
                                                    >
                                                        <Smartphone className="h-4 w-4" />
                                                        Mobile
                                                    </button>
                                                    <button
                                                        onClick={() => setPreviewMode('desktop')}
                                                        className={cn(
                                                            "flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all",
                                                            previewMode === 'desktop' ? "bg-white dark:bg-slate-700 shadow-sm text-primary" : "text-slate-500"
                                                        )}
                                                    >
                                                        <Monitor className="h-4 w-4" />
                                                        Desktop
                                                    </button>
                                                </div>
                                            </div>
                                        </DialogHeader>

                                        <div className="flex-1 overflow-y-auto p-4 md:p-10 flex items-center justify-center">
                                            {previewMode === 'mobile' ? (
                                                /* Mobile Mockup */
                                                <div className="relative w-[300px] h-[600px] border-[10px] border-slate-900 rounded-[3.5rem] overflow-hidden shadow-2xl ring-4 ring-slate-900/10 transition-all duration-500 animate-in zoom-in-95">
                                                    {/* Notch */}
                                                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-7 bg-slate-900 rounded-b-3xl z-20 flex items-center justify-center">
                                                        <div className="w-2 h-2 rounded-full bg-slate-800 mr-2" />
                                                        <div className="w-8 h-1 rounded-full bg-slate-800" />
                                                    </div>

                                                    <div className={cn(
                                                        "h-full overflow-y-auto no-scrollbar pt-10 pb-10 transition-colors duration-500",
                                                        themeConfig.body,
                                                        themeConfig.text
                                                    )}>
                                                        {/* Header Mock */}
                                                        <div className="px-5 py-4 flex items-center justify-between opacity-50">
                                                            <div className="h-4 w-20 bg-slate-200 dark:bg-slate-800 rounded-full" />
                                                            <div className="h-10 w-10 rounded-full bg-slate-200 dark:bg-slate-800" />
                                                        </div>

                                                        {/* Hero Mock */}
                                                        <div className="px-5 mt-2">
                                                            <div className="relative aspect-video rounded-[2rem] overflow-hidden bg-slate-200 dark:bg-slate-800">
                                                                {coverImage ? (
                                                                    <img src={coverImage} alt="Cover" className="w-full h-full object-cover" />
                                                                ) : (
                                                                    <div className="w-full h-full flex items-center justify-center text-slate-400">
                                                                        <Sparkles className="h-12 w-12" />
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>

                                                        {/* Title & Stats Card */}
                                                        <div className="px-5 mt-6">
                                                            <div className="bg-white dark:bg-slate-900 rounded-[2rem] p-5 shadow-sm border border-slate-100 dark:border-slate-800">
                                                                <div className="flex items-center gap-2 mb-4">
                                                                    <div className={cn("size-6 rounded-full flex items-center justify-center", themeConfig.accent, themeConfig.primary)}>
                                                                        <div className="size-3 rounded-full bg-current" />
                                                                    </div>
                                                                    <div className="h-2 w-24 bg-slate-100 dark:bg-slate-800 rounded-full" />
                                                                </div>
                                                                <h4 className="text-base font-black mb-1 line-clamp-2">
                                                                    {title || "Sua Campanha Fantástica"}
                                                                </h4>
                                                                <div className={cn("text-xl font-black", themeConfig.primary)}>R$ 10,00</div>

                                                                {/* Mock Numbers preview for Mobile */}
                                                                <div className="mt-4 flex gap-2">
                                                                    <div className={cn("size-8 flex items-center justify-center bg-slate-100 dark:bg-slate-800 text-slate-400 font-bold text-xs ring-1 ring-slate-200 dark:ring-slate-700", shapeConfig.radiusClass)} style={{ clipPath: shapeConfig.clipPathStyle }}>00</div>
                                                                    <div className={cn("size-8 flex items-center justify-center bg-primary text-white font-bold text-xs shadow-md", shapeConfig.radiusClass)} style={{ clipPath: shapeConfig.clipPathStyle }}>01</div>
                                                                    <div className={cn("size-8 flex items-center justify-center bg-slate-100 dark:bg-slate-800 text-slate-400 font-bold text-xs ring-1 ring-slate-200 dark:ring-slate-700", shapeConfig.radiusClass)} style={{ clipPath: shapeConfig.clipPathStyle }}>02</div>
                                                                </div>

                                                                {/* Progress Mock */}
                                                                <div className="mt-6 space-y-3">
                                                                    <div className="flex justify-between text-xs font-black uppercase tracking-wider">
                                                                        <span className="text-slate-400">Objetivo</span>
                                                                        <span className={themeConfig.primary}>45%</span>
                                                                    </div>
                                                                    <div className="h-3 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                                                        <div className={cn("h-full w-[45%] rounded-full", themeConfig.primary.replace('text-', 'bg-'))} />
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <div className="px-5 mt-6 mb-10">
                                                            <div className={cn("w-full h-14 rounded-2xl flex items-center justify-center font-black text-white shadow-xl gap-2", themeConfig.primary.replace('text-', 'bg-'))}>
                                                                Comprar Cotas
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ) : (
                                                /* Desktop Mockup */
                                                <div className="w-full max-w-5xl border-[8px] border-slate-800 rounded-[2.5rem] overflow-hidden shadow-[0_40px_100px_-20px_rgba(0,0,0,0.5)] animate-in fade-in zoom-in-95 duration-500 bg-white dark:bg-slate-900">
                                                    {/* Browser Header */}
                                                    <div className="h-12 bg-slate-800 flex items-center px-6 justify-between">
                                                        <div className="flex gap-2">
                                                            <div className="size-3 rounded-full bg-rose-500" />
                                                            <div className="size-3 rounded-full bg-amber-500" />
                                                            <div className="size-3 rounded-full bg-emerald-500" />
                                                        </div>
                                                        <div className="flex-1 max-w-xl h-7 mx-10 bg-slate-700/50 rounded-lg flex items-center px-4">
                                                            <div className="h-2 w-full bg-slate-600 rounded-full" />
                                                        </div>
                                                        <div className="w-20" />
                                                    </div>

                                                    {/* Content */}
                                                    <div className={cn(
                                                        "h-[500px] overflow-y-auto no-scrollbar transition-colors duration-500",
                                                        themeConfig.body,
                                                        themeConfig.text
                                                    )}>
                                                        {/* Desktop Nav Mock */}
                                                        <div className="px-12 py-6 flex items-center justify-between opacity-30">
                                                            <div className="h-8 w-40 bg-slate-400 dark:bg-slate-700 rounded-full" />
                                                            <div className="flex gap-6">
                                                                <div className="h-5 w-20 bg-slate-400 dark:bg-slate-700 rounded-full" />
                                                                <div className="h-5 w-20 bg-slate-400 dark:bg-slate-700 rounded-full" />
                                                            </div>
                                                        </div>

                                                        <div className="max-w-6xl mx-auto px-12 py-8 grid grid-cols-12 gap-10">
                                                            <div className="col-span-12 lg:col-span-7 space-y-8">
                                                                <div className="aspect-video rounded-[2.5rem] overflow-hidden bg-slate-200 dark:bg-slate-800 shadow-2xl border border-white/10">
                                                                    {coverImage ? (
                                                                        <img src={coverImage} alt="Cover" className="w-full h-full object-cover" />
                                                                    ) : (
                                                                        <div className="w-full h-full flex items-center justify-center text-slate-400">
                                                                            <Sparkles className="h-20 w-20" />
                                                                        </div>
                                                                    )}
                                                                </div>
                                                                <div className="h-48 w-full bg-white dark:bg-slate-900/50 rounded-[2.5rem] p-8 shadow-sm border border-slate-100 dark:border-slate-800 opacity-40">
                                                                    <div className="h-6 w-1/3 bg-slate-100 dark:bg-slate-800 rounded-full mb-6" />
                                                                    <div className="space-y-3">
                                                                        <div className="h-4 w-full bg-slate-50 dark:bg-slate-800/50 rounded-full" />
                                                                        <div className="h-4 w-5/6 bg-slate-50 dark:bg-slate-800/50 rounded-full" />
                                                                        <div className="h-4 w-2/3 bg-slate-50 dark:bg-slate-800/50 rounded-full" />
                                                                    </div>
                                                                </div>
                                                            </div>

                                                            <div className="col-span-12 lg:col-span-5 space-y-10">
                                                                <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 shadow-2xl border border-slate-100 dark:border-slate-800">
                                                                    <span className={cn("px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest", themeConfig.accent, themeConfig.primary)}>
                                                                        SORTEIO ATIVO
                                                                    </span>
                                                                    <h4 className="text-3xl font-black mt-6 mb-2 leading-tight">{title || "Sua Campanha Premium"}</h4>
                                                                    <div className={cn("text-4xl font-black", themeConfig.primary)}>R$ 10,00</div>

                                                                    {/* Mock Numbers preview for Desktop */}
                                                                    <div className="mt-8">
                                                                        <span className="text-sm font-black uppercase tracking-wider text-slate-400 mb-3 block">Escolha seus números</span>
                                                                        <div className="flex gap-3">
                                                                            <div className={cn("size-10 flex items-center justify-center bg-slate-100 dark:bg-slate-800 text-slate-400 font-bold text-sm ring-1 ring-slate-200 dark:ring-slate-700 transition-all hover:ring-primary", shapeConfig.radiusClass)} style={{ clipPath: shapeConfig.clipPathStyle }}>00</div>
                                                                            <div className={cn("size-10 flex items-center justify-center bg-primary text-white font-bold text-sm shadow-xl scale-110", shapeConfig.radiusClass)} style={{ clipPath: shapeConfig.clipPathStyle }}>01</div>
                                                                            <div className={cn("size-10 flex items-center justify-center bg-slate-100 dark:bg-slate-800 text-slate-400 font-bold text-sm ring-1 ring-slate-200 dark:ring-slate-700 transition-all hover:ring-primary", shapeConfig.radiusClass)} style={{ clipPath: shapeConfig.clipPathStyle }}>02</div>
                                                                            <div className={cn("size-10 flex items-center justify-center bg-slate-100 dark:bg-slate-800 text-slate-400 font-bold text-sm ring-1 ring-slate-200 dark:ring-slate-700 transition-all hover:ring-primary", shapeConfig.radiusClass)} style={{ clipPath: shapeConfig.clipPathStyle }}>03</div>
                                                                        </div>
                                                                    </div>

                                                                    <div className="mt-10 space-y-4">
                                                                        <div className="flex justify-between items-end">
                                                                            <span className="text-sm font-black uppercase text-slate-400">Vendas</span>
                                                                            <div className={cn("text-base font-black", themeConfig.primary)}>45%</div>
                                                                        </div>
                                                                        <div className="h-4 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                                                            <div className={cn("h-full w-[45%] rounded-full shadow-lg", themeConfig.primary.replace('text-', 'bg-'))} />
                                                                        </div>
                                                                    </div>

                                                                    <div className={cn("mt-12 w-full h-16 rounded-2xl flex items-center justify-center text-lg font-black text-white shadow-2xl gap-3 transition-transform hover:scale-105", themeConfig.primary.replace('text-', 'bg-'))}>
                                                                        <CreditCard className="h-6 w-6" />
                                                                        Participar Agora
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </DialogContent>
                            </Dialog>
                        </div>
                    </div>

                    <div className="p-6 bg-slate-50 dark:bg-slate-900/30 rounded-3xl border border-slate-200 dark:border-slate-800">
                        <h5 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Dicas Profissionais</h5>
                        <ul className="space-y-4">
                            {[
                                { icon: Smartphone, title: "Mobile First", text: "80% dos compradores usam celular. Verifique se o tema valoriza seu prêmio em telas pequenas." },
                                { icon: Monitor, title: "Impacto no Desktop", text: "O layout desktop é ideal para campanhas de alto valor que exigem mais confiança." }
                            ].map((tip, i) => (
                                <li key={i} className="flex gap-4">
                                    <div className="size-10 rounded-xl bg-white dark:bg-slate-900 flex items-center justify-center text-slate-400 shrink-0 border border-slate-100 dark:border-slate-800">
                                        <tip.icon className="size-5" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-slate-900 dark:text-white">{tip.title}</p>
                                        <p className="text-[11px] text-slate-500 leading-tight">{tip.text}</p>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>

            {/* Navigation */}
            <div className="flex justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
                <Button
                    type="button"
                    variant="ghost"
                    size="lg"
                    className="h-14 px-8 rounded-2xl font-bold gap-2 text-slate-500"
                    onClick={onBack}
                >
                    <ChevronLeft className="h-5 w-5" />
                    Voltar
                </Button>
                <Button
                    type="button"
                    size="lg"
                    className="h-14 px-10 rounded-2xl font-bold gap-2 shadow-lg shadow-primary/20"
                    onClick={handleNext}
                >
                    Configurar Cotas
                    <ChevronRight className="h-5 w-5" />
                </Button>
            </div>
        </div>
    )

    function handleNext() {
        onNext()
    }
}
