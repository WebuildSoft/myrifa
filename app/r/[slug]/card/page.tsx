import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"
import { Trophy, QrCode as QrIcon } from "lucide-react"
import Image from "next/image"

export default async function StoryCardPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params
    const rifa = await prisma.rifa.findUnique({
        where: { slug },
        include: {
            _count: {
                select: { numbers: { where: { status: "PAID" } } }
            }
        }
    })

    if (!rifa || rifa.isPrivate) notFound()

    const progress = Math.round((rifa._count.numbers / rifa.totalNumbers) * 100)
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
    const url = `${appUrl}/r/${rifa.slug}`
    const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(url)}`

    return (
        <div className="min-h-screen bg-black flex items-center justify-center p-0 sm:p-4">
            {/* 9:16 Aspect Ratio Container */}
            <div className="relative w-full max-w-[450px] aspect-[9/16] bg-gradient-to-b from-violet-900 via-indigo-900 to-black overflow-hidden shadow-2xl flex flex-col">

                {/* Decorative elements */}
                <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[30%] bg-violet-500/20 blur-[100px] rounded-full"></div>
                <div className="absolute bottom-[10%] right-[-10%] w-[60%] h-[40%] bg-indigo-500/10 blur-[120px] rounded-full"></div>

                <div className="relative z-10 flex-1 flex flex-col p-8 pt-16">

                    <div className="flex flex-col items-center gap-4 mb-8">
                        <div className="w-20 h-20 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20 shadow-xl">
                            <Trophy className="w-10 h-10 text-yellow-400" />
                        </div>
                        <div className="text-center">
                            <p className="text-violet-300 font-bold tracking-[0.2em] text-xs uppercase mb-1">Grande Oportunidade</p>
                            <h1 className="text-white text-3xl font-black leading-tight uppercase tracking-tighter">
                                {rifa.title}
                            </h1>
                        </div>
                    </div>

                    <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-3xl p-6 flex flex-col items-center gap-6 shadow-2xl">
                        <div className="text-center">
                            <p className="text-gray-400 text-sm font-medium mb-1">Participe agora por apenas</p>
                            <p className="text-4xl font-black text-white">
                                {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(Number(rifa.numberPrice))}
                            </p>
                        </div>

                        <div className="w-full space-y-2">
                            <div className="flex justify-between text-xs font-bold text-gray-400 px-1 italic">
                                <span>PROGRESSO</span>
                                <span>{progress}%</span>
                            </div>
                            <div className="w-full h-4 bg-white/10 rounded-full overflow-hidden border border-white/5 p-1">
                                <div
                                    className="h-full bg-gradient-to-r from-violet-400 to-indigo-400 rounded-full transition-all duration-1000"
                                    style={{ width: `${progress}%` }}
                                ></div>
                            </div>
                            <p className="text-[10px] text-center text-gray-500 font-bold uppercase tracking-widest mt-2">
                                Restam poucos números disponíveis!
                            </p>
                        </div>

                        <div className="w-48 h-48 p-3 bg-white rounded-2xl shadow-xl border-4 border-violet-500/30">
                            <Image
                                src={qrCodeUrl}
                                alt="QR Code"
                                width={200}
                                height={200}
                                className="w-full h-full object-contain"
                            />
                        </div>

                        <div className="text-center">
                            <p className="text-white font-bold text-sm mb-1 uppercase tracking-tighter">Aponte a câmera para participar</p>
                            <p className="text-violet-300 text-[10px] font-medium break-all">{url.replace('https://', '')}</p>
                        </div>
                    </div>

                    <div className="mt-auto pb-8 text-center">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/5">
                            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                            <span className="text-white text-[10px] font-bold tracking-widest uppercase">Sistema 100% Seguro</span>
                        </div>
                    </div>

                </div>

            </div>

            {/* Floating suggestion for the user */}
            <div className="hidden lg:block fixed right-8 top-1/2 -translate-y-1/2 max-w-xs text-white/50 bg-white/5 p-6 rounded-2xl border border-white/10 backdrop-blur-md">
                <h4 className="text-white font-bold mb-2">Dica Pro ✨</h4>
                <p className="text-sm">Tire um print desta tela no seu celular para compartilhar diretamente nos seus Stories!</p>
            </div>
        </div>
    )
}
