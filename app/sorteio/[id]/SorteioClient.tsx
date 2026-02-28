"use client"

import { useState, useRef } from "react"
import confetti from "canvas-confetti"

import { drawRifaAction } from "@/actions/draw"
import { SorteioHeader } from "@/components/sorteio/SorteioHeader"
import { PrizeSelector } from "@/components/sorteio/PrizeSelector"
import { SlotMachine } from "@/components/sorteio/SlotMachine"
import { WinnerOverlay } from "@/components/sorteio/WinnerOverlay"
import { WinnersList } from "@/components/sorteio/WinnersList"
import { DrawControls } from "@/components/sorteio/DrawControls"

interface Prize {
    id: string
    title: string
    position: number
    winnerId?: string | null
    winnerNumber?: number | null
    winnerName?: string | null
    drawnAt?: Date | null
}

interface SorteioPageProps {
    rifaId: string
    title: string
    totalPaid: number
    totalNumbers: number
    numberPrice: number
    minPercent: number
    initialPrizes: Prize[]
    isDrawn: boolean
}

export default function SorteioClient({
    rifaId, totalPaid, totalNumbers, numberPrice, minPercent, initialPrizes
}: SorteioPageProps) {
    const [prizes, setPrizes] = useState<Prize[]>(initialPrizes)
    const [selectedPrizeId, setSelectedPrizeId] = useState<string | null>(
        initialPrizes.find(p => !p.winnerId)?.id || initialPrizes[0]?.id || null
    )
    const [drawing, setDrawing] = useState(false)
    const [result, setResult] = useState<{ number: number, name: string, prizeTitle: string } | null>(null)
    const [error, setError] = useState("")
    const [slotNumbers, setSlotNumbers] = useState<string[]>(["0", "0", "0"])
    const [currentProgress, setCurrentProgress] = useState(0)

    const intervalRef = useRef<NodeJS.Timeout | null>(null)
    const selectedPrize = prizes.find(p => p.id === selectedPrizeId)
    const progress = Math.round((totalPaid / totalNumbers) * 100)
    const canDraw = progress >= minPercent

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

        confetti({
            particleCount: 200,
            spread: 90,
            origin: { y: 0.5 },
            colors: ['#fbbf24', '#7c3bed', '#ffffff']
        })
    }

    const handleDraw = async () => {
        if (drawing || selectedPrize?.winnerId) return
        if (!window.confirm("Atenção! Esta ação é irreversível e definirá o vencedor da campanha. Deseja continuar?")) return

        setDrawing(true)
        setError("")
        setCurrentProgress(0)
        startSlotAnimation()

        try {
            const [res] = await Promise.all([
                drawRifaAction(rifaId, selectedPrizeId!),
                new Promise(r => setTimeout(r, 4500)) // Suspense delay
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
                const winnerName = res.winnerName as string

                setResult({
                    number: winnerNum,
                    name: winnerName,
                    prizeTitle: selectedPrize?.title || ""
                })

                setPrizes(prev => prev.map(p =>
                    p.id === selectedPrizeId
                        ? { ...p, winnerId: "temp", winnerNumber: winnerNum, winnerName: winnerName, drawnAt: new Date() }
                        : p
                ))

                const nextPrize = prizes.find(p => p.id !== selectedPrizeId && !p.winnerId)
                if (nextPrize) {
                    setTimeout(() => setSelectedPrizeId(nextPrize.id), 2000)
                }
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

            <SorteioHeader rifaId={rifaId} />

            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/20 blur-[120px] rounded-full"></div>
            </div>

            <main className="relative z-10 w-full max-w-4xl px-6 flex flex-col items-center text-center">
                <PrizeSelector
                    prizes={prizes}
                    selectedPrizeId={selectedPrizeId}
                    onSelect={(id) => { if (!drawing) { setSelectedPrizeId(id); setResult(null); } }}
                    drawing={drawing}
                />

                <div className="mb-12 space-y-2">
                    <h1 className="text-white text-5xl md:text-7xl font-black tracking-tighter drop-shadow-2xl uppercase">
                        {drawing ? 'Definindo' : (result ? 'Vencido!' : selectedPrize?.winnerId ? 'Premiado!' : 'Sorteio')}
                        {drawing && <span className="text-amber-400 animate-pulse">...</span>}
                    </h1>
                    <p className="text-primary/60 text-xs md:text-sm font-black uppercase tracking-[0.5em] bg-white/5 px-6 py-2 rounded-full border border-white/5 backdrop-blur-md">
                        {drawing ? 'Processando algoritmos de sorteio' : result ? `Resultado: ${result.prizeTitle}` : selectedPrize?.winnerId ? `Vencedor: ${selectedPrize.title}` : `Novo Sorteio: ${selectedPrize?.title || 'Prêmio'}`}
                    </p>
                </div>

                <SlotMachine slotNumbers={slotNumbers} drawing={drawing} />

                <DrawControls
                    drawing={drawing}
                    canDraw={canDraw}
                    minPercent={minPercent}
                    progress={progress}
                    currentProgress={currentProgress}
                    error={error}
                    result={result}
                    selectedPrize={selectedPrize}
                    pendingPrizesCount={prizes.filter(p => !p.winnerId).length}
                    totalPaid={totalPaid}
                    numberPrice={numberPrice}
                    rifaId={rifaId}
                    onDraw={handleDraw}
                    onResetResult={() => setResult(null)}
                />

                <WinnersList prizes={prizes} />
            </main>

            <footer className="absolute bottom-10 w-full text-center z-10">
                <p className="text-white/20 text-[9px] uppercase tracking-[0.3em] font-black">
                    © 2024 MyRifa • Sistema de Auditoria de Resultados Baseado em Blockchain
                </p>
            </footer>

            <WinnerOverlay result={result} onClose={() => setResult(null)} />
        </div>
    )
}
