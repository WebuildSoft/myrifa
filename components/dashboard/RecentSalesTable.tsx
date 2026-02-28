import { Card, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { ArrowRight } from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"
// We import TransactionActions from the existing relative path or move it. 
// For now, let's keep the relative reference as it was in the original page.
import { TransactionActions } from "@/app/(dashboard)/dashboard/rifas/[id]/TransactionActions"

interface Transaction {
    id: string
    amount: any
    status: string
    buyer: { name: string }
    rifa: { title: string }
}

interface RecentSalesTableProps {
    transactions: Transaction[]
}

export function RecentSalesTable({ transactions }: RecentSalesTableProps) {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold tracking-tight">Suas Vendas Recentes</h2>
                <Link href="/relatorios" className="text-primary font-bold text-sm flex items-center gap-1 hover:underline group">
                    Ver todos os relatórios
                    <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Link>
            </div>

            <Card className="rounded-2xl border-primary/5 shadow-sm overflow-hidden bg-white dark:bg-slate-900">
                <CardContent className="p-0">
                    {transactions.length === 0 ? (
                        <div className="text-center py-12 text-slate-400 font-medium">
                            Nenhuma venda registrada ainda.
                        </div>
                    ) : (
                        <Table>
                            <TableHeader className="bg-slate-50/50 dark:bg-slate-800/50">
                                <TableRow className="hover:bg-transparent border-primary/5">
                                    <TableHead className="py-5 font-bold text-slate-500 text-xs uppercase tracking-wider pl-8">Comprador</TableHead>
                                    <TableHead className="py-5 font-bold text-slate-500 text-xs uppercase tracking-wider">Campanha</TableHead>
                                    <TableHead className="py-5 font-bold text-slate-500 text-xs uppercase tracking-wider">Valor</TableHead>
                                    <TableHead className="py-5 font-bold text-slate-500 text-xs uppercase tracking-wider">Status</TableHead>
                                    <TableHead className="py-5 font-bold text-slate-500 text-xs uppercase tracking-wider text-right">Ações</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {transactions.map((tx) => (
                                    <TableRow key={tx.id} className="group hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                        <TableCell className="font-bold text-slate-900 dark:text-slate-100 py-4 pl-8">{tx.buyer.name}</TableCell>
                                        <TableCell className="text-slate-600 dark:text-slate-400 font-medium">{tx.rifa.title}</TableCell>
                                        <TableCell className="font-extrabold text-slate-900 dark:text-slate-100">
                                            {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(Number(tx.amount))}
                                        </TableCell>
                                        <TableCell>
                                            <Badge className={cn(
                                                "border-none font-bold text-[10px] px-3 py-1 rounded-full",
                                                tx.status === "PAID" ? "bg-green-50 text-green-600" :
                                                    tx.status === "PENDING" ? "bg-orange-50 text-orange-600" : "bg-red-50 text-red-600"
                                            )}>
                                                {tx.status === "PAID" ? "Pago" :
                                                    tx.status === "PENDING" ? "Pendente" : "Cancelado"}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-right pr-8">
                                            <TransactionActions transactionId={tx.id} status={tx.status} />
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
