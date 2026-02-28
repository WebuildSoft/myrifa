"use client"

import Link from "next/link"
import { Ticket } from "lucide-react"

export function PublicHeader() {
    return (
        <header className="sticky top-0 z-50 w-full border-b border-primary/10 bg-white/80 dark:bg-[#171121]/80 backdrop-blur-md">
            <div className="mx-auto flex max-w-[1400px] items-center justify-between px-4 md:px-6 py-4">
                <Link href="/" className="flex items-center gap-3 group">
                    <div className="text-primary transition-transform group-hover:scale-110">
                        <Ticket className="w-8 h-8 rotate-12" />
                    </div>
                    <h2 className="text-xl font-black tracking-tight text-slate-900 dark:text-white">MyRifa</h2>
                </Link>
                <nav className="hidden md:flex items-center gap-8">
                    <Link href="/campanhas" className="text-sm font-bold hover:text-primary transition-colors">Campanhas</Link>
                    <Link href="/vencedores" className="text-sm font-bold hover:text-primary transition-colors">Vencedores</Link>
                    <Link href="/ajuda" className="text-sm font-bold hover:text-primary transition-colors">Como Funciona</Link>
                    <Link href="/minhas-cotas">
                        <button className="inline-flex items-center justify-center bg-primary text-white px-6 py-2.5 rounded-full text-sm font-black shadow-lg shadow-primary/20 hover:scale-105 transition-transform h-auto">
                            Minhas Cotas
                        </button>
                    </Link>
                </nav>
            </div>
        </header>
    )
}
