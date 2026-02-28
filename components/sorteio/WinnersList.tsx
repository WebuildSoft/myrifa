import { Trophy, Check } from "lucide-react"

interface Prize {
    id: string
    title: string
    position: number
    winnerId?: string | null
    winnerName?: string | null
    winnerNumber?: number | null
}

interface WinnersListProps {
    prizes: Prize[]
}

export function WinnersList({ prizes }: WinnersListProps) {
    const drawnPrizes = prizes.filter(p => p.winnerId)
    if (drawnPrizes.length === 0) return null

    return (
        <div className="w-full pt-16 space-y-8 animate-in fade-in slide-in-from-bottom-10 duration-1000">
            <div className="flex flex-col items-center gap-2">
                <div className="h-px w-24 bg-gradient-to-r from-transparent via-amber-400/50 to-transparent"></div>
                <h3 className="text-amber-400 text-sm font-black uppercase tracking-[0.4em]">Vencedores Certificados</h3>
                <div className="h-px w-24 bg-gradient-to-r from-transparent via-amber-400/50 to-transparent"></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                {drawnPrizes.map((prize) => (
                    <div key={prize.id} className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-[2rem] p-6 flex items-center justify-between group hover:bg-white/10 transition-all border-emerald-500/20 shadow-xl shadow-emerald-500/5">
                        <div className="flex items-center gap-4 text-left">
                            <div className="size-14 rounded-2xl bg-emerald-500/20 flex items-center justify-center text-emerald-400 shadow-inner">
                                <Trophy className="h-6 w-6" />
                            </div>
                            <div className="space-y-1">
                                <p className="text-[9px] font-black text-emerald-400 uppercase tracking-widest">{prize.position}º Prêmio: {prize.title}</p>
                                <h4 className="text-white text-xl font-black tracking-tight leading-none truncate max-w-[180px]">{prize.winnerName || 'Ganhador'}</h4>
                            </div>
                        </div>
                        <div className="flex flex-col items-end">
                            <span className="text-white/30 text-[9px] font-black uppercase tracking-widest mb-1">Cota</span>
                            <div className="bg-slate-900 rounded-xl px-4 py-2 border border-white/10 text-amber-400 font-black text-xl font-mono shadow-inner group-hover:scale-105 transition-transform">
                                {prize.winnerNumber?.toString().padStart(3, '0')}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
