"use client"

import Link from "next/link"
import { Ticket } from "lucide-react"

export function PublicFooter() {
    return (
        <footer className="mt-8 border-t border-slate-200 dark:border-slate-800 py-12 bg-white dark:bg-[#171121]">
            <div className="mx-auto max-w-[1400px] px-6 text-center">
                <div className="flex items-center justify-center gap-3 mb-6 opacity-40">
                    <Ticket className="w-6 h-6 text-primary" />
                    <h2 className="text-lg font-black tracking-tight text-slate-900 dark:text-white">MyRifa</h2>
                </div>
                <p className="text-sm text-slate-400 max-w-[600px] mx-auto mb-6 font-medium leading-relaxed">
                    Apoiar causas sociais e campanhas é uma forma de gerar impacto positivo. Contribuímos para a transparência e segurança em todas as etapas.
                </p>
                <div className="flex flex-wrap justify-center gap-8 mb-8 text-slate-400">
                    <Link href="/termos" className="hover:text-primary transition-colors text-xs font-black uppercase tracking-widest">Termos de Uso</Link>
                    <Link href="/privacidade" className="hover:text-primary transition-colors text-xs font-black uppercase tracking-widest">Privacidade</Link>
                    <Link href="/ajuda" className="hover:text-primary transition-colors text-xs font-black uppercase tracking-widest">FAQ</Link>
                    <Link href="/ajuda" className="hover:text-primary transition-colors text-xs font-black uppercase tracking-widest">Suporte</Link>
                </div>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">© 2024 MyRifa Intermediações. Todos os direitos reservados.</p>
            </div>
        </footer>
    )
}
