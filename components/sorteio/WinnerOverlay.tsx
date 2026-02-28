import { Trophy } from "lucide-react"
import { Button } from "@/components/ui/button"

interface WinnerOverlayProps {
    result: { number: number, name: string, prizeTitle: string } | null
    onClose: () => void
}

export function WinnerOverlay({ result, onClose }: WinnerOverlayProps) {
    if (!result) return null

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/90 backdrop-blur-sm animate-in fade-in duration-500">
            <div className="relative w-full max-w-lg p-10 bg-gradient-to-br from-indigo-900 via-slate-900 to-primary/20 rounded-[3rem] border border-white/20 shadow-[0_0_100px_rgba(124,59,237,0.3)] text-center animate-in zoom-in-95 duration-500">
                {/* Confetti decoration */}
                <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-24 h-24 bg-amber-400 rounded-full blur-[60px] opacity-50"></div>

                <div className="mb-6 inline-flex p-4 rounded-3xl bg-amber-400/20 border border-amber-400/30 text-amber-400">
                    <Trophy className="h-12 w-12" />
                </div>

                <div className="space-y-2 mb-8">
                    <h2 className="text-white text-sm font-black uppercase tracking-[0.5em] opacity-60">Vencedor Confirmado</h2>
                    <h3 className="text-white text-4xl md:text-5xl font-black tracking-tighter leading-none">{result.name}</h3>
                    <p className="text-amber-400 text-lg font-black uppercase tracking-widest">{result.prizeTitle}</p>
                </div>

                <div className="relative group mb-8">
                    <div className="absolute inset-0 bg-amber-400 blur-2xl opacity-20 group-hover:opacity-40 transition-opacity"></div>
                    <div className="relative bg-slate-950 rounded-[2rem] border border-white/10 p-8 flex flex-col items-center">
                        <span className="text-white/30 text-[10px] font-black uppercase tracking-widest mb-2">Cota Sorteada</span>
                        <span className="text-white text-7xl md:text-8xl font-black leading-none tracking-tighter" style={{ fontFamily: 'Syne, sans-serif' }}>
                            #{result.number.toString().padStart(3, '0')}
                        </span>
                    </div>
                </div>

                <Button
                    onClick={onClose}
                    className="w-full h-16 rounded-2xl bg-white text-slate-950 hover:bg-slate-50 font-black uppercase tracking-widest text-sm shadow-xl active:scale-95 transition-all"
                >
                    Continuar Evento
                </Button>
            </div>
        </div>
    )
}
