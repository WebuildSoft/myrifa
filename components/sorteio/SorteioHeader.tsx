import Link from "next/link"
import { Star, UserCircle2 } from "lucide-react"

interface SorteioHeaderProps {
    rifaId: string
}

export function SorteioHeader({ rifaId }: SorteioHeaderProps) {
    return (
        <header className="absolute top-0 w-full flex items-center justify-between px-6 md:px-10 py-6 z-50 bg-transparent">
            <Link href={`/dashboard/rifas/${rifaId}`} className="flex items-center gap-4 text-white hover:opacity-80 transition-opacity">
                <div className="text-amber-400">
                    <Star className="h-8 w-8 fill-amber-400" />
                </div>
                <div className="flex flex-col">
                    <h2 className="text-white text-xl md:text-2xl font-black tracking-tighter leading-none">MyRifa</h2>
                    <span className="text-[10px] text-white/40 uppercase tracking-[0.3em] font-bold">Resultado Certificado</span>
                </div>
            </Link>

            <div className="flex items-center gap-4">
                <div className="flex flex-col items-end">
                    <span className="text-white/40 text-[10px] uppercase tracking-widest font-black">Status do Canal</span>
                    <div className="flex items-center gap-2">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-400"></span>
                        </span>
                        <span className="text-amber-400 text-xs font-black uppercase tracking-widest">AO VIVO</span>
                    </div>
                </div>
                <div className="bg-white/10 backdrop-blur-xl px-4 py-2 rounded-full border border-white/10 flex items-center gap-2">
                    <UserCircle2 className="h-5 w-5 text-primary" />
                    <span className="text-white text-xs font-bold">Admin</span>
                </div>
            </div>
        </header>
    )
}
