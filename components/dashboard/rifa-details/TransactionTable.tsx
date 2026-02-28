import { Search, Filter, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { TransactionActions } from "@/app/(dashboard)/dashboard/rifas/[id]/TransactionActions"

interface Transaction {
    id: string
    buyer: {
        name: string
        whatsapp: string
    }
    numbers: number[]
    amount: any
    status: string
    createdAt: Date
}

interface TransactionTableProps {
    transactions: Transaction[]
    rifaId: string
}

export function TransactionTable({ transactions, rifaId }: TransactionTableProps) {
    return (
        <section className="bg-white dark:bg-slate-800 rounded-[2.5rem] border border-primary/5 shadow-sm overflow-hidden">
            <div className="p-8 border-b border-slate-100 dark:border-slate-700/50 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1">
                    <h4 className="font-black text-lg">Histórico de Transações</h4>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Últimas movimentações financeiras</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="relative group">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 h-4 w-4 group-focus-within:text-primary transition-colors" />
                        <input className="pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-900 border-none rounded-2xl text-xs font-bold focus:ring-2 focus:ring-primary/30 w-full md:w-64 placeholder:text-slate-400" placeholder="Buscar comprador..." type="text" />
                    </div>
                    <Button variant="outline" size="icon" className="rounded-2xl shrink-0"><Filter className="h-4 w-4" /></Button>
                </div>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead>
                        <tr className="bg-slate-50/50 dark:bg-slate-900/50 text-slate-400 dark:text-slate-500 text-[9px] uppercase font-black tracking-[0.2em]">
                            <th className="px-8 py-5">Comprador</th>
                            <th className="px-8 py-5">Números</th>
                            <th className="px-8 py-5">Valor</th>
                            <th className="px-8 py-5">Data/Hora</th>
                            <th className="px-8 py-5">Status</th>
                            <th className="px-8 py-5 text-right">Ações</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-700/30">
                        {transactions.length > 0 ? (
                            transactions.map((tx) => (
                                <tr key={tx.id} className="text-xs hover:bg-slate-50/50 dark:hover:bg-slate-900/30 transition-colors">
                                    <td className="px-8 py-5 font-black text-slate-900 dark:text-white">
                                        <div className="flex flex-col">
                                            <span>{tx.buyer.name}</span>
                                            <span className="text-[10px] font-bold text-slate-400 font-mono italic">{tx.buyer.whatsapp}</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-5">
                                        <div className="flex flex-wrap gap-1">
                                            {tx.numbers.slice(0, 3).map((n, idx) => (
                                                <span key={idx} className="bg-primary/5 text-primary text-[10px] font-black px-1.5 rounded">
                                                    {n.toString().padStart(3, '0')}
                                                </span>
                                            ))}
                                            {tx.numbers.length > 3 && (
                                                <span className="text-slate-400 text-[10px] font-black italic">+{tx.numbers.length - 3}</span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-8 py-5 font-black text-primary">
                                        {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(Number(tx.amount))}
                                    </td>
                                    <td className="px-8 py-5 text-slate-400 font-bold">
                                        {new Date(tx.createdAt).toLocaleString("pt-BR", { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })}
                                    </td>
                                    <td className="px-8 py-5">
                                        <Badge variant={tx.status === "PAID" ? "default" : tx.status === "PENDING" ? "outline" : "destructive"} className="font-black text-[9px] uppercase tracking-widest px-3">
                                            {tx.status === "PAID" ? "Pago" : tx.status === "PENDING" ? "Pendente" : "Cancelado"}
                                        </Badge>
                                    </td>
                                    <td className="px-8 py-5 text-right">
                                        <TransactionActions transactionId={tx.id} status={tx.status as any} />
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={6} className="px-8 py-20 text-center opacity-40">
                                    <div className="flex flex-col items-center gap-3">
                                        <Clock className="h-10 w-10" />
                                        <p className="text-xs font-black uppercase tracking-[0.2em]">Sem movimentações recentes</p>
                                    </div>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </section>
    )
}
