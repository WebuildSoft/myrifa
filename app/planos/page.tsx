import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Star } from "lucide-react"
import { PricingSection } from "@/components/PricingSection"

export default function PublicPlanosPage() {
    return (
        <div className="min-h-screen bg-[#fcfcfd] dark:bg-[#0f0a19] text-slate-900 dark:text-slate-100 font-sans">
            {/* Header / Nav */}
            <nav className="fixed top-0 w-full z-50 bg-white/70 dark:bg-[#0f0a19]/70 backdrop-blur-xl border-b border-primary/5 px-6 md:px-12 py-4">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-2 group">
                        <Button variant="ghost" size="icon" className="rounded-full mr-2">
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                        <span className="text-xl font-black tracking-tighter uppercase italic">
                            Rifa<span className="text-primary">Online</span>
                        </span>
                    </Link>
                    <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full border border-primary/20">
                        <Star className="h-3 w-3 fill-primary text-primary" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-primary">Melhor Custo Benefício</span>
                    </div>
                </div>
            </nav>

            <main className="pt-20">
                <PricingSection
                    title="O Plano de Carreira para sua Organização"
                    subtitle="De sorteios casuais a operações profissionais de larga escala, temos a tecnologia para te fazer crescer."
                />

                {/* Additional Info Section */}
                <section className="pb-24 px-6">
                    <div className="max-w-4xl mx-auto bg-white dark:bg-slate-800/50 p-12 rounded-[3rem] border border-primary/5 text-center space-y-6 shadow-sm">
                        <h3 className="text-2xl font-black dark:text-white leading-tight">Precisa de algo sob medida?</h3>
                        <p className="text-slate-500 dark:text-slate-400 font-medium max-w-sm mx-auto">
                            Se você é uma grande ONG ou influenciador com milhões de seguidores, temos condições especiais.
                        </p>
                        <Button asChild variant="outline" className="border-primary/20 text-primary hover:bg-primary/5 h-12 px-8 rounded-xl font-black text-[11px] uppercase tracking-widest">
                            <Link href="/ajuda">Falar com nosso time</Link>
                        </Button>
                    </div>
                </section>
            </main>

            {/* Simple Footer */}
            <footer className="py-12 border-t border-primary/5 text-center px-6">
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                    © 2024 RifaOnline • Transparência e Honestidade nos Preços
                </p>
            </footer>
        </div>
    )
}
