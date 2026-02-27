import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { notFound, redirect } from "next/navigation"
import { RifaStatus } from "@prisma/client"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
    ArrowLeft,
    Edit,
    ExternalLink,
    Settings,
    Users,
    Gift,
    Trash2,
    Share2,
    TrendingUp,
    MoreVertical,
    CheckCircle2,
    Clock,
    Ticket,
    Copy,
    QrCode,
    Calendar,
    Target,
    Layers,
    UserCircle,
    Smartphone,
    CreditCard,
    DollarSign,
    Search,
    Filter
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import Image from "next/image"
import RifaActionsClient from "./RifaActionsClient"

export default async function RifaDetailsPage({ params }: { params: Promise<{ id: string }> }) {
    const session = await auth()
    if (!session?.user?.id) redirect("/login")

    const { id } = await params

    const rifa = await prisma.rifa.findUnique({
        where: {
            id,
            userId: session.user.id
        },
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
                include: {
                    buyer: true
                }
            }
        }
    })

    if (!rifa || (rifa.status as string) === "DELETED") notFound()

    const paidNumbers = rifa.numbers.filter(n => n.status === "PAID").length
    const reservedNumbers = rifa.numbers.filter(n => n.status === "RESERVED").length
    const availableNumbers = rifa.totalNumbers - paidNumbers - reservedNumbers
    const progressPercentage = Math.round((paidNumbers / rifa.totalNumbers) * 100)

    const formattedTotalRaised = new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL"
    }).format(Number(rifa.totalRaised))

    const targetRevenue = Number(rifa.numberPrice) * rifa.totalNumbers
    const formattedTargetRevenue = new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL"
    }).format(targetRevenue)

    const statusLabels: Record<string, { label: string, color: string }> = {
        ACTIVE: { label: "Ativa", color: "bg-emerald-500" },
        DRAFT: { label: "Rascunho", color: "bg-slate-400" },
        DRAWN: { label: "Sorteada", color: "bg-blue-500" },
        CANCELLED: { label: "Cancelada", color: "bg-red-500" },
        PAUSED: { label: "Pausada", color: "bg-amber-500" },
        CLOSED: { label: "Encerrada", color: "bg-slate-600" }
    }

    const currentStatus = statusLabels[rifa.status] || { label: rifa.status, color: "bg-slate-400" }

    return (
        <div className="min-h-screen bg-[#f7f6f8] dark:bg-[#171121] text-slate-900 dark:text-slate-100 pb-24 -m-4 md:-m-8">
            {/* Header */}
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

            <main className="p-6 space-y-8 max-w-4xl mx-auto">
                {/* Status Hero Card */}
                <section className="relative overflow-hidden bg-gradient-to-br from-primary to-purple-800 rounded-[2.5rem] p-8 md:p-12 text-white shadow-2xl shadow-primary/20">
                    <div className="flex justify-between items-start mb-10">
                        <Badge className={`${currentStatus.color} hover:${currentStatus.color} text-white border-transparent px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.2em] h-auto shadow-lg`}>
                            {currentStatus.label}
                        </Badge>
                        <div className="bg-white/10 p-3 rounded-2xl backdrop-blur-md">
                            <TrendingUp className="opacity-100 scale-110" />
                        </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-12 items-end relative z-10">
                        <div className="space-y-3">
                            <p className="text-white/70 text-xs font-black uppercase tracking-[0.2em]">Total arrecadado</p>
                            <h2 className="text-6xl font-black leading-none tracking-tighter drop-shadow-sm">{formattedTotalRaised}</h2>
                            <div className="flex items-center gap-3 mt-4">
                                <div className="bg-white/20 backdrop-blur-md px-4 py-1.5 rounded-full flex items-center gap-2 border border-white/10">
                                    <Target className="h-3 w-3 opacity-60" />
                                    <span className="text-xs font-black uppercase tracking-wider text-white">Meta: {formattedTargetRevenue}</span>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div className="w-full bg-black/20 rounded-full h-5 overflow-hidden border border-white/10 p-1 backdrop-blur-sm">
                                <div className="bg-white h-full rounded-full transition-all duration-1000 shadow-[0_0_20px_rgba(255,255,255,0.8)] relative" style={{ width: `${progressPercentage}%` }}>
                                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>
                                </div>
                            </div>
                            <div className="flex flex-col gap-2">
                                <div className="flex items-center justify-between">
                                    <p className="text-2xl font-black">{progressPercentage}% <span className="text-white/60 font-medium text-sm">concluído</span></p>
                                    <span className="text-xs font-black text-white/80 uppercase tracking-widest">{paidNumbers} vendidos</span>
                                </div>
                                <div className="flex items-center justify-between text-[10px] text-white/50 font-black uppercase tracking-[0.15em] pt-1">
                                    <span>{availableNumbers} números livres</span>
                                    <span>{reservedNumbers} reservas ativas</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Abstract elements */}
                    <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-white/10 rounded-full blur-[100px]"></div>
                    <div className="absolute -top-10 -left-10 w-48 h-48 bg-purple-400/20 rounded-full blur-[80px]"></div>
                </section>

                <div className="grid md:grid-cols-3 gap-6">
                    {/* Configuration Summary */}
                    <CardWrapper title="Configurações da Campanha">
                        <div className="space-y-5">
                            <ConfigItem icon={<Layers className="h-4 w-4" />} label="Categoria" value={rifa.category} />
                            <ConfigItem icon={<Gift className="h-4 w-4" />} label="Método" value={rifa.drawMethod} />
                            <ConfigItem icon={<Calendar className="h-4 w-4" />} label="Premiação" value={rifa.drawDate ? new Date(rifa.drawDate).toLocaleDateString("pt-BR") : "Não definido"} />
                            <ConfigItem icon={<UserCircle className="h-4 w-4" />} label="Limite/User" value={rifa.maxPerBuyer ? `${rifa.maxPerBuyer} cotas` : "Ilimitado"} />
                            <ConfigItem icon={<Smartphone className="h-4 w-4" />} label="Visibilidade" value={rifa.isPrivate ? "Privada" : "Pública"} />
                        </div>
                    </CardWrapper>

                    {/* Raffle Link Section */}
                    <CardWrapper title="Link e Compartilhamento" className="md:col-span-2">
                        <div className="h-full flex flex-col justify-between space-y-6">
                            <div className="space-y-3">
                                <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Link da sua Campanha</p>
                                <div className="flex items-center gap-3 p-4 bg-slate-50 dark:bg-slate-900 rounded-3xl border border-primary/10 group overflow-hidden">
                                    <span className="text-xs text-slate-500 flex-1 truncate font-mono">rifa.com.br/r/{rifa.slug}</span>
                                    <button className="p-2 text-primary hover:bg-primary/10 rounded-2xl transition-colors active:scale-90">
                                        <Copy className="h-5 w-5" />
                                    </button>
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <Button className="flex-1 bg-[#25D366] hover:bg-[#20bd5a] text-white h-14 rounded-2xl font-black text-sm flex items-center gap-3 shadow-xl shadow-emerald-500/10 active:scale-95 transition-all">
                                    <Share2 className="h-4 w-4" />
                                    WhatsApp
                                </Button>
                                <Button variant="outline" className="w-16 h-14 bg-white dark:bg-slate-900 border-primary/20 rounded-2xl flex items-center justify-center text-primary group active:scale-95 transition-all">
                                    <QrCode className="h-6 w-6 group-hover:scale-110 transition-transform" />
                                </Button>
                            </div>
                        </div>
                    </CardWrapper>
                </div>

                {/* Quick Actions Grid */}
                <section>
                    <h3 className="font-sans font-black text-slate-900 dark:text-white mb-6 px-1 uppercase tracking-widest text-[10px]">Gerenciamento de Fluxo</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <QuickActionButton icon={<Share2 />} label="Divulgar" color="text-blue-500" bg="bg-blue-50" darkBg="dark:bg-blue-900/20" href={`/r/${rifa.slug}`} external />
                        <QuickActionButton icon={<Users />} label="Apoiadores" color="text-amber-500" bg="bg-amber-50" darkBg="dark:bg-amber-900/20" href={`/dashboard/rifas/${rifa.id}/compradores`} />
                        <QuickActionButton icon={<Edit />} label="Editar Campanha" color="text-purple-500" bg="bg-purple-50" darkBg="dark:bg-purple-900/20" href={`/dashboard/rifas/${rifa.id}/editar`} />

                        {rifa.status === "DRAWN" ? (
                            <div className="flex flex-col items-center justify-center p-6 bg-slate-100 dark:bg-slate-900 opacity-50 rounded-[2rem] border border-transparent">
                                <CheckCircle2 className="h-8 w-8 mb-3 text-slate-400" />
                                <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 text-center">Finalizada</span>
                            </div>
                        ) : (
                            <Button className="flex flex-col h-auto p-6 gap-3 bg-primary text-white rounded-[2rem] shadow-xl shadow-primary/20 group hover:scale-[1.02] transition-transform" asChild>
                                <Link href={`/sorteio/${rifa.id}`}>
                                    <Gift className="h-8 w-8 mb-0 group-hover:rotate-12 transition-transform" />
                                    <span className="text-[10px] font-black uppercase tracking-widest text-center">Finalizar e Premiar</span>
                                </Link>
                            </Button>
                        )}
                    </div>
                </section>

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Detailed Sales View */}
                    <div className="lg:col-span-2 bg-white dark:bg-slate-800 p-10 rounded-[2.5rem] border border-primary/5 shadow-sm space-y-8">
                        <div className="flex justify-between items-start">
                            <div className="space-y-1">
                                <h3 className="font-black text-slate-900 dark:text-white text-lg">Histórico Semanal</h3>
                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em]">Desempenho de Vendas</p>
                            </div>
                            <Badge className="bg-emerald-100 text-emerald-600 border-none font-black text-[10px] uppercase tracking-widest">+12.4%</Badge>
                        </div>

                        <div className="flex items-end justify-between h-48 gap-4 px-2">
                            {[42, 68, 35, 85, 52, 98, 90].map((val, i) => (
                                <div key={i} className="flex-1 space-y-3 group cursor-pointer">
                                    <div
                                        className={`w-full rounded-t-2xl transition-all duration-700 group-hover:scale-x-105 active:scale-y-95 ${i === 6 ? 'bg-primary shadow-[0_0_20px_rgba(236,91,19,0.3)]' : 'bg-primary/10 dark:bg-primary/20'}`}
                                        style={{ height: `${val}%` }}
                                    ></div>
                                    <div className="text-[9px] text-slate-400 font-black text-center uppercase tracking-widest">
                                        {['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'][i]}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Recent Buyers Side */}
                    <div className="bg-white dark:bg-slate-800 p-8 rounded-[2.5rem] border border-primary/5 shadow-sm space-y-6 overflow-hidden flex flex-col">
                        <div className="flex justify-between items-center mb-2">
                            <h3 className="font-black text-slate-900 dark:text-white text-sm uppercase tracking-widest">Recentes</h3>
                            <Link className="text-primary text-[10px] font-black uppercase tracking-widest hover:underline" href={`/dashboard/rifas/${rifa.id}/compradores`}>Ver</Link>
                        </div>

                        <div className="space-y-4 flex-1">
                            {rifa.buyers.length > 0 ? (
                                rifa.buyers.map((buyer) => (
                                    <div key={buyer.id} className="flex items-center gap-3 p-3 bg-slate-50/50 dark:bg-slate-900/30 rounded-2xl transition-all hover:bg-white dark:hover:bg-slate-900 hover:shadow-md border border-transparent hover:border-primary/5 group">
                                        <div className="size-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-black text-[11px] uppercase group-hover:bg-primary group-hover:text-white transition-colors">
                                            {buyer.name.substring(0, 2)}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h4 className="text-xs font-black text-slate-900 dark:text-white truncate">{buyer.name}</h4>
                                            <p className="text-[9px] text-slate-400 font-bold">{new Date(buyer.createdAt).toLocaleDateString("pt-BR")}</p>
                                        </div>
                                        <div className="p-1 px-2.5 rounded-full bg-primary/5 text-primary text-[9px] font-black uppercase">
                                            Pago
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="h-full flex flex-col items-center justify-center opacity-30 text-center py-10">
                                    <Ticket className="h-8 w-8 mb-2" />
                                    <p className="text-xs font-black uppercase tracking-widest">Vazio</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Transaction Table */}
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
                                    <th className="px-8 py-5 text-right">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-700/30">
                                {rifa.transactions.length > 0 ? (
                                    rifa.transactions.map((tx) => (
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
                                            <td className="px-8 py-5 text-right">
                                                <Badge variant={tx.status === "PAID" ? "default" : tx.status === "PENDING" ? "outline" : "destructive"} className="font-black text-[9px] uppercase tracking-widest px-3">
                                                    {tx.status === "PAID" ? "Pago" : tx.status === "PENDING" ? "Pendente" : "Cancelado"}
                                                </Badge>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={5} className="px-8 py-20 text-center opacity-40">
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
            </main>
        </div>
    )
}

function CardWrapper({ title, children, className }: { title: string, children: React.ReactNode, className?: string }) {
    return (
        <div className={`bg-white dark:bg-slate-800 p-8 rounded-[2.5rem] border border-primary/5 shadow-sm space-y-6 ${className}`}>
            <h3 className="font-black text-slate-900 dark:text-white text-[10px] uppercase tracking-widest border-l-2 border-primary pl-3">{title}</h3>
            {children}
        </div>
    )
}

function ConfigItem({ icon, label, value }: { icon: React.ReactNode, label: string, value: string }) {
    return (
        <div className="flex items-center justify-between group">
            <div className="flex items-center gap-3">
                <div className="p-2 bg-slate-50 dark:bg-slate-900 rounded-xl text-slate-400 group-hover:text-primary transition-colors">
                    {icon}
                </div>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">{label}</span>
            </div>
            <span className="text-xs font-black text-slate-900 dark:text-white">{value}</span>
        </div>
    )
}

function QuickActionButton({ icon, label, color, bg, darkBg, href, external = false }: { icon: React.ReactNode, label: string, color: string, bg: string, darkBg: string, href: string, external?: boolean }) {
    const content = (
        <>
            <div className={`size-12 ${bg} ${darkBg} rounded-2xl flex items-center justify-center ${color} mb-3 group-hover:scale-110 transition-transform`}>
                {icon}
            </div>
            <span className="font-black text-center text-[10px] uppercase tracking-wider leading-none">{label}</span>
        </>
    )

    return (
        <Button variant="outline" className="flex flex-col h-auto p-6 bg-white dark:bg-slate-900 border-primary/5 hover:border-primary/20 hover:bg-primary/[0.02] rounded-[2rem] shadow-sm transition-all group" asChild>
            {external ? <a href={href} target="_blank">{content}</a> : <Link href={href}>{content}</Link>}
        </Button>
    )
}
