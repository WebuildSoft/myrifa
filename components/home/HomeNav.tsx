"use client"

import { useState } from "react"
import Link from "next/link"
import { Star, Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export function HomeNav() {
    const [isOpen, setIsOpen] = useState(false)

    const navLinks = [
        { name: "A Plataforma", href: "/sobre" },
        { name: "Campanhas", href: "/rifas" },
        { name: "Soluções", href: "/planos" },
        { name: "Suporte", href: "/ajuda" },
    ]

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

                {/* Desktop Nav */}
                <div className="hidden md:flex items-center gap-8 text-[11px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400">
                    {navLinks.map((link) => (
                        <Link key={link.name} href={link.href} className="hover:text-primary transition-colors">
                            {link.name}
                        </Link>
                    ))}
                </div>

                <div className="flex items-center gap-3">
                    <Button variant="ghost" asChild className="hidden md:flex text-[11px] font-black uppercase tracking-widest rounded-full">
                        <Link href="/login">Entrar</Link>
                    </Button>
                    <Button asChild className="bg-primary hover:bg-primary/90 text-white shadow-xl shadow-primary/20 px-6 rounded-full text-[11px] font-black uppercase tracking-widest active:scale-95 transition-all">
                        <Link href="/register">Lançar Campanha</Link>
                    </Button>

                    {/* Mobile Menu Toggle */}
                    <button
                        className="md:hidden p-2 text-slate-600 dark:text-slate-300"
                        onClick={() => setIsOpen(!isOpen)}
                    >
                        {isOpen ? <X className="size-6" /> : <Menu className="size-6" />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu Overlay */}
            <div className={cn(
                "fixed inset-x-0 top-[73px] bg-white dark:bg-[#0f0a19] border-b border-primary/5 p-6 md:hidden transition-all duration-300 ease-in-out shadow-xl",
                isOpen ? "translate-y-0 opacity-100 pointer-events-auto" : "-translate-y-10 opacity-0 pointer-events-none"
            )}>
                <div className="flex flex-col gap-6">
                    {navLinks.map((link) => (
                        <Link
                            key={link.name}
                            href={link.href}
                            className="text-sm font-bold uppercase tracking-widest text-slate-600 dark:text-slate-300 hover:text-primary transition-colors"
                            onClick={() => setIsOpen(false)}
                        >
                            {link.name}
                        </Link>
                    ))}
                    <hr className="border-primary/5" />
                    <Button variant="outline" asChild className="w-full text-[11px] font-black uppercase tracking-widest rounded-xl h-12">
                        <Link href="/login" onClick={() => setIsOpen(false)}>Entrar na Conta</Link>
                    </Button>
                </div>
            </div>
        </nav>
    )
}
