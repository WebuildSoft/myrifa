import Link from "next/link"
import { Ticket, Search, Filter } from "lucide-react"
import { Button } from "@/components/ui/button"

export function RifaSearchNav() {
    return (
        <nav className="fixed top-0 w-full z-50 bg-white/70 dark:bg-[#0f0a19]/70 backdrop-blur-xl border-b border-primary/5 px-6 md:px-12 py-4">
            <div className="max-w-7xl mx-auto flex items-center justify-between">
                <Link href="/" className="flex items-center gap-2 group">
                    <Ticket className="text-primary h-7 w-7 rotate-12 group-hover:scale-110 transition-transform" />
                    <span className="text-xl font-black tracking-tight text-slate-900 dark:text-white">
                        My<span className="text-primary">Rifa</span>
                    </span>
                </Link>

                <div className="hidden md:flex items-center gap-4 bg-slate-50 dark:bg-slate-900 px-4 py-2 rounded-2xl border border-primary/5">
                    <Search className="h-4 w-4 text-slate-400" />
                    <input
                        placeholder="Buscar sorteios..."
                        className="bg-transparent border-none outline-none text-sm font-medium w-64 placeholder:text-slate-400 dark:text-white"
                    />
                </div>

                <div className="flex items-center gap-3">
                    <Link href="/minhas-cotas" className="hidden sm:block">
                        <Button variant="ghost" className="text-[11px] font-black uppercase tracking-widest rounded-full">
                            Minhas Cotas
                        </Button>
                    </Link>
                    <Link href="/login">
                        <Button className="bg-primary hover:bg-primary/90 text-white shadow-xl shadow-primary/20 px-6 rounded-full text-[11px] font-black uppercase tracking-widest active:scale-95 transition-all">
                            Criar Rifa
                        </Button>
                    </Link>
                </div>
            </div>
        </nav>
    )
}
