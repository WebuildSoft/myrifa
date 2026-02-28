import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"
import Link from "next/link"

export function DashboardCTA() {
    return (
        <div className="relative overflow-hidden bg-primary rounded-3xl p-8 md:p-12 text-primary-foreground shadow-xl shadow-primary/20 group">
            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                <div className="max-w-xl text-center md:text-left">
                    <h2 className="text-3xl font-extrabold mb-4 tracking-tight leading-tight">Pronto para sua próxima campanha de sucesso?</h2>
                    <p className="text-primary-foreground/90 font-medium text-lg leading-relaxed max-w-lg">Crie campanhas profissionais em minutos, gerencie apoios e automatize o reconhecimento. Tudo em um só lugar.</p>
                </div>
                <Button asChild className="whitespace-nowrap h-14 px-8 bg-white text-primary hover:bg-slate-50 font-bold rounded-2xl shadow-lg border-none hover:scale-105 transition-all duration-300">
                    <Link href="/dashboard/rifas/nova" className="flex items-center gap-2">
                        <PlusCircle className="h-5 w-5" />
                        Lançar Campanha
                    </Link>
                </Button>
            </div>
            {/* Abstract Background Decorations */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-20 -mt-20 blur-3xl group-hover:scale-110 transition-transform duration-700"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-black/10 rounded-full -ml-10 -mb-10 blur-2xl"></div>
        </div>
    )
}
