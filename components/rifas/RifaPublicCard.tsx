import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Trophy, ArrowRight } from "lucide-react"

interface RifaPublicCardProps {
    rifa: {
        id: string
        slug: string
        title: string
        coverImage: string | null
        category: string
        numberPrice: any
        totalNumbers: number
        _count: { numbers: number }
    }
}

const categoryLabels: Record<string, string> = {
    SORTEIO: "Sorteio",
    ARRECADACAO: "Solidária",
    VIAGEM: "Viagem",
    MISSAO: "Missão",
    SAUDE: "Saúde",
    ESPORTE: "Esporte",
    OUTRO: "Outro",
}

export function RifaPublicCard({ rifa }: RifaPublicCardProps) {
    const progress = Math.round((rifa._count.numbers / rifa.totalNumbers) * 100)
    const formattedPrice = new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL"
    }).format(Number(rifa.numberPrice))

    return (
        <Link href={`/r/${rifa.slug}`} className="group block">
            <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] overflow-hidden border border-primary/5 hover:border-primary/20 hover:shadow-2xl hover:shadow-primary/5 transition-all duration-500 group-hover:-translate-y-2">
                <div className="h-64 overflow-hidden relative">
                    <div className="absolute top-6 left-6 z-10">
                        <Badge className="bg-white shadow-xl text-primary text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-full border-none">
                            {categoryLabels[rifa.category] ?? rifa.category}
                        </Badge>
                    </div>
                    <img
                        src={rifa.coverImage || "https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?q=80&w=800&auto=format&fit=crop"}
                        alt={rifa.title}
                        className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                    <div className="absolute bottom-6 right-6 font-black text-white text-2xl drop-shadow-lg">
                        {formattedPrice}
                    </div>
                </div>

                <div className="p-8 space-y-6">
                    <div className="space-y-3">
                        <h3 className="text-xl font-black line-clamp-2 leading-tight dark:text-white group-hover:text-primary transition-colors">
                            {rifa.title}
                        </h3>
                        <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-primary rounded-full transition-all duration-1000 ease-out shadow-[0_0_8px_rgba(124,59,237,0.4)]"
                                style={{ width: `${progress}%` }}
                            ></div>
                        </div>
                    </div>

                    <div className="flex justify-between items-center pt-6 border-t border-slate-50 dark:border-slate-800">
                        <div className="flex items-center gap-2">
                            <div className="size-8 bg-primary/10 rounded-lg flex items-center justify-center text-primary">
                                <Trophy className="h-4 w-4" />
                            </div>
                            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Garantido</span>
                        </div>
                        <div className="flex items-center gap-2 text-primary font-black text-[11px] uppercase tracking-widest">
                            Participar <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    )
}
