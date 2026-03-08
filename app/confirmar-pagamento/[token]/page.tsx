import { prisma } from "@/lib/prisma"
import { confirmPaymentWithTokenAction } from "@/actions/confirm-payment"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2, AlertCircle, Calendar, User, Smartphone, Info } from "lucide-react"
import Link from "next/link"
import { redirect } from "next/navigation"

export const metadata = {
    title: "Confirmar Pagamento | MyRifa",
    description: "Confirmação rápida de pagamento via link mágico."
}

export default async function Page({
    params,
    searchParams
}: {
    params: Promise<{ token: string }>
    searchParams: Promise<{ success?: string }>
}) {
    const { token } = await params
    const { success } = await searchParams
    const isSuccess = success === "true"

    let transaction = null;
    try {
        transaction = await prisma.transaction.findUnique({
            where: { confirmationToken: token },
            include: {
                rifa: true,
                buyer: true
            }
        })
    } catch (error: any) {
        console.error(`[MAGIC_LINK] Error fetching transaction for token ${token}:`, error);
    }

    if (!transaction || !transaction.rifa || !transaction.buyer) {
        if (isSuccess) {
            return (
                <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-4">
                    <Card className="max-w-md w-full border-slate-200 dark:border-slate-800 shadow-2xl">
                        <CardHeader className="text-center pb-2">
                            <div className="mx-auto mb-4 bg-emerald-100 dark:bg-emerald-900/30 p-3 rounded-full w-fit">
                                <CheckCircle2 className="h-8 w-8 text-emerald-600 dark:text-emerald-400" />
                            </div>
                            <CardTitle className="text-2xl font-black text-slate-900 dark:text-white">Pagamento Confirmado!</CardTitle>
                            <CardDescription>
                                O recebimento foi validado com sucesso e o comprador já foi notificado.
                            </CardDescription>
                        </CardHeader>
                        <CardFooter className="flex justify-center flex-col gap-4">
                            <Button asChild className="w-full rounded-xl bg-slate-900 dark:bg-emerald-600 text-white font-black">
                                <Link href="/dashboard">Ir para o Painel</Link>
                            </Button>
                        </CardFooter>
                    </Card>
                </div>
            )
        }

        console.warn(`[MAGIC_LINK] Transaction check failed for token ${token}:`, {
            found: !!transaction,
            hasRifa: !!transaction?.rifa,
            hasBuyer: !!transaction?.buyer
        });
        return (
            <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-4">
                <Card className="max-w-md w-full border-slate-200 dark:border-slate-800 shadow-2xl">
                    <CardHeader className="text-center pb-2">
                        <div className="mx-auto mb-4 bg-red-100 dark:bg-red-900/30 p-3 rounded-full w-fit">
                            <AlertCircle className="h-8 w-8 text-red-600 dark:text-red-400" />
                        </div>
                        <CardTitle className="text-2xl font-black text-slate-900 dark:text-white">Link Inválido</CardTitle>
                        <CardDescription>
                            Este link de confirmação expirou, já foi utilizado ou está incorreto.
                        </CardDescription>
                    </CardHeader>
                    <CardFooter className="flex justify-center">
                        <Button asChild variant="outline" className="rounded-xl">
                            <Link href="/">Ir para Home</Link>
                        </Button>
                    </CardFooter>
                </Card>
            </div>
        )
    }

    const formattedAmount = new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL"
    }).format(Number(transaction.amount))

    const isPaid = transaction.status === "PAID"

    async function handleConfirm() {
        "use server"
        const result = await confirmPaymentWithTokenAction(token)
        if (result.success) {
            redirect(`/confirmar-pagamento/${token}?success=true`)
        }
    }

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-4">
            <div className="max-w-md w-full space-y-6">
                <div className="text-center space-y-2">
                    <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white uppercase">
                        My<span className="text-primary">Rifa</span>
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Validar Recebimento PIX Manual</p>
                </div>

                <Card className="border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl">
                    <div className="h-1.5 bg-primary w-full" />
                    <CardHeader className="pb-4">
                        <div className="flex justify-between items-start">
                            <div>
                                <CardTitle className="text-xl font-black text-slate-900 dark:text-white mb-1">
                                    {(transaction.rifa as any).title}
                                </CardTitle>
                                <Badge variant="outline" className="text-[10px] uppercase tracking-wider font-bold text-slate-400">
                                    Transação #{transaction.id.slice(-8).toUpperCase()}
                                </Badge>
                            </div>
                            <div className="bg-primary/10 p-2 rounded-xl">
                                <CheckCircle2 className="h-6 w-6 text-primary" />
                            </div>
                        </div>
                    </CardHeader>

                    <CardContent className="space-y-6">
                        {/* Player Info */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-950/50 border border-slate-100 dark:border-slate-800">
                                <div className="h-10 w-10 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-center shadow-sm">
                                    <User className="h-5 w-5 text-slate-600 dark:text-slate-400" />
                                </div>
                                <div>
                                    <p className="text-[10px] uppercase font-black text-slate-400 tracking-wider">Comprador</p>
                                    <p className="font-bold text-slate-900 dark:text-white uppercase">{(transaction.buyer as any)?.name || 'N/A'}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-950/50 border border-slate-100 dark:border-slate-800">
                                <div className="h-10 w-10 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-center shadow-sm">
                                    <Smartphone className="h-5 w-5 text-slate-600 dark:text-slate-400" />
                                </div>
                                <div>
                                    <p className="text-[10px] uppercase font-black text-slate-400 tracking-wider">WhatsApp</p>
                                    <p className="font-bold text-slate-900 dark:text-white">{(transaction.buyer as any)?.whatsapp || 'N/A'}</p>
                                </div>
                            </div>
                        </div>

                        {/* Order Summary */}
                        <div className="p-4 rounded-xl bg-slate-900 text-white shadow-lg space-y-3 relative overflow-hidden group">
                            <div className="absolute right-0 top-0 h-full w-24 bg-primary/10 skew-x-12 translate-x-12" />
                            <div className="flex justify-between items-center relative z-10">
                                <span className="text-[10px] uppercase font-black text-slate-400">Cotas Reservadas</span>
                                <span className="font-black text-lg text-primary">{transaction.numbers.length}</span>
                            </div>
                            <div className="flex justify-between items-center border-t border-slate-800 pt-3 relative z-10">
                                <span className="text-[10px] uppercase font-black text-slate-400">Total a Confirmar</span>
                                <span className="font-black text-2xl tracking-tighter">{formattedAmount}</span>
                            </div>
                        </div>

                        {/* Warning */}
                        <div className="flex gap-2 p-3 rounded-xl bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/20">
                            <Info className="h-5 w-5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
                            <p className="text-[11px] font-medium text-blue-800 dark:text-blue-300 leading-relaxed">
                                Ao confirmar, os números serão marcados como **PAGO** e o comprador será notificado automaticamente via WhatsApp.
                            </p>
                        </div>
                    </CardContent>

                    <CardFooter className="bg-slate-50 dark:bg-slate-950/50 p-6">
                        {isPaid || isSuccess ? (
                            <div className="w-full space-y-4 text-center">
                                <div className="flex flex-col items-center gap-2">
                                    <div className="bg-emerald-100 dark:bg-emerald-900/30 p-3 rounded-full mb-2">
                                        <CheckCircle2 className="h-10 w-10 text-emerald-500 animate-in zoom-in duration-500" />
                                    </div>
                                    <p className="font-black uppercase text-slate-900 dark:text-white text-lg">Recebimento Confirmado!</p>
                                    <p className="text-xs text-slate-500 dark:text-slate-400 font-medium max-w-[200px] mx-auto">
                                        O pagamento foi validado e o comprador já foi notificado.
                                    </p>
                                </div>
                                <Button asChild className="w-full h-14 rounded-2xl bg-slate-900 border border-slate-800 hover:bg-slate-800 dark:bg-emerald-600 dark:hover:bg-emerald-700 text-white font-black text-base uppercase tracking-widest shadow-xl transition-all">
                                    <Link href="/dashboard">Ir para o Painel</Link>
                                </Button>
                            </div>
                        ) : (
                            <form action={handleConfirm} className="w-full">
                                <Button className="w-full h-14 rounded-2xl bg-slate-900 border border-slate-800 hover:bg-slate-800 dark:bg-primary dark:border-none dark:hover:bg-primary/90 text-white font-black text-base uppercase tracking-widest shadow-xl transition-all hover:scale-[1.02] active:scale-95 group text-sm">
                                    Confirmar Recebimento Agora
                                </Button>
                            </form>
                        )}
                    </CardFooter>
                </Card>

                <p className="text-center text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em]">
                    Link Seguro MyRifa • Proteção SSL 256-bit
                </p>
            </div>
        </div>
    )
}
