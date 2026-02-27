import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"
import Link from "next/link"
import { Trophy, ArrowLeft, Calendar, User } from "lucide-react"

export default async function PublicResultPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params
    const rifa = await prisma.rifa.findUnique({
        where: { slug }
    })

    // Exclude private or non-active ones
    if (!rifa || rifa.isPrivate) {
        notFound()
    }

    let winnerName = null
    if (rifa.winnerId) {
        const winner = await prisma.buyer.findUnique({ where: { id: rifa.winnerId } })
        // partially anonymize for privacy on public page
        if (winner?.name) {
            const parts = winner.name.split(" ")
            winnerName = parts[0] + (parts.length > 1 ? ` ${parts[parts.length - 1].charAt(0)}.` : "")
        }
    }

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
            <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100">

                <div className="bg-gradient-to-br from-yellow-400 via-yellow-500 to-amber-600 p-8 text-center relative overflow-hidden">
                    {/* Decorative rings */}
                    <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 rounded-full border-4 border-white/20"></div>
                    <div className="absolute bottom-0 left-0 -ml-8 -mb-8 w-24 h-24 rounded-full border-4 border-white/20"></div>

                    <div className="w-20 h-20 mx-auto bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center shadow-inner mb-4">
                        <Trophy className="w-10 h-10 text-white" />
                    </div>

                    <h1 className="text-3xl font-black text-white tracking-tight drop-shadow-md leading-tight">
                        Resultado Oficial
                    </h1>
                    <p className="text-yellow-50 font-medium mt-2">{rifa.title}</p>
                </div>

                <div className="p-8 text-center space-y-6">

                    {rifa.status === "DRAWN" ? (
                        <div className="animate-in slide-in-from-bottom-4 duration-700 fade-in">
                            <div className="text-sm font-bold tracking-widest text-gray-400 uppercase mb-2">Cota Premiada</div>
                            <div className="text-6xl font-black text-gray-900 tracking-tighter mb-6">
                                {rifa.winnerNumber?.toString().padStart(2, '0')}
                            </div>

                            <div className="flex flex-col gap-3">
                                <div className="flex items-center justify-center gap-2 text-gray-700 bg-gray-50 py-3 px-4 rounded-xl border border-gray-100">
                                    <User className="w-5 h-5 text-gray-400" />
                                    <span className="font-semibold text-lg">{winnerName || "Vencedor"}</span>
                                </div>

                                {rifa.drawnAt && (
                                    <div className="flex items-center justify-center gap-2 text-gray-500 text-sm">
                                        <Calendar className="w-4 h-4" />
                                        <span>Premiado em {new Date(rifa.drawnAt).toLocaleDateString("pt-BR")} as {new Date(rifa.drawnAt).toLocaleTimeString("pt-BR", { hour: '2-digit', minute: '2-digit' })}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    ) : (
                        <div className="py-8">
                            <div className="text-6xl mb-4 text-gray-200">⏳</div>
                            <h3 className="text-xl font-bold text-gray-700 mb-2">Aguardando Resultado</h3>
                            <p className="text-gray-500">O vencedor ainda não foi definido para esta campanha. Fique ligado!</p>
                        </div>
                    )}

                    <div className="pt-6 border-t border-gray-100">
                        <Link
                            href={`/r/${rifa.slug}`}
                            className="inline-flex flex-col items-center justify-center text-sm font-semibold text-gray-500 hover:text-primary transition-colors gap-1 group"
                        >
                            <div className="p-2 rounded-full bg-gray-50 group-hover:bg-primary/10 transition-colors">
                                <ArrowLeft className="w-5 h-5" />
                            </div>
                            <span>Voltar para a página da rifa</span>
                        </Link>
                    </div>

                </div>
            </div>

            <div className="mt-8 text-center text-xs text-gray-400 font-medium">
                Desenvolvido por MyRifa &copy; {new Date().getFullYear()}
            </div>
        </div>
    )
}
