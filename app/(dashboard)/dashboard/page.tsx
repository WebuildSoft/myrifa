import { Card, CardContent } from "@/components/ui/card"
import { Ticket, DollarSign, ShoppingCart, TrendingUp, PlusCircle, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import Link from "next/link"
import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { cn } from "@/lib/utils"
import { RifaStatus } from "@prisma/client"

export default async function DashboardPage() {
    const session = await auth()
    if (!session?.user?.id) redirect("/login")

    const userId = session.user.id

    // Fetch metrics
    const activeRifasCount = await prisma.rifa.count({
        where: { userId, status: "ACTIVE" as any }
    })

    const totalRaisedResult = await prisma.rifa.aggregate({
        where: {
            userId,
            status: { in: ["DRAFT", "ACTIVE", "PAUSED", "CLOSED", "DRAWN", "CANCELLED"] as any }
        },
        _sum: { totalRaised: true }
    })
    const totalRaised = Number(totalRaisedResult._sum.totalRaised || 0)

    const ticketsSold = await prisma.rifaNumber.count({
        where: {
            rifa: {
                userId,
                status: { in: ["DRAFT", "ACTIVE", "PAUSED", "CLOSED", "DRAWN", "CANCELLED"] as any }
            },
            status: "PAID"
        }
    })

    const recentTransactions = await prisma.transaction.findMany({
        where: {
            rifa: {
                userId,
                status: { in: ["DRAFT", "ACTIVE", "PAUSED", "CLOSED", "DRAWN", "CANCELLED"] as any }
            }
        },
        include: {
            buyer: true,
            rifa: true
        },
        orderBy: { createdAt: "desc" },
        take: 5
    })

    // Format currency
    const formattedRaised = new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL"
    }).format(totalRaised)

    return (
        <div className="space-y-8 pb-12">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
                <p className="text-slate-500 font-medium mt-1">
                    Bem-vindo de volta, {session.user.name?.split(" ")[0]}! Aqui está o resumo das suas campanhas.
                </p>
            </div>

            {/* Metrics Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 font-sans">
                <Card className="bg-white dark:bg-slate-900 border-primary/5 shadow-sm rounded-2xl overflow-hidden group hover:shadow-md transition-all">
                    <CardContent className="p-6">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-2.5 bg-green-100 dark:bg-green-500/10 rounded-xl text-green-600">
                                <DollarSign className="h-5 w-5" />
                            </div>
                            <Badge className="bg-green-50 text-green-600 border-none font-bold text-[10px] hover:bg-green-100">+12%</Badge>
                        </div>
                        <p className="text-slate-500 text-sm font-semibold tracking-tight uppercase">Total Arrecadado</p>
                        <h3 className="text-2xl font-bold mt-1 tracking-tight text-foreground">{formattedRaised}</h3>
                    </CardContent>
                </Card>

                <Card className="bg-white dark:bg-slate-900 border-primary/5 shadow-sm rounded-2xl overflow-hidden group hover:shadow-md transition-all">
                    <CardContent className="p-6">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-2.5 bg-blue-100 dark:bg-blue-500/10 rounded-xl text-blue-600">
                                <Ticket className="h-5 w-5" />
                            </div>
                            <Badge className="bg-blue-50 text-blue-600 border-none font-bold text-[10px] hover:bg-blue-100">+2%</Badge>
                        </div>
                        <p className="text-slate-500 text-sm font-semibold tracking-tight uppercase">Rifas Ativas</p>
                        <h3 className="text-2xl font-bold mt-1 tracking-tight text-foreground">{activeRifasCount}</h3>
                    </CardContent>
                </Card>

                <Card className="bg-white dark:bg-slate-900 border-primary/5 shadow-sm rounded-2xl overflow-hidden group hover:shadow-md transition-all">
                    <CardContent className="p-6">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-2.5 bg-purple-100 dark:bg-purple-500/10 rounded-xl text-purple-600">
                                <ShoppingCart className="h-5 w-5" />
                            </div>
                            <Badge className="bg-purple-50 text-purple-600 border-none font-bold text-[10px] hover:bg-purple-100">+5%</Badge>
                        </div>
                        <p className="text-slate-500 text-sm font-semibold tracking-tight uppercase">Números Vendidos</p>
                        <h3 className="text-2xl font-bold mt-1 tracking-tight text-foreground">{ticketsSold}</h3>
                    </CardContent>
                </Card>

                <Card className="bg-white dark:bg-slate-900 border-primary/5 shadow-sm rounded-2xl overflow-hidden group hover:shadow-md transition-all">
                    <CardContent className="p-6">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-2.5 bg-orange-100 dark:bg-orange-500/10 rounded-xl text-orange-600">
                                <TrendingUp className="h-5 w-5" />
                            </div>
                            <Badge variant="destructive" className="bg-red-50 text-red-600 border-none font-bold text-[10px] hover:bg-red-100">-1%</Badge>
                        </div>
                        <p className="text-slate-500 text-sm font-semibold tracking-tight uppercase">Conversão</p>
                        <h3 className="text-2xl font-bold mt-1 tracking-tight text-foreground">14.5%</h3>
                    </CardContent>
                </Card>
            </div>

            {/* CTA Banner Section */}
            <div className="relative overflow-hidden bg-primary rounded-3xl p-8 md:p-12 text-primary-foreground shadow-xl shadow-primary/20 group">
                <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                    <div className="max-w-xl text-center md:text-left">
                        <h2 className="text-3xl font-extrabold mb-4 tracking-tight leading-tight">Pronto para sua próxima campanha de sucesso?</h2>
                        <p className="text-primary-foreground/90 font-medium text-lg leading-relaxed max-w-lg">Crie rifas profissionais em minutos, gerencie pagamentos e automatize o sorteio. Tudo em um só lugar.</p>
                    </div>
                    <Button asChild className="whitespace-nowrap h-14 px-8 bg-white text-primary hover:bg-slate-50 font-bold rounded-2xl shadow-lg border-none hover:scale-105 transition-all duration-300">
                        <Link href="/dashboard/rifas/nova" className="flex items-center gap-2">
                            <PlusCircle className="h-5 w-5" />
                            Criar Nova Rifa
                        </Link>
                    </Button>
                </div>
                {/* Abstract Background Decorations */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-20 -mt-20 blur-3xl group-hover:scale-110 transition-transform duration-700"></div>
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-black/10 rounded-full -ml-10 -mb-10 blur-2xl"></div>
            </div>

            {/* Recent Transactions Section */}
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
                        {recentTransactions.length === 0 ? (
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
                                        <TableHead className="py-5 font-bold text-slate-500 text-xs uppercase tracking-wider text-right pr-8">Data</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {recentTransactions.map((tx) => (
                                        <TableRow key={tx.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/20 border-primary/5 transition-colors">
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
                                            <TableCell className="text-right text-slate-500 dark:text-slate-400 font-medium pr-8">
                                                {new Date(tx.createdAt).toLocaleDateString("pt-BR")}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
