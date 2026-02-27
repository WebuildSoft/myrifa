import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"
import { NumberGrid } from "@/components/rifa/NumberGrid"
import { ShareCampaign } from "@/components/rifa/ShareCampaign"
import {
    Clock,
    CheckCircle2,
    Users,
    Trophy,
    Shield,
    Sparkles,
    CalendarDays,
    Ticket,
    Info,
    HelpCircle
} from "lucide-react"
import { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { ImageSlider } from "@/components/rifa/ImageSlider"
import { RifaStatus } from "@prisma/client"

// Simple Button component for reuse inside this file
function Button({ className, children, ...props }: any) {
    return (
        <button
            className={`inline-flex items-center justify-center rounded-md font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 ${className}`}
            {...props}
        >
            {children}
        </button>
    )
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const { slug } = await params
    const rifa = await prisma.rifa.findUnique({ where: { slug } })

    if (!rifa) return { title: "Rifa não encontrada" }

    const allImages = [
        ...(rifa.coverImage ? [rifa.coverImage] : []),
        ...(rifa.images || [])
    ]

    return {
        title: `${rifa.title} | MyRifa`,
        description: rifa.description || `Participe da rifa ${rifa.title} e concorra a prêmios incríveis!`,
        openGraph: {
            title: rifa.title,
            description: rifa.description || `Garanta seus números para ${rifa.title}`,
            images: allImages.length > 0 ? allImages : [],
        },
    }
}

export default async function PublicRifaPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params
    const rifa = await prisma.rifa.findUnique({
        where: { slug },
        include: {
            numbers: {
                orderBy: { number: "asc" },
                select: { id: true, number: true, status: true }
            },
            user: { select: { name: true, image: true } },
            _count: {
                select: { numbers: { where: { status: "PAID" } } }
            }
        }
    })

    if (!rifa || rifa.isPrivate || rifa.status === RifaStatus.CANCELLED || rifa.status === RifaStatus.DELETED) notFound()

    const allImages = [
        ...(rifa.coverImage ? [rifa.coverImage] : []),
        ...(rifa.images || [])
    ]

    const paidNumbers = rifa._count.numbers
    const progress = Math.round((paidNumbers / rifa.totalNumbers) * 100)

    const formattedPrice = new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
    }).format(Number(rifa.numberPrice))

    const categoryLabels: Record<string, string> = {
        SORTEIO: "Sorteio de Produto",
        ARRECADACAO: "Arrecadação Solidária",
        VIAGEM: "Viagem & Experiência",
        MISSAO: "Missão entre Amigos",
        SAUDE: "Saúde & Tratamento",
        ESPORTE: "Esporte & Lazer",
        OUTRO: "Outro",
    }

    return (
        <div className="min-h-screen bg-[#f5f3ff] dark:bg-[#171121] text-slate-900 dark:text-slate-100 font-sans selection:bg-primary/20">
            {/* ── TOP NAVIGATION ────────────────────────────────────────────── */}
            <header className="sticky top-0 z-50 w-full border-b border-primary/10 bg-white/80 dark:bg-[#171121]/80 backdrop-blur-md">
                <div className="mx-auto flex max-w-[1400px] items-center justify-between px-4 md:px-6 py-4">
                    <Link href="/" className="flex items-center gap-3 group">
                        <div className="text-primary transition-transform group-hover:scale-110">
                            <Ticket className="w-8 h-8 rotate-12" />
                        </div>
                        <h2 className="text-xl font-black tracking-tight text-slate-900 dark:text-white">MyRifa</h2>
                    </Link>
                    <nav className="hidden md:flex items-center gap-8">
                        <Link href="/rifas" className="text-sm font-bold hover:text-primary transition-colors">Sorteios</Link>
                        <Link href="/ganhadores" className="text-sm font-bold hover:text-primary transition-colors">Ganhadores</Link>
                        <Link href="/ajuda" className="text-sm font-bold hover:text-primary transition-colors">Como Funciona</Link>
                        <Link href="/minhas-cotas">
                            <Button className="bg-primary text-white px-6 py-2.5 rounded-full text-sm font-black shadow-lg shadow-primary/20 hover:scale-105 transition-transform h-auto">
                                Minhas Cotas
                            </Button>
                        </Link>
                    </nav>
                </div>
            </header>

            {/* ── HERO BANNER ────────────────────────────────────────────────── */}
            <div className="relative w-full h-[300px] md:h-[420px] bg-black overflow-hidden">
                <ImageSlider images={allImages} title={rifa.title} />
                {/* Overlay gradient - only decorative on desktop */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none hidden md:block" />
            </div>

            {/* ── MAIN CONTENT: 2-column on desktop, stacked on mobile ────── */}
            <main className="max-w-[1400px] mx-auto px-3 md:px-6 pb-20">
                <div className="md:grid md:grid-cols-[1fr_1.4fr] md:gap-6 md:-mt-16 relative z-10 items-start">

                    {/* ── LEFT COLUMN: Info Card + Share ────────────────────── */}
                    <div className="space-y-4 -mt-8 md:mt-0">
                        {/* Info Card */}
                        <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-2xl p-5 md:p-7 border border-slate-100 dark:border-slate-700">

                            {/* Organizer — always visible */}
                            <div className="flex items-center gap-3 mb-5 pb-5 border-b border-slate-100 dark:border-slate-700/50">
                                <div className="w-11 h-11 rounded-full border-2 border-primary/20 overflow-hidden bg-slate-100 shrink-0">
                                    {rifa.user?.image ? (
                                        <Image src={rifa.user.image} alt={rifa.user.name || "Organizador"} width={44} height={44} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full bg-slate-200 flex items-center justify-center text-slate-500">
                                            <Users className="w-5 h-5" />
                                        </div>
                                    )}
                                </div>
                                <div>
                                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Organizado por</p>
                                    <p className="text-sm font-black text-slate-900 dark:text-white">{rifa.user?.name || "Premium Raffles"}</p>
                                </div>
                                <span className="ml-auto bg-primary/10 text-primary text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-widest shrink-0">
                                    {categoryLabels[rifa.category] ?? rifa.category}
                                </span>
                            </div>

                            <div className="flex justify-between items-start mb-4">
                                <h1 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white leading-tight tracking-tight pr-4">
                                    {rifa.title}
                                </h1>
                                <div className="text-right shrink-0">
                                    <p className="text-primary text-2xl md:text-3xl font-black tracking-tight">{formattedPrice}</p>
                                    <p className="text-slate-400 text-[10px] font-bold uppercase">por número</p>
                                </div>
                            </div>

                            {rifa.description && (
                                <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed mb-5">
                                    {rifa.description}
                                </p>
                            )}

                            {/* Countdown Timer */}
                            <div className="grid grid-cols-4 gap-2 py-4 border-y border-slate-100 dark:border-slate-700/50 mb-5">
                                {[
                                    { val: "02", label: "Dias" },
                                    { val: "14", label: "Horas" },
                                    { val: "35", label: "Min" },
                                    { val: "12", label: "Seg" }
                                ].map((item, i) => (
                                    <div key={i} className="text-center">
                                        <p className="text-xl md:text-2xl font-black text-primary">{item.val}</p>
                                        <p className="text-[9px] uppercase font-bold text-slate-400 tracking-tighter">{item.label}</p>
                                    </div>
                                ))}
                            </div>

                            {/* Sales Progress */}
                            <div className="space-y-2">
                                <div className="flex justify-between items-end">
                                    <p className="text-xs font-black text-slate-700 dark:text-slate-300 uppercase tracking-wider">Progresso de Vendas</p>
                                    <p className="text-xs font-black text-primary">{progress}% vendidos</p>
                                </div>
                                <div className="w-full h-3 bg-slate-100 dark:bg-slate-700/50 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-gradient-to-r from-primary to-violet-400 rounded-full transition-all duration-1000 shadow-[0_0_10px_rgba(124,59,237,0.3)]"
                                        style={{ width: `${progress}%` }}
                                    />
                                </div>
                                <p className="text-center text-[10px] text-slate-400 font-bold uppercase pt-1">
                                    <span className="text-slate-900 dark:text-slate-200">{rifa._count.numbers}</span> de {rifa.totalNumbers} cotas garantidas
                                </p>
                            </div>
                        </div>

                        {/* Share & Trust */}
                        <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-100 dark:border-slate-700 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                                    <Sparkles className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-slate-900 dark:text-white uppercase">Sorteio Oficial</p>
                                    <p className="text-[10px] text-slate-400 font-medium">100% regulamentado</p>
                                </div>
                            </div>
                            <ShareCampaign slug={rifa.slug} title={rifa.title} />
                        </div>



                    </div>

                    {/* ── RIGHT COLUMN: Number Grid (full-width on mobile) ──── */}
                    <div className="mt-4 md:mt-0">
                        <section id="numbers" className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-sm p-4 md:p-6 overflow-hidden">
                            <div className="flex items-center justify-between mb-5">
                                <h2 className="text-lg md:text-xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
                                    <Ticket className="w-5 h-5 text-primary" />
                                    Escolha seus números
                                </h2>
                                <button className="text-slate-400 hover:text-primary transition-colors">
                                    <HelpCircle className="w-5 h-5" />
                                </button>
                            </div>

                            <NumberGrid
                                rifaId={rifa.id}
                                numbers={rifa.numbers}
                                price={Number(rifa.numberPrice)}
                                currencyFormatted={formattedPrice}
                                maxPerBuyer={rifa.maxPerBuyer}
                                balloonShape={rifa.balloonShape}
                                primaryColor={rifa.primaryColor}
                                rifaTitle={rifa.title}
                                rifaCover={rifa.coverImage}
                            />

                            <div className="mt-6 pt-6 border-t border-slate-50 dark:border-slate-700/50 flex justify-center">
                                <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-700/30 px-5 py-2.5 rounded-full text-slate-500 font-bold text-sm">
                                    <Info className="w-4 h-4" />
                                    Clique nos círculos para selecionar
                                </div>
                            </div>
                        </section>

                        {/* Rules — below grid on all screen sizes */}
                        <section className="mt-4">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                                    <CalendarDays className="w-4 h-4" />
                                </div>
                                <h3 className="text-lg font-black text-slate-900 dark:text-white">Regras e Instruções</h3>
                            </div>
                            {rifa.rules ? (
                                <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm leading-relaxed whitespace-pre-wrap text-sm font-medium text-slate-600 dark:text-slate-300">
                                    {rifa.rules}
                                </div>
                            ) : (
                                <ul className="grid gap-3">
                                    {[
                                        { icon: CheckCircle2, text: "Sorteio baseado no resultado da Loteria Federal.", color: "text-emerald-500" },
                                        { icon: Shield, text: "Pagamento 100% seguro e criptografado.", color: "text-blue-500" },
                                        { icon: Clock, text: "Reserva de 30 minutos após a seleção.", color: "text-amber-500" },
                                        { icon: Trophy, text: "Entrega garantida pela plataforma rifa.", color: "text-violet-500" }
                                    ].map((rule, i) => (
                                        <li key={i} className="flex items-center gap-3 bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm">
                                            <rule.icon className={`w-5 h-5 shrink-0 ${rule.color}`} />
                                            <span className="text-sm font-bold text-slate-600 dark:text-slate-300">{rule.text}</span>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </section>
                    </div>

                </div>
            </main>

            {/* ── FOOTER ─────────────────────────────────────────────────────── */}
            <footer className="mt-8 border-t border-slate-200 dark:border-slate-800 py-12 bg-white dark:bg-[#171121]">
                <div className="mx-auto max-w-[1400px] px-6 text-center">
                    <div className="flex items-center justify-center gap-3 mb-6 opacity-40">
                        <Ticket className="w-6 h-6 text-primary" />
                        <h2 className="text-lg font-black tracking-tight text-slate-900 dark:text-white">MyRifa</h2>
                    </div>
                    <p className="text-sm text-slate-400 max-w-[600px] mx-auto mb-6 font-medium leading-relaxed">
                        Participar de sorteios é uma atividade de entretenimento. Jogue com responsabilidade. Sorteios realizados em conformidade com as leis vigentes.
                    </p>
                    <div className="flex flex-wrap justify-center gap-8 mb-8 text-slate-400">
                        <Link href="/termos" className="hover:text-primary transition-colors text-xs font-black uppercase tracking-widest">Termos de Uso</Link>
                        <Link href="/privacidade" className="hover:text-primary transition-colors text-xs font-black uppercase tracking-widest">Privacidade</Link>
                        <Link href="/ajuda" className="hover:text-primary transition-colors text-xs font-black uppercase tracking-widest">FAQ</Link>
                        <Link href="/ajuda" className="hover:text-primary transition-colors text-xs font-black uppercase tracking-widest">Suporte</Link>
                    </div>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">© 2024 MyRifa Intermediações. Todos os direitos reservados.</p>
                </div>
            </footer>
        </div>
    )
}

