import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { notFound, redirect } from "next/navigation"
import { RifaStatus, Prisma } from "@prisma/client"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
    ArrowLeft,
    Search,
    Smartphone,
    Download,
    MoreVertical,
    Users,
    Ticket,
    DollarSign,
    Filter
} from "lucide-react"
import { Input } from "@/components/ui/input"
import { TransactionActions } from "../TransactionActions"
import { BuyerFilters } from "./BuyerFilters"

export default async function CompradoresPage({
    params,
    searchParams
}: {
    params: Promise<{ id: string }>
    searchParams: Promise<{ search?: string, filter?: string }>
}) {
    const session = await auth()
    if (!session?.user?.id) redirect("/login")

    const { id } = await params
    const { search, filter } = await searchParams

    // Construct the Prisma where clause based on search and filters
    const whereClause: Prisma.BuyerWhereInput = {
        rifaId: id,
    }

    if (search) {
        whereClause.OR = [
            { name: { contains: search, mode: 'insensitive' } },
            { whatsapp: { contains: search.replace(/\D/g, '') } }
        ]
    }

    if (filter === 'paid') {
        whereClause.numbers = {
            some: { status: 'PAID' },
            none: { status: 'RESERVED' }
        }
    } else if (filter === 'pending') {
        whereClause.numbers = {
            some: { status: 'RESERVED' }
        }
    } else if (filter === 'expired') {
        whereClause.transactions = {
            some: { status: 'EXPIRED' }
        }
        whereClause.numbers = {
            none: { status: { in: ['PAID', 'RESERVED'] } }
        }
    }

    // Parallelize main data fetching and metric calculations
    const [rifa, buyers, buyersCount, paidNumbersCount] = await Promise.all([
        prisma.rifa.findUnique({
            where: { id, userId: session.user.id },
            select: { id: true, title: true, numberPrice: true, status: true }
        }),
        prisma.buyer.findMany({
            where: whereClause,
            include: {
                numbers: {
                    where: { rifaId: id },
                    select: { id: true, number: true, status: true }
                },
                transactions: {
                    where: { rifaId: id },
                    select: { id: true, status: true, provider: true },
                    orderBy: { createdAt: 'desc' }
                }
            },
            orderBy: { createdAt: 'desc' },
            take: 100
        }),
        prisma.buyer.count({ where: { rifaId: id } }),
        prisma.rifaNumber.count({ where: { rifaId: id, status: "PAID" } })
    ])

    if (!rifa || (rifa.status as string) === "DELETED") notFound()

    const totalSoldNumbers = paidNumbersCount
    const totalRevenue = paidNumbersCount * Number(rifa.numberPrice)

    return (
        <div className="min-h-screen bg-[#f7f6f8] dark:bg-[#171121] text-slate-900 dark:text-slate-100 pb-32 -m-4 md:-m-8 flex flex-col">
            {/* Header */}
            <header className="sticky top-0 z-30 bg-white/80 dark:bg-[#171121]/80 backdrop-blur-md px-6 pt-8 pb-4 border-b border-primary/10">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-4">
                        <Button variant="ghost" size="icon" className="rounded-full hover:bg-primary/10 group" asChild>
                            <Link href={`/dashboard/rifas/${rifa.id}`}>
                                <ArrowLeft className="h-5 w-5 text-primary group-hover:-translate-x-1 transition-transform" />
                            </Link>
                        </Button>
                        <div className="flex items-center gap-3">
                            <h1 className="text-2xl font-black font-sans tracking-tight">Compradores</h1>
                            <span className="bg-primary/10 text-primary text-xs font-black px-3 py-1 rounded-full border border-primary/20">
                                {buyersCount}
                            </span>
                        </div>
                    </div>
                </div>

                <BuyerFilters />
            </header>

            <main className="flex-1 p-6 space-y-8 max-w-2xl mx-auto w-full">
                {/* Metrics Summary Cards */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <MetricCard
                        label="Compradores"
                        value={buyersCount.toString()}
                        icon={<Users className="w-4 h-4" />}
                        color="text-blue-500"
                        bg="bg-blue-500/10"
                    />
                    <MetricCard
                        label="Cotas Vendidas"
                        value={totalSoldNumbers.toString()}
                        icon={<Ticket className="w-4 h-4" />}
                        color="text-amber-500"
                        bg="bg-amber-500/10"
                    />
                    <MetricCard
                        label="Arrecadação"
                        value={new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 }).format(totalRevenue)}
                        icon={<DollarSign className="w-4 h-4" />}
                        color="text-emerald-500"
                        bg="bg-emerald-500/10"
                        className="col-span-2 md:col-span-1"
                    />
                </div>

                {/* Buyers List Container */}
                <div className="space-y-4">
                    {buyers.length === 0 ? (
                        <div className="py-20 text-center opacity-40 flex flex-col items-center gap-3">
                            <Users className="h-12 w-12" />
                            <p className="text-sm font-black uppercase tracking-[0.2em]">Nenhum comprador encontrado</p>
                        </div>
                    ) : (
                        buyers.map((buyer) => {
                            const paidNumbers = buyer.numbers.filter(n => n.status === "PAID")
                            const reservedNumbers = buyer.numbers.filter(n => n.status === "RESERVED")

                            // Define status based on numbers
                            let status = "INCOMPLETO"
                            let statusColor = "bg-slate-500/10 text-slate-600"

                            if (buyer.numbers.length > 0) {
                                if (paidNumbers.length === buyer.numbers.length) {
                                    status = "PAGO"
                                    statusColor = "bg-emerald-500/10 text-emerald-600"
                                } else if (reservedNumbers.length > 0) {
                                    status = "PENDENTE"
                                    statusColor = "bg-amber-500/10 text-amber-600"
                                }
                            } else {
                                // check if there are expired transactions
                                const hasExpired = buyer.transactions.some(t => t.status === "EXPIRED")
                                if (hasExpired) {
                                    status = "EXPIRADO"
                                    statusColor = "bg-red-500/10 text-red-600"
                                }
                            }

                            return (
                                <div key={buyer.id} className="bg-white dark:bg-slate-800 border border-primary/5 p-5 rounded-[2rem] shadow-sm hover:shadow-md transition-all group active:scale-[0.98]">
                                    <div className="flex items-start gap-4">
                                        <div className="size-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-black text-lg transition-colors group-hover:bg-primary group-hover:text-white shrink-0">
                                            {buyer.name.substring(0, 2).toUpperCase()}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex justify-between items-start mb-1">
                                                <h3 className="font-black text-slate-900 dark:text-white truncate pr-2 leading-tight">{buyer.name}</h3>
                                                <div className="flex items-center gap-2">
                                                    <Badge className={`${statusColor} border-none font-black text-[9px] uppercase tracking-widest px-2.5 py-1 rounded-full shadow-none`}>
                                                        {status}
                                                    </Badge>
                                                    {buyer.transactions.length > 0 && (
                                                        <div className="scale-75 origin-right">
                                                            <TransactionActions
                                                                transactionId={buyer.transactions[0].id}
                                                                status={buyer.transactions[0].status}
                                                                provider={(buyer.transactions[0] as any).provider}
                                                            />
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                            <Link
                                                href={`https://wa.me/${buyer.whatsapp.replace(/\D/g, '')}`}
                                                target="_blank"
                                                className="text-xs text-slate-500 dark:text-slate-400 font-bold font-mono flex items-center gap-1 hover:text-primary transition-colors"
                                            >
                                                <Smartphone className="h-3 w-3" />
                                                {buyer.whatsapp}
                                            </Link>

                                            <div className="mt-4 flex flex-wrap gap-1.5">
                                                {buyer.numbers.map((n) => (
                                                    <span
                                                        key={n.id}
                                                        className={`text-[10px] font-black px-2 py-1 rounded-lg ${n.status === "PAID" ? 'bg-primary/10 text-primary' : 'bg-slate-100 dark:bg-slate-900 text-slate-400'}`}
                                                    >
                                                        {n.number.toString().padStart(2, '0')}
                                                    </span>
                                                ))}
                                                {buyer.numbers.length === 0 && (
                                                    <span className="text-[10px] italic text-slate-400">Nenhuma cota ativa</span>
                                                )}
                                            </div>
                                        </div>
                                        <div className="text-right flex flex-col items-end">
                                            <p className={`font-black text-sm mb-1 ${paidNumbers.length > 0 ? 'text-emerald-500' : 'text-slate-400'}`}>
                                                {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(buyer.numbers.length * Number(rifa.numberPrice))}
                                            </p>
                                            <span className="text-[9px] text-slate-400 font-black uppercase tracking-widest">
                                                {new Date(buyer.createdAt).toLocaleDateString("pt-BR", { day: '2-digit', month: 'short' })}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            )
                        })
                    )}
                </div>

                {/* Loading State Mock */}
                {buyers.length > 0 && buyers.length >= 100 && (
                    <div className="py-10 text-center">
                        <p className="text-slate-400 text-xs font-black uppercase tracking-widest animate-pulse">Carregando mais...</p>
                    </div>
                )}
            </main>

            {/* Floating Action Button: Export CSV */}
            <div className="fixed bottom-8 right-8 z-40">
                <Button className="bg-slate-900 dark:bg-white text-white dark:text-slate-900 h-16 rounded-full px-8 shadow-2xl shadow-black/20 gap-3 hover:scale-105 active:scale-95 transition-all group">
                    <Download className="w-5 h-5 group-hover:translate-y-0.5 transition-transform" />
                    <span className="font-black text-sm uppercase tracking-widest">Exportar CSV</span>
                </Button>
            </div>
        </div>
    )
}

function MetricCard({ label, value, icon, color, bg, className }: { label: string, value: string, icon: React.ReactNode, color: string, bg: string, className?: string }) {
    return (
        <div className={`p-4 rounded-3xl bg-white dark:bg-slate-800 border border-primary/5 shadow-sm space-y-1 ${className}`}>
            <div className="flex items-center gap-2 mb-1">
                <div className={`p-1.5 rounded-lg ${bg} ${color}`}>{icon}</div>
                <span className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">{label}</span>
            </div>
            <p className="text-lg font-black text-slate-900 dark:text-white leading-none">{value}</p>
        </div>
    )
}
