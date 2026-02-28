import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Smartphone } from "lucide-react"
import Link from "next/link"
import { DashboardCard } from "../DashboardCard"

interface Winner {
    name: string
    whatsapp: string
}

interface Prize {
    id: string
    title: string
    position: number
    winnerId: string | null
    winnerNumber: number | null
    winner?: Winner | null
}

interface WinnersCardProps {
    prizes: Prize[]
    rifaTitle: string
}

export function WinnersCard({ prizes, rifaTitle }: WinnersCardProps) {
    return (
        <DashboardCard title="Ganhadores da Campanha">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {prizes.map((prize) => (
                    <div key={prize.id} className="relative p-5 bg-slate-50 dark:bg-slate-900/50 rounded-3xl border border-primary/5 group transition-all hover:bg-white dark:hover:bg-slate-900 hover:shadow-md">
                        <div className="flex justify-between items-start mb-3">
                            <div className="space-y-0.5">
                                <span className="text-[9px] font-black text-primary uppercase tracking-widest">{prize.position}º Prêmio</span>
                                <h4 className="text-xs font-black text-slate-900 dark:text-white leading-tight truncate max-w-[120px]">{prize.title}</h4>
                            </div>
                            <Badge variant={prize.winnerId ? "default" : "outline"} className={`h-5 rounded-full text-[8px] font-black uppercase tracking-widest ${prize.winnerId ? 'bg-emerald-500/10 text-emerald-600 border-none' : 'text-slate-400'}`}>
                                {prize.winnerId ? 'Sorteado' : 'Pendente'}
                            </Badge>
                        </div>

                        {prize.winner ? (
                            <div className="space-y-3">
                                <div className="flex items-center gap-3">
                                    <div className="size-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-black text-[10px] uppercase">
                                        {prize.winner.name.substring(0, 2)}
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-[11px] font-black text-slate-900 dark:text-white leading-none truncate">{prize.winner.name}</p>
                                        <p className="text-[9px] font-bold text-slate-400 mt-1">Cota: #{prize.winnerNumber?.toString().padStart(3, '0')}</p>
                                    </div>
                                </div>

                                <div className="flex gap-2 pt-2 border-t border-slate-200/50 dark:border-slate-700/50">
                                    <Button size="sm" variant="outline" className="flex-1 h-8 rounded-xl border-emerald-500/20 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 gap-2 text-[9px] font-black uppercase tracking-widest" asChild>
                                        <Link href={`https://wa.me/${prize.winner.whatsapp.replace(/\D/g, '')}?text=Olá ${prize.winner.name}, parabéns! Você ganhou o ${prize.position}º prêmio (${prize.title}) na nossa campanha ${rifaTitle}!`} target="_blank">
                                            <Smartphone className="h-3 w-3" />
                                            Zap
                                        </Link>
                                    </Button>
                                </div>
                            </div>
                        ) : (
                            <div className="py-4 text-center opacity-30 flex flex-col items-center justify-center border border-dashed border-slate-300 dark:border-slate-700 rounded-2xl">
                                <span className="text-[8px] font-black uppercase tracking-widest">Aguardando</span>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </DashboardCard>
    )
}
