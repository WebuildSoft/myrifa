import { prisma } from "@/lib/prisma"
import type { CSSProperties } from "react"
import { notFound } from "next/navigation"
import Link from "next/link"
import { NumberGrid } from "@/components/rifa/NumberGrid"
import { Sparkles, Ticket, Info, HelpCircle, Diamond } from "lucide-react"
import { Metadata } from "next"
import { RifaStatus } from "@prisma/client"
import { PublicWinners } from "@/components/rifa/PublicWinners"
import { ShareCampaign } from "@/components/rifa/ShareCampaign"
import { cn } from "@/lib/utils"

// New modular components
import { PublicHeader } from "@/components/rifa/public/PublicHeader"
import { PublicFooter } from "@/components/rifa/public/PublicFooter"
import { CampaignHero } from "@/components/rifa/public/CampaignHero"
import { CampaignStatsCard } from "@/components/rifa/public/CampaignStatsCard"
import { CampaignRules } from "@/components/rifa/public/CampaignRules"
import { getThemeConfig } from "@/lib/themes"

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const { slug } = await params
    const rifa = await prisma.rifa.findUnique({ where: { slug } })

    if (!rifa) return { title: "Campanha não encontrada" }

    const allImages = [
        ...(rifa.coverImage ? [rifa.coverImage] : []),
        ...(rifa.images || [])
    ]

    return {
        title: `${rifa.title} | MyRifa`,
        description: rifa.description || `Apoie a campanha ${rifa.title} e contribua para o nosso objetivo!`,
        openGraph: {
            title: rifa.title,
            description: rifa.description || `Garanta suas cotas para ${rifa.title}`,
            images: allImages.length > 0 ? allImages : [],
        },
    }
}

