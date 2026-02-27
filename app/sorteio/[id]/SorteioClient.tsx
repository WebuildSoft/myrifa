"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
    Trophy,
    ArrowLeft,
    RefreshCw,
    CheckCircle2,
    AlertTriangle,
    Zap,
    Users,
    Ticket,
    Target,
    Star,
    ShieldCheck,
    Coins,
    UserCircle2
} from "lucide-react"
import Link from "next/link"
import { drawRifaAction } from "@/actions/draw"
import confetti from "canvas-confetti"

interface SorteioPageProps {
    rifaId: string
    title: string
    totalPaid: number
    totalNumbers: number
    numberPrice: number
    minPercent: number
    alreadyDrawn: boolean
    winnerNumber?: number | null
    winnerName?: string | null
}

export default function SorteioClient({
    rifaId, title, totalPaid, totalNumbers, numberPrice, minPercent, alreadyDrawn, winnerNumber, winnerName
}: SorteioPageProps) {
    const [drawing, setDrawing] = useState(false)
    const [result, setResult] = useState<{ number: number, name: string } | null>(null)
    const [error, setError] = useState("")
    const [slotNumbers, setSlotNumbers] = useState<string[]>(["0", "0", "0"])
    const [currentProgress, setCurrentProgress] = useState(0)

    const progress = Math.round((totalPaid / totalNumbers) * 100)
    const canDraw = progress >= minPercent
    const totalPrize = totalPaid * numberPrice

    // Animation interval ref
    const intervalRef = useRef<NodeJS.Timeout | null>(null)

    const startSlotAnimation = () => {
        if (intervalRef.current) clearInterval(intervalRef.current)

        intervalRef.current = setInterval(() => {
            setSlotNumbers([
                Math.floor(Math.random() * 10).toString(),
                Math.floor(Math.random() * 10).toString(),
                Math.floor(Math.random() * 10).toString()
            ])
            setCurrentProgress(prev => (prev < 90 ? prev + 2 : prev))
        }, 80)
    }

    const stopSlotAnimation = (finalNumber: number) => {
        if (intervalRef.current) {
            clearInterval(intervalRef.current)
            intervalRef.current = null
        }
        const formatted = finalNumber.toString().padStart(3, '0').split('')
        setSlotNumbers(formatted)
        setCurrentProgress(100)

        // Trigger confetti
        confetti({
            particleCount: 200,
            spread: 90,
            origin: { y: 0.5 },
            colors: ['#fbbf24', '#7c3bed', '#ffffff']
        })
    }

    const handleDraw = async () => {
        if (!canDraw || alreadyDrawn) return

        if (!window.confirm("Atenção! Esta ação é irreversível e definirá o vencedor da campanha. Deseja continuar?")) {
            return
        }

        setDrawing(true)
        setError("")
        setCurrentProgress(0)
        startSlotAnimation()

        try {
            // Minimum animation time for suspense (4 seconds)
            const [res] = await Promise.all([
                drawRifaAction(rifaId),
                new Promise(r => setTimeout(r, 4500))
            ])

            if (res?.error) {
                setError(res.error)
                setDrawing(false)
                if (intervalRef.current) clearInterval(intervalRef.current)
                return
            }

            if (res?.success) {
                const winnerNum = res.winnerNumber as number
                stopSlotAnimation(winnerNum)
                setResult({
                    number: winnerNum,
                    name: res.winnerName as string
                })
            }
        } catch (e) {
            setError("Ocorreu um erro ao definir o resultado.")
            if (intervalRef.current) clearInterval(intervalRef.current)
        } finally {
            setDrawing(false)
        }
    }

    return (
        <div className="min-h-screen w-full flex flex-col items-center justify-center relative overflow-hidden font-sans antialiased pb-24"
            style={{ background: 'radial-gradient(circle at center, #7c3bed 0%, #1e1b4b 100%)' }}>

            {/* Header Overlay */}
            <header className="absolute top-0 w-full flex items-center justify-between px-6 md:px-10 py-6 z-50 bg-transparent">
                <Link href={`/dashboard/rifas/${rifaId}`} className="flex items-center gap-4 text-white hover:opacity-80 transition-opacity">
                    <div className="text-amber-400">
                        <Star className="h-8 w-8 fill-amber-400" />
                    </div>
                    <div className="flex flex-col">
                        <h2 className="text-white text-xl md:text-2xl font-black tracking-tighter leading-none">MyRifa</h2>
                        <span className="text-[10px] text-white/40 uppercase tracking-[0.3em] font-bold">Resultado Certificado</span>
                    </div>
                </Link>

                <div className="flex items-center gap-4">
                    <div className="flex flex-col items-end">
                        <span className="text-white/40 text-[10px] uppercase tracking-widest font-black">Status do Canal</span>
                        <div className="flex items-center gap-2">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-400"></span>
                            </span>
                            <span className="text-amber-400 text-xs font-black uppercase tracking-widest">AO VIVO</span>
                        </div>
                    </div>
                    <div className="bg-white/10 backdrop-blur-xl px-4 py-2 rounded-full border border-white/10 flex items-center gap-2">
                        <UserCircle2 className="h-5 w-5 text-primary" />
                        <span className="text-white text-xs font-bold">Admin</span>
                    </div>
                </div>
            </header>

            {/* Background Decoration */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/20 blur-[120px] rounded-full"></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-amber-400/10 blur-[80px] rounded-full"></div>
                <Target className="absolute top-10 left-10 text-amber-400/5 size-64 -rotate-12" />
                <ShieldCheck className="absolute bottom-10 right-10 text-amber-400/5 size-48 rotate-12" />
            </div>

            <main className="relative z-10 w-full max-w-4xl px-6 flex flex-col items-center text-center">
                {/* Title Section */}
                <div className="mb-12 space-y-2">
                    <h1 className="text-white text-5xl md:text-8xl font-black tracking-tighter drop-shadow-2xl">
                        {drawing ? 'Definindo' : (alreadyDrawn || result ? 'Vencedor!' : 'Finalizar Campanha')}
                        {drawing && <span className="text-amber-400 animate-pulse">...</span>}
                    </h1>
                    <p className="text-primary/40 text-sm md:text-xl font-black uppercase tracking-[0.4em]">
                        {drawing ? 'Gerando resultado oficial' : (alreadyDrawn || result ? 'Campanha Finalizada com Sucesso' : 'Prepare-se para premiar o apoiador')}
                    </p>
                </div>

                {/* Slot Machine Display */}
                <div className="relative group mb-16">
                    <div className="absolute -inset-4 bg-amber-400/20 blur-2xl rounded-[3rem] opacity-50 group-hover:opacity-100 transition-opacity"></div>
                    <div className="relative flex items-center gap-2 md:gap-4 p-4 md:p-8 bg-white/5 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] shadow-2xl">
                        {slotNumbers.map((num, i) => (
                            <div key={i} className="w-24 h-36 md:w-44 md:h-64 bg-slate-900 rounded-2xl overflow-hidden relative border border-white/10 shadow-inner">
                                {/* Slot Background Gradient */}
                                <div className="absolute inset-0 z-10"
                                    style={{ background: 'linear-gradient(180deg, rgba(124, 59, 237, 0.2) 0%, rgba(124, 59, 237, 0) 50%, rgba(124, 59, 237, 0.2) 100%)' }}></div>

                                <div className="flex flex-col items-center justify-center h-full">
                                    <span className={`text-7xl md:text-[10rem] font-black text-amber-400 leading-none ${drawing ? 'blur-[1px]' : ''}`}
                                        style={{ fontFamily: 'Syne, sans-serif', textShadow: '0 0 20px rgba(251, 191, 36, 0.4)' }}>
                                        {num}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Action Area */}
                {(alreadyDrawn || result) ? (
                    <div className="w-full max-w-md space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
                        <div className="bg-white/10 backdrop-blur-xl rounded-[2.5rem] p-8 border border-white/10 text-left">
                            <div className="flex items-center justify-between mb-4">
                                <span className="text-amber-400 text-[10px] font-black uppercase tracking-widest">Comprador(a) Premiado(a)</span>
                                <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                            </div>
                            <h3 className="text-3xl font-black text-white leading-tight break-words mb-4 uppercase">
                                {result?.name || winnerName || 'Carregando...'}
                            </h3>
                            <div className="flex justify-between items-end border-t border-white/10 pt-4">
                                <div>
                                    <p className="text-white/40 text-[9px] font-black uppercase tracking-widest leading-none mb-1">Cota Premiada</p>
                                    <p className="text-2xl font-black text-amber-400">Nº {(result?.number || winnerNumber)?.toString().padStart(3, '0')}</p>
                                </div>
                                <Trophy className="h-10 w-10 text-amber-400/20" />
                            </div>
                        </div>

                        <Button variant="ghost" className="h-14 w-full rounded-2xl font-black text-xs uppercase tracking-[0.2em] text-white border border-white/10 hover:bg-white/5 active:scale-95 transition-all group" asChild>
                            <Link href={`/dashboard/rifas/${rifaId}`}>
                                <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
                                Voltar ao Painel
                            </Link>
                        </Button>
                    </div>
                ) : (
                    <div className="w-full max-w-2xl space-y-12">
                        {/* Progress Bar */}
                        {drawing && (
                            <div className="space-y-4">
                                <div className="flex justify-between items-end">
                                    <div className="text-left">
                                        <p className="text-white/40 text-[10px] font-black uppercase tracking-[0.2em]">Processando Apoios</p>
                                        <p className="text-white text-lg font-bold">Identificando vencedor oficial</p>
                                    </div>
                                    <p className="text-amber-400 text-2xl font-black tracking-tighter">{currentProgress}%</p>
                                </div>
                                <div className="h-3 w-full bg-white/10 rounded-full overflow-hidden border border-white/5">
                                    <div className="h-full bg-primary transition-all duration-300 relative" style={{ width: `${currentProgress}%` }}>
                                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {!drawing && (
                            <div className="flex flex-col items-center gap-8">
                                {!canDraw && (
                                    <div className="flex items-center gap-2 px-6 py-2 bg-amber-400/10 border border-amber-400/20 rounded-full">
                                        <AlertTriangle className="h-4 w-4 text-amber-400" />
                                        <span className="text-[10px] font-black text-amber-400 uppercase tracking-widest leading-none">
                                            Meta de Apoio: {minPercent}% não atingida ({progress}%)
                                        </span>
                                    </div>
                                )}

                                {error && (
                                    <p className="text-xs font-black text-red-400 uppercase tracking-widest bg-red-400/10 px-4 py-2 rounded-lg border border-red-400/20">{error}</p>
                                )}

                                <Button
                                    size="lg"
                                    className={`h-24 px-12 text-lg font-black uppercase tracking-[0.3em] rounded-full shadow-[0_0_50px_rgba(236,91,19,0.2)] transition-all transform active:scale-95 flex items-center gap-4 ${!canDraw ? 'bg-slate-800 text-slate-500 cursor-not-allowed opacity-50' : 'bg-primary hover:bg-primary/90 text-white hover:shadow-[0_0_60px_rgba(124,59,237,0.4)]'}`}
                                    disabled={!canDraw}
                                    onClick={handleDraw}
                                >
                                    <Zap className="h-6 w-6 fill-white" />
                                    Finalizar e Premiar
                                </Button>

                                {/* Footer Stats */}
                                <div className="flex flex-wrap gap-8 md:gap-12 justify-center pt-8 border-t border-white/5 w-full">
                                    <div className="flex flex-col items-center">
                                        <div className="flex items-center gap-2 text-amber-400/60 mb-1">
                                            <Users className="h-3 w-3" />
                                            <p className="text-[9px] font-black uppercase tracking-widest">Apoiadores</p>
                                        </div>
                                        <p className="text-white text-2xl md:text-3xl font-black">{totalPaid.toLocaleString('pt-BR')}</p>
                                    </div>
                                    <div className="w-px h-10 bg-white/10 self-center hidden md:block"></div>
                                    <div className="flex flex-col items-center">
                                        <div className="flex items-center gap-2 text-amber-400/60 mb-1">
                                            <Coins className="h-3 w-3" />
                                            <p className="text-[9px] font-black uppercase tracking-widest">Prêmio Total</p>
                                        </div>
                                        <p className="text-white text-2xl md:text-3xl font-black">
                                            {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(totalPrize)}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </main>

            {/* Footer Decorative */}
            <footer className="absolute bottom-10 w-full text-center z-10">
                <p className="text-white/20 text-[9px] uppercase tracking-[0.3em] font-black">
                    © 2024 MyRifa • Sistema de Auditoria de Resultados Baseado em Blockchain
                </p>
            </footer>
        </div>
    )
}
