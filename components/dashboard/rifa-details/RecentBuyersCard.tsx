import { Ticket } from "lucide-react"
import Link from "next/link"

interface Buyer {
    id: string
    name: string
    createdAt: Date
}

interface RecentBuyersCardProps {
    rifaId: string
    buyers: Buyer[]
}

export function RecentBuyersCard({ rifaId, buyers }: RecentBuyersCardProps) {
    return (
        <div className="bg-white dark:bg-slate-800 p-8 rounded-[2.5rem] border border-primary/5 shadow-sm space-y-6 overflow-hidden flex flex-col">
            <div className="flex justify-between items-center mb-2">
                <h3 className="font-black text-slate-900 dark:text-white text-[10px] uppercase tracking-widest border-l-2 border-primary pl-3">Apoiadores Recentes</h3>
                <Link className="text-primary text-[10px] font-black uppercase tracking-widest hover:underline" href={`/dashboard/rifas/${rifaId}/compradores`}>Ver Tudo</Link>
            </div>

            <div className="space-y-4">
                {buyers.length > 0 ? (
                    buyers.map((buyer) => (
                        <div key={buyer.id} className="flex items-center gap-3 p-3 bg-slate-50/50 dark:bg-slate-900/30 rounded-2xl transition-all hover:bg-white dark:hover:bg-slate-900 hover:shadow-md border border-transparent hover:border-primary/5 group">
                            <div className="size-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-black text-[10px] uppercase group-hover:bg-primary group-hover:text-white transition-colors">
                                {buyer.name.substring(0, 2)}
                            </div>
                            <div className="flex-1 min-w-0">
                                <h4 className="text-[11px] font-black text-slate-900 dark:text-white truncate">{buyer.name}</h4>
                                <p className="text-[8px] text-slate-400 font-bold">{new Date(buyer.createdAt).toLocaleDateString("pt-BR")}</p>
                            </div>
                            <div className="p-1 px-2.5 rounded-full bg-primary/5 text-primary text-[8px] font-black uppercase">
                                Pago
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="flex flex-col items-center justify-center opacity-30 text-center py-10">
                        <Ticket className="h-8 w-8 mb-2" />
                        <p className="text-[10px] font-black uppercase tracking-widest">Nenhum apoiador</p>
                    </div>
                )}
            </div>
        </div>
    )
}
