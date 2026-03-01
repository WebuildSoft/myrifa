"use client"

import { useState } from "react"
import { Ticket, ChevronDown, ChevronUp, Copy, CheckCircle2, Clock, AlertCircle, TicketCheck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import Image from "next/image"
import Link from "next/link"
import { toast } from "sonner"

interface OrderCardProps {
    transaction: any // In a real app we'd type this properly from Prisma
}

export function OrderCard({ transaction }: OrderCardProps) {
    const [isExpanded, setIsExpanded] = useState(false)
    const { rifa, numbers, status, createdAt, amount, id } = transaction

    const isPaid = status === "PAID"
    const isPending = status === "PENDING"
    const isFinished = rifa.status === "DRAWN" || rifa.status === "CLOSED"

    const copyNumbers = () => {
        const nums = numbers.map((n: any) => n.number.toString().padStart(6, '0')).join(', ')
        navigator.clipboard.writeText(nums).then(() => {
            toast.success("Números copiados!", {
                description: "Boa sorte no sorteio."
            })
        })
    }

    return (
        <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm transition-all hover:shadow-md">
            {/* Header / Info */}
            <div className="p-6">
                <div className="flex gap-4">
                    {/* Image Thumbnail */}
                    <div className="relative w-24 h-24 rounded-2xl overflow-hidden shrink-0 border border-slate-100 dark:border-slate-700">
                        {rifa.coverImage ? (
                            <Image
                                src={rifa.coverImage}
                                alt={rifa.title}
                                fill
                                className="object-cover"
                            />
                        ) : (
                            <div className="w-full h-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                                <Ticket className="w-8 h-8 text-slate-400" />
                            </div>
                        )}

                        {/* Status Overlay */}
                        <div className="absolute top-2 left-2 flex gap-1">
                            {isPaid ? (
                                <span className="bg-emerald-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm">
                                    Pago
                                </span>
                            ) : isPending ? (
                                <span className="bg-amber-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm">
                                    Pendente
                                </span>
                            ) : (
                                <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm">
                                    Cancelado
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Details */}
                    <div className="flex-1 flex flex-col justify-between py-1">
                        <div>
                            <h3 className="font-bold text-slate-900 dark:text-white leading-tight line-clamp-2">
                                {rifa.title}
                            </h3>
                            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                                {numbers.length} {numbers.length === 1 ? 'cota' : 'cotas'} • R$ {Number(amount).toFixed(2).replace('.', ',')}
                            </p>
                        </div>
                        <p className="text-xs text-slate-400 dark:text-slate-500">
                            Comprado em {new Intl.DateTimeFormat('pt-BR', { dateStyle: 'short', timeStyle: 'short' }).format(new Date(createdAt))}
                        </p>
                    </div>
                </div>

                {/* Actions */}
                <div className="mt-6 pt-6 border-t border-slate-100 dark:border-slate-700/50">
                    {isPending && !isFinished && (
                        <div className="flex gap-3">
                            <Button asChild className="w-full bg-primary hover:bg-primary/90 text-white font-bold rounded-xl h-12 shadow-sm">
                                <Link href={`/checkout/pedido/${transaction.id}`}>
                                    Pagar Agora
                                </Link>
                            </Button>
                        </div>
                    )}

                    {isFinished && isPaid && (
                        <div className="flex gap-3">
                            <Button asChild variant="outline" className="w-full border-primary/20 text-primary hover:bg-primary/5 font-bold rounded-xl h-12">
                                <Link href={`/r/${rifa.slug}/resultado`}>
                                    Ver Resultado
                                </Link>
                            </Button>
                        </div>
                    )}

                    {isPaid && (
                        <Button
                            variant="ghost"
                            onClick={() => setIsExpanded(!isExpanded)}
                            className="w-full flex items-center justify-between mt-2 h-12 rounded-xl text-slate-600 dark:text-slate-300 font-medium hover:bg-slate-50 dark:hover:bg-slate-700/50"
                        >
                            <span className="flex items-center gap-2">
                                <TicketCheck className="h-5 w-5 text-emerald-500" />
                                Meus Números da Sorte
                            </span>
                            {isExpanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                        </Button>
                    )}

                    {isPending && isFinished && (
                        <div className="flex items-center gap-2 text-amber-600 dark:text-amber-500 text-sm font-medium bg-amber-50 dark:bg-amber-950/30 p-3 rounded-xl">
                            <AlertCircle className="h-4 w-4" />
                            Sorteio já realizado. Pagamento não confirmado.
                        </div>
                    )}
                </div>
            </div>

            {/* Expanded Numbers List */}
            {isExpanded && isPaid && (
                <div className="bg-slate-50 dark:bg-slate-800/50 p-6 border-t border-slate-200 dark:border-slate-700">
                    <div className="flex items-center justify-between mb-4">
                        <span className="text-sm font-bold text-slate-700 dark:text-slate-300">
                            {numbers.length} números reservados
                        </span>
                        <Button variant="ghost" size="sm" onClick={copyNumbers} className="h-8 text-xs text-primary hover:bg-primary/10">
                            <Copy className="h-3 w-3 mr-2" /> Copiar Todos
                        </Button>
                    </div>

                    <div className="flex flex-wrap gap-2">
                        {numbers.map((n: any, idx: number) => (
                            <div
                                key={idx}
                                className="px-3 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-black text-slate-700 dark:text-slate-200 tabular-nums shadow-sm"
                            >
                                {n.number.toString().padStart(6, '0')}
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}
