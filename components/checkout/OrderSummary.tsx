import Image from "next/image"
import { Sparkles, Ticket, Shield, Lock } from "lucide-react"

interface OrderSummaryProps {
    rifaTitle: string
    rifaCover: string | null
    numbers: number[]
    price: number
}

export function OrderSummary({ rifaTitle, rifaCover, numbers, price }: OrderSummaryProps) {
    const total = numbers.length * price
    const formattedTotal = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(total)
    const pricePerNumber = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(price)

    return (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden">
            <div className="w-full h-48 relative overflow-hidden">
                {rifaCover ? (
                    <Image src={rifaCover} alt={rifaTitle} fill className="object-cover" />
                ) : (
                    <div className="w-full h-full bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center">
                        <Sparkles className="w-12 h-12 text-white/30" />
                    </div>
                )}
            </div>

            <div className="p-6">
                <p className="text-[10px] font-black text-primary uppercase tracking-widest mb-1">Você está concorrendo a</p>
                <h3 className="text-xl font-black text-slate-900 dark:text-white leading-tight mb-6">{rifaTitle}</h3>

                <div className="space-y-4 border-t border-slate-100 dark:border-slate-800 pt-6">
                    <div className="flex justify-between items-center text-sm">
                        <span className="text-slate-500">Quantidade</span>
                        <span className="font-bold">{numbers.length} número{numbers.length > 1 ? "s" : ""} selecionados</span>
                    </div>

                    <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-xl">
                        <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-3 flex items-center gap-1.5">
                            <Ticket className="w-3 h-3" /> Seus números
                        </p>
                        <div className="flex flex-wrap gap-1.5">
                            {numbers.slice(0, 12).map(n => (
                                <span key={n} className="bg-primary/10 text-primary px-2.5 py-0.5 rounded-full font-black text-xs">
                                    {String(n).padStart(3, "0")}
                                </span>
                            ))}
                            {numbers.length > 12 && (
                                <span className="bg-slate-200 text-slate-500 px-2.5 py-0.5 rounded-full font-bold text-xs">
                                    +{numbers.length - 12}
                                </span>
                            )}
                        </div>
                    </div>

                    <div className="flex justify-between items-center text-sm">
                        <span className="text-slate-500">Valor por número</span>
                        <span className="font-bold">{pricePerNumber}</span>
                    </div>

                    <div className="flex justify-between items-center pt-4 border-t border-slate-100 dark:border-slate-800">
                        <span className="text-lg font-black text-slate-900 dark:text-white">Total</span>
                        <span className="text-2xl font-black text-emerald-600">{formattedTotal}</span>
                    </div>
                </div>

                <div className="mt-6 p-4 bg-primary/5 rounded-xl flex items-start gap-3">
                    <Shield className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                    <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                        Ao finalizar a compra, você concorda com os <strong>Termos de Uso</strong> e as regras deste sorteio. Seus dados estão protegidos.
                    </p>
                </div>

                <div className="grid grid-cols-2 gap-3 mt-4">
                    <div className="flex flex-col items-center p-3 bg-white dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700">
                        <Shield className="w-5 h-5 text-primary mb-1" />
                        <span className="text-[10px] font-bold text-slate-400 uppercase">Site Seguro</span>
                    </div>
                    <div className="flex flex-col items-center p-3 bg-white dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700">
                        <Lock className="w-5 h-5 text-primary mb-1" />
                        <span className="text-[10px] font-bold text-slate-400 uppercase">Suporte 24/7</span>
                    </div>
                </div>
            </div>
        </div>
    )
}
