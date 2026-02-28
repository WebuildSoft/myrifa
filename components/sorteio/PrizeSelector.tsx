import { Trophy, Check } from "lucide-react"

interface Prize {
    id: string
    title: string
    position: number
    winnerId?: string | null
}

interface PrizeSelectorProps {
    prizes: Prize[]
    selectedPrizeId: string | null
    onSelect: (id: string) => void
    drawing: boolean
}

export function PrizeSelector({ prizes, selectedPrizeId, onSelect, drawing }: PrizeSelectorProps) {
    return (
        <div className="mb-10 space-y-4 w-full">
            <p className="text-white/30 text-[9px] font-black uppercase tracking-[0.4em] mb-4">Selecione o Prêmio para Sortear</p>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3 w-full">
                {prizes.map((p) => (
                    <button
                        key={p.id}
                        onClick={() => onSelect(p.id)}
                        disabled={drawing}
                        className={`relative group p-4 rounded-2xl border transition-all duration-300 flex flex-col items-center gap-2 overflow-hidden ${selectedPrizeId === p.id
                            ? 'bg-amber-400 border-amber-400 shadow-[0_0_30px_rgba(251,191,36,0.2)] scale-105 z-10'
                            : p.winnerId
                                ? 'bg-emerald-500/10 border-emerald-500/30 opacity-80'
                                : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20'
                            }`}
                    >
                        <div className={`size-8 rounded-full flex items-center justify-center mb-1 transition-colors ${selectedPrizeId === p.id ? 'bg-slate-900 text-amber-400' : p.winnerId ? 'bg-emerald-500/20 text-emerald-400' : 'bg-white/10 text-white/40'}`}>
                            {p.winnerId ? <Trophy className="h-4 w-4" /> : <span className="text-[10px] font-black">{p.position}º</span>}
                        </div>
                        <span className={`text-[10px] font-black uppercase tracking-tight truncate w-full ${selectedPrizeId === p.id ? 'text-slate-900' : 'text-white/60'}`}>
                            {p.title}
                        </span>
                        {p.winnerId && (
                            <div className="absolute top-1 right-1">
                                <div className="size-3 bg-emerald-500 rounded-full flex items-center justify-center">
                                    <Check className="h-2 w-2 text-white" />
                                </div>
                            </div>
                        )}
                    </button>
                ))}
            </div>
        </div>
    )
}
