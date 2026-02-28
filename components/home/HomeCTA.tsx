import Link from "next/link"
import { Trophy, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"

export function HomeCTA() {
    return (
        <section className="py-24 px-6">
            <div className="max-w-7xl mx-auto bg-gradient-to-br from-primary to-purple-800 rounded-[3rem] p-12 md:p-24 text-center text-white relative overflow-hidden shadow-2xl shadow-primary/20">
                <div className="relative z-10 space-y-8">
                    <h2 className="text-4xl md:text-6xl font-black tracking-tight leading-none">Pronto para acelerar seu projeto?</h2>
                    <p className="max-w-xl mx-auto text-white/70 font-medium text-lg md:text-xl leading-relaxed">Milhares de organizadores já utilizam a tecnologia MyRifa para viabilizar causas e sonhos comunitários.</p>
                    <Button asChild size="lg" className="bg-white text-primary hover:bg-slate-100 h-16 px-12 rounded-2xl text-sm font-black uppercase tracking-widest shadow-xl active:scale-95 transition-all">
                        <Link href="/register">Lançar meu projeto agora</Link>
                    </Button>
                </div>

                {/* Decorative elements */}
                <div className="absolute top-0 right-0 p-12 opacity-10">
                    <Trophy className="size-64 rotate-12" />
                </div>
                <div className="absolute top-1/2 left-0 -translate-y-1/2 p-12 opacity-10">
                    <CheckCircle2 className="size-48 -rotate-12" />
                </div>
            </div>
        </section>
    )
}
