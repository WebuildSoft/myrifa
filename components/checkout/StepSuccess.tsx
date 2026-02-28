import Link from "next/link"
import { CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"

interface StepSuccessProps {
    numbers: number[]
    rifaSlug: string
}

export function StepSuccess({ numbers, rifaSlug }: StepSuccessProps) {
    return (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm p-12 flex flex-col items-center text-center space-y-6">
            <div className="w-24 h-24 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                <CheckCircle2 className="w-12 h-12 text-emerald-500" />
            </div>
            <div>
                <h2 className="text-4xl font-black text-slate-900 dark:text-white">Pagamento Confirmado!</h2>
                <p className="text-slate-500 mt-2 max-w-md mx-auto">
                    Sua compra de <strong>{numbers.length} número{numbers.length > 1 ? "s" : ""}</strong> foi recebida. A confirmação foi enviada para o seu WhatsApp. Boa sorte! 🍀
                </p>
            </div>
            <div className="flex flex-wrap justify-center gap-2">
                {numbers.slice(0, 12).map(n => (
                    <span key={n} className="bg-primary/10 text-primary px-3 py-1 rounded-full font-black text-sm">
                        {String(n).padStart(3, "0")}
                    </span>
                ))}
                {numbers.length > 12 && (
                    <span className="bg-slate-100 text-slate-500 px-3 py-1 rounded-full font-bold text-sm">+{numbers.length - 12} mais</span>
                )}
            </div>
            <Button asChild size="lg" className="h-13 px-10 rounded-xl font-black">
                <Link href={`/r/${rifaSlug}`}>Voltar ao Sorteio</Link>
            </Button>
        </div>
    )
}
