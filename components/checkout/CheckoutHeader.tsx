import Link from "next/link"
import { Ticket, Lock } from "lucide-react"

export function CheckoutHeader() {
    return (
        <header className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-100 dark:border-slate-800 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
                <Link href="/" className="flex items-center gap-2 group">
                    <Ticket className="w-6 h-6 text-primary rotate-12 group-hover:scale-110 transition-transform" />
                    <span className="text-lg font-black tracking-tight text-slate-900 dark:text-white">My<span className="text-primary">Rifa</span></span>
                </Link>
                <nav className="hidden md:flex items-center gap-6 text-sm text-slate-500">
                    <Link href="/rifas" className="hover:text-primary transition-colors">Sorteios</Link>
                    <Link href="#" className="hover:text-primary transition-colors">Ajuda</Link>
                </nav>
                <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider">
                    <Lock className="w-3.5 h-3.5 text-emerald-500" />
                    Pagamento Seguro
                </div>
            </div>
        </header>
    )
}