const CATEGORY_LABELS: Record<string, string> = {
    SORTEIO: "Campanha de Produto",
    ARRECADACAO: "Arrecadação Solidária",
    VIAGEM: "Viagem & Experiência",
    MISSAO: "Missão entre Amigos",
    SAUDE: "Saúde & Tratamento",
    ESPORTE: "Esporte & Lazer",
    OUTRO: "Outro",
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
            prizes: {
                orderBy: { position: "asc" },
                include: { winner: true }
            },
            _count: {
                select: { numbers: { where: { status: "PAID" } } }
            }
        }
    })

    if (!rifa || rifa.isPrivate || rifa.status === RifaStatus.CANCELLED || rifa.status === RifaStatus.DELETED) {
        notFound()
    }

    const allImages = [
        ...(rifa.coverImage ? [rifa.coverImage] : []),
        ...(rifa.images || [])
    ]

    const paidNumbers = rifa._count.numbers
    const progress = rifa.totalNumbers > 0 ? Math.round((paidNumbers / rifa.totalNumbers) * 100) : 0

    const formattedPrice = new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
    }).format(Number(rifa.numberPrice))

    const themeConfig = getThemeConfig(rifa.theme)

    const customCssVars = {
        ...themeConfig.cssVars,
        ...(rifa.primaryColor ? {
            '--primary': rifa.primaryColor,
            '--color-primary': rifa.primaryColor,
            '--ring': rifa.primaryColor
        } : {})
    } as CSSProperties

    return (
        <div className={cn(
            "min-h-screen font-sans",
            themeConfig.body,
            themeConfig.text,
            themeConfig.selection
        )} style={customCssVars}>
            <PublicHeader />

            <main className="max-w-[1400px] mx-auto pb-20">
                <CampaignHero images={allImages} title={rifa.title} />

                <div className="px-3 md:px-6">
                    <div className="md:grid md:grid-cols-[1fr_1.4fr] md:gap-6 md:-mt-16 relative z-10 items-start">

                        {/* LEFT COLUMN: Info & Share */}
                        <div className="space-y-4 -mt-8 md:mt-0">
                            <CampaignStatsCard
                                organizer={rifa.user ? { name: rifa.user.name, image: rifa.user.image } : null}
                                categoryLabel={CATEGORY_LABELS[rifa.category] ?? rifa.category}
                                title={rifa.title}
                                formattedPrice={formattedPrice}
                                status={rifa.status}
                                description={rifa.description}
                                progress={progress}
                                paidNumbers={paidNumbers}
                                totalNumbers={rifa.totalNumbers}
                                themePrimary={themeConfig.primary}
                                themeAccent={themeConfig.accent}
                                drawDate={rifa.drawDate}
                            />

                            {/* Share & Trust Badge */}
                            <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-100 dark:border-slate-700 flex items-center justify-between shadow-sm">
                                <div className="flex items-center gap-3">
                                    <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center", themeConfig.accent, themeConfig.primary)}>
                                        <Sparkles className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-slate-900 dark:text-white uppercase">Campanha Certificada</p>
                                        <p className="text-[10px] text-slate-400 font-medium">Transparência garantida</p>
                                    </div>
                                </div>
                                <ShareCampaign slug={rifa.slug} title={rifa.title} />
                            </div>
                        </div>

                        {/* RIGHT COLUMN: Grid & Rules */}
                        <div className="mt-4 md:mt-0">
                            <section id="numbers" className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-sm p-4 md:p-6 overflow-hidden">
                                <div className="flex items-center justify-between mb-5">
                                    <h2 className="text-lg md:text-xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
                                        <Ticket className={cn("w-5 h-5", themeConfig.primary)} />
                                        Escolha suas cotas
                                    </h2>
                                    <button className={cn("text-slate-400 transition-colors", themeConfig.primary.replace('text-', 'hover:text-'))}>
                                        <HelpCircle className="w-5 h-5" />
                                    </button>
                                </div>

                                {rifa.status === RifaStatus.DRAWN ? (
                                    <PublicWinners prizes={rifa.prizes.map(p => ({
                                        id: p.id,
                                        title: p.title,
                                        position: p.position,
                                        winner: p.winner ? { name: p.winner.name } : null,
                                        winnerNumber: p.winnerNumber
                                    }))} />
                                ) : (
                                    <NumberGrid
                                        rifaId={rifa.id}
                                        numbers={rifa.numbers.map(n => ({ id: n.id, number: n.number, status: n.status }))}
                                        price={Number(rifa.numberPrice)}
                                        currencyFormatted={formattedPrice}
                                        maxPerBuyer={rifa.maxPerBuyer}
                                        balloonShape={rifa.balloonShape}
                                        primaryColor={rifa.primaryColor || themeConfig.primaryHex}
                                        rifaTitle={rifa.title}
                                        rifaCover={rifa.coverImage}
                                    />
                                )}

                                <div className="mt-6 pt-6 border-t border-slate-50 dark:border-slate-700/50 flex justify-center">
                                    <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-700/30 px-5 py-2.5 rounded-full text-slate-500 font-bold text-sm">
                                        <Info className="w-4 h-4" />
                                        Clique nos círculos para selecionar
                                    </div>
                                </div>
                            </section>

                            <CampaignRules rules={rifa.rules} />
                        </div>
                    </div>
                </div>
            </main>

            <section className="max-w-[1400px] mx-auto px-3 md:px-6 mb-12">
                <div className="bg-gradient-to-br from-primary to-primary/80 rounded-[2.5rem] p-8 md:p-12 text-white relative overflow-hidden shadow-2xl shadow-primary/20 group">
                    <div className="absolute -right-10 -bottom-10 opacity-10 group-hover:scale-110 transition-transform duration-700">
                        <Sparkles className="w-64 h-64" />
                    </div>

                    <div className="relative z-10 grid md:grid-cols-2 gap-12 items-center">
                        <div className="space-y-6">
                            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/20">
                                <Diamond className="w-4 h-4" />
                                <span className="text-[10px] font-black uppercase tracking-widest">Oportunidade</span>
                            </div>

                            <h2 className="text-4xl md:text-5xl font-black tracking-tight leading-tight">
                                Quer lançar sua <br />
                                <span className="text-white/80">própria campanha?</span>
                            </h2>

                            <p className="text-lg text-white/70 font-medium leading-relaxed max-w-md">
                                Junte-se a milhares de organizadores e crie sua campanha de arrecadação profissional em minutos.
                            </p>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4 justify-end">
                            <Link
                                href="/register"
                                className="inline-flex items-center justify-center gap-3 bg-white text-primary px-8 h-16 rounded-2xl font-black uppercase tracking-wider hover:scale-105 active:scale-95 transition-all shadow-xl shadow-black/10 text-sm whitespace-nowrap"
                            >
                                <Sparkles className="w-5 h-5" />
                                Começar Agora
                            </Link>
                            <Link
                                href="/sobre"
                                className="inline-flex items-center justify-center gap-3 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white px-8 h-16 rounded-2xl font-black uppercase tracking-wider transition-all text-sm whitespace-nowrap"
                            >
                                Saiba Mais
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            <PublicFooter />
        </div>
    )
}
