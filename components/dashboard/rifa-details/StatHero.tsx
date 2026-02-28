import { Badge } from "@/components/ui/badge"
import { TrendingUp, Target } from "lucide-react"

interface StatHeroProps {
    statusLabel: string
    statusColor: string
    totalRaised: number
    totalNumbers: number
    paidNumbers: number
    reservedNumbers: number
    numberPrice: number
}

export function StatHero({
    statusLabel,
    statusColor,
    totalRaised,
    totalNumbers,
    paidNumbers,
    reservedNumbers,
    numberPrice
}: StatHeroProps) {
    const progressPercentage = Math.round((paidNumbers / totalNumbers) * 100)
    const availableNumbers = totalNumbers - paidNumbers - reservedNumbers
    const targetRevenue = numberPrice * totalNumbers

    const formattedTotalRaised = new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL"
    }).format(totalRaised)

    const formattedTargetRevenue = new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL"
    }).format(targetRevenue)

    return (
        <section className="relative overflow-hidden bg-gradient-to-br from-primary to-purple-800 rounded-[2.5rem] p-8 md:p-10 text-white shadow-2xl shadow-primary/20">
            <div className="flex justify-between items-start mb-8">
                <Badge className={`${statusColor} hover:${statusColor} text-white border-transparent px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.2em] h-auto shadow-lg`}>
                    {statusLabel}
                </Badge>
                <div className="bg-white/10 p-3 rounded-2xl backdrop-blur-md">
                    <TrendingUp className="opacity-100 scale-110" />
                </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8 items-end relative z-10">
                <div className="space-y-3">
                    <p className="text-white/70 text-[10px] font-black uppercase tracking-[0.2em]">Total arrecadado</p>
                    <h2 className="text-5xl font-black leading-none tracking-tighter drop-shadow-sm">{formattedTotalRaised}</h2>
                    <div className="flex items-center gap-3 mt-4">
                        <div className="bg-white/20 backdrop-blur-md px-4 py-1.5 rounded-full flex items-center gap-2 border border-white/10">
                            <Target className="h-3 w-3 opacity-60" />
                            <span className="text-[10px] font-black uppercase tracking-wider text-white">Meta: {formattedTargetRevenue}</span>
                        </div>
                    </div>
                </div>

                <div className="space-y-5">
                    <div className="w-full bg-black/20 rounded-full h-4 overflow-hidden border border-white/10 p-1 backdrop-blur-sm">
                        <div className="bg-white h-full rounded-full transition-all duration-1000 shadow-[0_0_20px_rgba(255,255,255,0.8)] relative" style={{ width: `${progressPercentage}%` }}>
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>
                        </div>
                    </div>
                    <div className="flex flex-col gap-2">
                        <div className="flex items-center justify-between">
                            <p className="text-xl font-black">{progressPercentage}% <span className="text-white/60 font-medium text-xs">apoio</span></p>
                            <span className="text-[10px] font-black text-white/80 uppercase tracking-widest">{paidNumbers}/{totalNumbers}</span>
                        </div>
                        <div className="flex items-center justify-between text-[9px] text-white/50 font-black uppercase tracking-[0.15em] pt-1">
                            <span>{availableNumbers} livres</span>
                            <span>{reservedNumbers} reservas</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Abstract elements */}
            <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-white/10 rounded-full blur-[100px]"></div>
            <div className="absolute -top-10 -left-10 w-48 h-48 bg-purple-400/20 rounded-full blur-[80px]"></div>
        </section>
    )
}
