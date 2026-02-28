import Link from "next/link"
import { Ticket, Lock } from "lucide-react"

export function CheckoutHeader() {
    return (
        <header className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-100 dark:border-slate-800 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
                <Link href="/" className="flex items-center gap-2 font-black text-primary text-lg">
                    <div className="bg-primary p-1.5 rounded-lg text-white">
                        <Ticket className="w-5 h-5" />
                    </div>
                    MyRifa
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
