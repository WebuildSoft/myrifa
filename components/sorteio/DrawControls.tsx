import { Button } from "@/components/ui/button"
import { Zap, AlertTriangle, ArrowLeft, Users, Coins } from "lucide-react"
import Link from "next/link"

interface DrawControlsProps {
    drawing: boolean
    canDraw: boolean
    minPercent: number
    progress: number
    currentProgress: number
    error?: string
    result: any
    selectedPrize: any
    pendingPrizesCount: number
    totalPaid: number
    numberPrice: number
    rifaId: string
    onDraw: () => void
    onResetResult: () => void
}

export function DrawControls({
    drawing, canDraw, minPercent, progress, currentProgress, error, result, selectedPrize,
    pendingPrizesCount, totalPaid, numberPrice, rifaId, onDraw, onResetResult
}: DrawControlsProps) {

    if (result || selectedPrize?.winnerId) {
        return (
            <div className="w-full max-w-md space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
                <div className="bg-white/10 backdrop-blur-xl rounded-[2.5rem] p-8 border border-white/10 text-left relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <Zap className="h-24 w-24 text-amber-400" />
                    </div>

                    <div className="flex items-center justify-between mb-4">
                        <span className="text-amber-400 text-[10px] font-black uppercase tracking-widest">
                            {result?.prizeTitle || selectedPrize?.title}
                        </span>
                        <Zap className="h-5 w-5 text-emerald-400" />
                    </div>
                    <h3 className="text-3xl font-black text-white leading-tight break-words mb-4 uppercase">
                        {result?.name || selectedPrize?.winnerName || 'Carregando...'}
                    </h3>
                    <div className="flex justify-between items-end border-t border-white/10 pt-4">
                        <div>
                            <p className="text-white/40 text-[9px] font-black uppercase tracking-widest leading-none mb-1">Cota Premiada</p>
                            <p className="text-2xl font-black text-amber-400">
                                Nº {(result?.number || selectedPrize?.winnerNumber)?.toString().padStart(3, '0')}
                            </p>
                        </div>
                        <div className="text-right">
                            <p className="text-white/40 text-[9px] font-black uppercase tracking-widest leading-none mb-1">Posição</p>
                            <p className="text-xl font-black text-white">{selectedPrize?.position}º</p>
                        </div>
                    </div>
                </div>

                {pendingPrizesCount > 0 ? (
                    <Button
                        onClick={onResetResult}
                        className="h-16 w-full rounded-2xl bg-amber-400 hover:bg-amber-500 text-slate-900 font-black text-sm uppercase tracking-[0.2em] shadow-xl shadow-amber-400/20 active:scale-95 transition-all"
                    >
                        Sortear Próximo Prêmio
                        <Zap className="ml-2 h-5 w-5 fill-slate-900" />
                    </Button>
                ) : (
                    <Button variant="ghost" className="h-14 w-full rounded-2xl font-black text-xs uppercase tracking-[0.2em] text-white border border-white/10 hover:bg-white/5 active:scale-95 transition-all group" asChild>
                        <Link href={`/dashboard/rifas/${rifaId}`}>
                            <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
                            Campanha Concluída - Voltar
                        </Link>
                    </Button>
                )}
            </div>
        )
    }

    return (
        <div className="w-full max-w-2xl space-y-12">
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
                        <div className="flex items-center gap-2 px-6 py-2 bg-amber-400/20 border border-amber-400/40 rounded-full animate-pulse">
                            <AlertTriangle className="h-4 w-4 text-amber-400" />
                            <span className="text-[10px] font-black text-amber-400 uppercase tracking-widest leading-none">
                                Atenção: Meta ({minPercent}%) não atingida ({progress}%). Sorteio liberado para admin.
                            </span>
                        </div>
                    )}

                    {error && (
                        <p className="text-xs font-black text-red-400 uppercase tracking-widest bg-red-400/10 px-4 py-2 rounded-lg border border-red-400/20">{error}</p>
                    )}

                    <Button
                        size="lg"
                        className={`h-24 px-12 text-lg font-black uppercase tracking-[0.3em] rounded-full shadow-[0_0_50px_rgba(236,91,19,0.2)] transition-all transform active:scale-95 flex items-center gap-4 ${drawing || selectedPrize?.winnerId ? 'bg-slate-800 text-slate-500 cursor-not-allowed opacity-50' : 'bg-primary hover:bg-primary/90 text-white hover:shadow-[0_0_60px_rgba(124,59,237,0.4)]'}`}
                        disabled={drawing || !!selectedPrize?.winnerId}
                        onClick={onDraw}
                    >
                        <Zap className="h-6 w-6 fill-white" />
                        Finalizar e Premiar
                    </Button>

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
                                <p className="text-[9px] font-black uppercase tracking-widest">Valor do Bilhete</p>
                            </div>
                            <p className="text-white text-2xl md:text-3xl font-black">
                                {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(numberPrice)}
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
