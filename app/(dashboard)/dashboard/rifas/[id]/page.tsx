import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { notFound, redirect } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import RifaActionsClient from "./RifaActionsClient"

// Modular Components
import { StatHero } from "@/components/dashboard/rifa-details/StatHero"
import { WinnersCard } from "@/components/dashboard/rifa-details/WinnersCard"
import { ActionGrid } from "@/components/dashboard/rifa-details/ActionGrid"
import { SaleHistoryChart } from "@/components/dashboard/rifa-details/SaleHistoryChart"
import { ConfigCard } from "@/components/dashboard/rifa-details/ConfigCard"
import { SharingCard } from "@/components/dashboard/rifa-details/SharingCard"
import { RecentBuyersCard } from "@/components/dashboard/rifa-details/RecentBuyersCard"
import { TransactionTable } from "@/components/dashboard/rifa-details/TransactionTable"
import { QuotaCommissionCard } from "@/components/dashboard/rifa-details/QuotaCommissionCard"

export default async function RifaDetailsPage({ params }: { params: Promise<{ id: string }> }) {
    const session = await auth()
    if (!session?.user?.id) redirect("/login")

    const { id } = await params

    const rifa = await prisma.rifa.findUnique({
        where: { id, userId: session.user.id },
        include: {
            _count: {
                select: {
                    numbers: { where: { status: "PAID" } },
                    buyers: true
                }
            },
            buyers: {
                take: 5,
                orderBy: { createdAt: "desc" }
            },
            numbers: {
                where: { status: { in: ["RESERVED", "PAID"] } },
                select: { status: true }
            },
            transactions: {
                take: 10,
                orderBy: { createdAt: "desc" },
                include: { buyer: true }
            },
            prizes: {
                orderBy: { position: "asc" },
                include: { winner: true }
            }
        }
    })

    if (!rifa || (rifa.status as string) === "DELETED") notFound()

    const paidNumbers = rifa.numbers.filter(n => n.status === "PAID").length
    const reservedNumbers = rifa.numbers.filter(n => n.status === "RESERVED").length

    const statusConfig: Record<string, { label: string, color: string }> = {
        ACTIVE: { label: "Ativa", color: "bg-emerald-500" },
        DRAFT: { label: "Rascunho", color: "bg-slate-400" },
        DRAWN: { label: "Sorteada", color: "bg-blue-500" },
        CANCELLED: { label: "Cancelada", color: "bg-red-500" },
        PAUSED: { label: "Pausada", color: "bg-amber-500" },
        CLOSED: { label: "Encerrada", color: "bg-slate-600" }
    }

    const currentStatus = statusConfig[rifa.status] || { label: rifa.status, color: "bg-slate-400" }

    return (
        <div className="min-h-screen bg-[#f7f6f8] dark:bg-[#171121] text-slate-900 dark:text-slate-100 pb-24 -m-4 md:-m-8">
            {/* Page Header */}
            <header className="sticky top-0 z-50 bg-white/80 dark:bg-[#171121]/80 backdrop-blur-md px-6 py-4 flex items-center justify-between border-b border-primary/10">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" className="rounded-full hover:bg-primary/10 group" asChild>
                        <Link href="/dashboard/rifas">
                            <ArrowLeft className="h-5 w-5 text-primary group-hover:-translate-x-1 transition-transform" />
                        </Link>
                    </Button>
                    <div className="flex flex-col">
                        <h1 className="font-sans font-black text-lg text-slate-900 dark:text-white truncate max-w-[200px] md:max-w-md leading-none">
                            {rifa.title}
                        </h1>
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 mt-1 flex items-center gap-1">
                            ID: {rifa.id.substring(0, 8)}... • Criada em {new Date(rifa.createdAt).toLocaleDateString("pt-BR")}
                        </span>
                    </div>
                </div>

                <RifaActionsClient rifa={{ id: rifa.id, slug: rifa.slug, title: rifa.title, status: rifa.status }} />
            </header>

            <main className="p-6 space-y-8 max-w-7xl mx-auto">
                <div className="grid lg:grid-cols-12 gap-8 items-start">
                    {/* Left Column (8/12) */}
                    <div className="lg:col-span-8 space-y-8">
                        <StatHero
                            statusLabel={currentStatus.label}
                            statusColor={currentStatus.color}
                            totalRaised={Number(rifa.totalRaised)}
                            totalNumbers={rifa.totalNumbers}
                            paidNumbers={paidNumbers}
                            reservedNumbers={reservedNumbers}
                            numberPrice={Number(rifa.numberPrice)}
                        />

                        <WinnersCard
                            prizes={rifa.prizes.map(p => ({
                                id: p.id,
                                title: p.title,
                                position: p.position,
                                winnerId: p.winnerId,
                                winnerNumber: p.winnerNumber,
                                winner: p.winner ? { name: p.winner.name, whatsapp: (p.winner as any).whatsapp } : null
                            }))}
                            rifaTitle={rifa.title}
                        />

                        <QuotaCommissionCard
                            paid={Number(rifa.quotaCommissionPaid || 0)}
                            goal={Number(rifa.quotaCommissionGoal || 0)}
                            percent={Number(rifa.quotaCommissionPercent || 0.05)}
                        />

                        <ActionGrid rifaId={rifa.id} slug={rifa.slug} status={rifa.status} />

                        <SaleHistoryChart />
                    </div>

                    {/* Right Column (4/12) */}
                    <div className="lg:col-span-4 space-y-6">
                        <ConfigCard
                            category={rifa.category}
                            drawMethod={rifa.drawMethod}
                            drawDate={rifa.drawDate}
                            maxPerBuyer={rifa.maxPerBuyer}
                            isPrivate={rifa.isPrivate}
                        />

                        <SharingCard slug={rifa.slug} />

                        <RecentBuyersCard
                            rifaId={rifa.id}
                            buyers={rifa.buyers.map(b => ({
                                id: b.id,
                                name: b.name,
                                createdAt: b.createdAt
                            }))}
                        />
                    </div>
                </div>

                <TransactionTable
                    transactions={rifa.transactions.map(tx => ({
                        id: tx.id,
                        buyer: {
                            name: tx.buyer.name,
                            whatsapp: tx.buyer.whatsapp
                        },
                        numbers: tx.numbers,
                        amount: Number(tx.amount),
                        status: tx.status,
                        createdAt: tx.createdAt
                    }))}
                    rifaId={rifa.id}
                />
            </main>
        </div>
    )
}
