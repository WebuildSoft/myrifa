import Link from "next/link"
import { Star } from "lucide-react"
import { Button } from "@/components/ui/button"

export function HomeNav() {
    return (
        <nav className="fixed top-0 w-full z-50 bg-white/70 dark:bg-[#0f0a19]/70 backdrop-blur-xl border-b border-primary/5 px-6 md:px-12 py-4">
            <div className="max-w-7xl mx-auto flex items-center justify-between">
                <Link href="/" className="flex items-center gap-2 group">
                    <div className="size-10 bg-gradient-to-br from-primary to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-primary/20 group-hover:rotate-6 transition-transform">
                        <Star className="text-white h-6 w-6 fill-white" />
                    </div>
                    <span className="text-xl font-black tracking-tighter uppercase italic dark:text-white">
                        My<span className="text-primary">Rifa</span>
                    </span>
                </Link>

                <div className="hidden md:flex items-center gap-8 text-[11px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400">
                    <Link href="/sobre" className="hover:text-primary transition-colors">A Plataforma</Link>
                    <Link href="/rifas" className="hover:text-primary transition-colors">Campanhas</Link>
                    <Link href="/planos" className="hover:text-primary transition-colors">Soluções</Link>
                    <Link href="/ajuda" className="hover:text-primary transition-colors">Suporte</Link>
                </div>

                <div className="flex items-center gap-3">
                    <Button variant="ghost" asChild className="hidden sm:flex text-[11px] font-black uppercase tracking-widest rounded-full">
                        <Link href="/login">Entrar</Link>
                    </Button>
                    <Button asChild className="bg-primary hover:bg-primary/90 text-white shadow-xl shadow-primary/20 px-6 rounded-full text-[11px] font-black uppercase tracking-widest active:scale-95 transition-all">
                        <Link href="/register">Lançar Campanha</Link>
                    </Button>
                </div>
            </div>
        </nav>
    )
}
