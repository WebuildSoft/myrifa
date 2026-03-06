import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { User, Mail, Smartphone, ShieldCheck, CreditCard, Lock, Settings2, Wallet, Zap as ZapIcon, Fingerprint } from "lucide-react"
import { MercadoPagoSettings } from "@/components/dashboard/conta/MercadoPagoSettings"
import { ManualPixSettings } from "@/components/dashboard/conta/ManualPixSettings"
import { ProfileAvatar } from "@/components/dashboard/conta/ProfileAvatar"
import { SubscriptionStatus } from "@/components/dashboard/conta/SubscriptionStatus"
import { PasswordSettings } from "@/components/dashboard/conta/PasswordSettings"
import { PersonalDataSettings } from "@/components/dashboard/conta/PersonalDataSettings"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default async function ContaPage({ searchParams }: { searchParams: Promise<{ tab?: string }> }) {
    const session = await auth()
    if (!session?.user?.id) redirect("/login")

    const params = await searchParams
    const defaultTab = params.tab || "geral"

    const user = await prisma.user.findUnique({
        where: { id: session.user.id }
    })

    if (!user) redirect("/login")

    return (
        <div className="relative max-w-6xl mx-auto pb-20 px-4 sm:px-6 pt-10">
            {/* Elementos Decorativos de Fundo */}
            <div className="absolute top-0 -left-20 size-[500px] bg-primary/5 rounded-full blur-[120px] -z-10 animate-pulse pointer-events-none" />
            <div className="absolute bottom-0 -right-20 size-[400px] bg-emerald-500/5 rounded-full blur-[100px] -z-10 pointer-events-none" />

            <div className="flex flex-col gap-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
                {/* Cabeçalho de Elite */}
                <div className="relative group">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-slate-200/40 dark:border-slate-800/40">
                        <div className="space-y-2">
                            <div className="flex items-center gap-3 mb-1">
                                <div className="h-1 w-6 md:h-1 md:w-8 bg-primary rounded-full" />
                                <span className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] md:tracking-[0.3em] text-primary/70 text-center md:text-left">Configurações Avançadas</span>
                            </div>
                            <h1 className="text-3xl md:text-5xl font-black tracking-tighter italic dark:text-white leading-[1.1] md:leading-[0.9]">
                                Minha <span className="text-primary drop-shadow-[0_0_20px_rgba(var(--primary),0.3)]">Conta</span>
                            </h1>
                            <p className="text-xs md:text-sm font-bold text-slate-400 dark:text-slate-500 max-w-md leading-relaxed">
                                Gerencie sua identidade digital, preferências de segurança e toda a engenharia financeira de seus recebimentos.
                            </p>
                        </div>

                        {/* Badge de Status Rápido no Header (Opcional, mas dá um toque premium) */}
                        <div className="hidden md:flex items-center gap-4 p-2 pl-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/50 shadow-sm">
                            <div className="flex flex-col items-end">
                                <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">Status Geral</span>
                                <span className="text-11px font-black text-emerald-500 uppercase tracking-tighter italic">Conta Verificada</span>
                            </div>
                            <div className="size-10 bg-emerald-500/10 rounded-xl flex items-center justify-center border border-emerald-500/20">
                                <ShieldCheck className="size-5 text-emerald-500" />
                            </div>
                        </div>
                    </div>
                </div>

                <Tabs defaultValue={defaultTab} className="space-y-8 md:space-y-12">
                    <div className="flex flex-col items-center">
                        <TabsList className="bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl p-1 md:p-1.5 rounded-2xl md:rounded-[2rem] h-12 md:h-16 border border-slate-200/50 dark:border-slate-800/50 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.05)] dark:shadow-none w-full md:w-auto flex justify-around md:justify-center relative overflow-hidden group/tabs">
                            {/* Brilho interno do TabsList */}
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-[1px] bg-gradient-to-r from-transparent via-primary/20 to-transparent" />

                            <TabsTrigger
                                value="geral"
                                className="relative flex-1 md:flex-none rounded-xl md:rounded-[1.5rem] px-3 md:px-8 h-full data-[state=active]:bg-white dark:data-[state=active]:bg-slate-800 data-[state=active]:shadow-lg data-[state=active]:text-primary font-black text-[9px] md:text-[11px] uppercase tracking-wider md:tracking-widest gap-2 md:gap-3 transition-all duration-300 group/item"
                            >
                                <Fingerprint className="size-3.5 md:size-4 group-hover/item:scale-110 transition-transform" />
                                <span>Perfil</span>
                                { /* Indicador de ponto pro ativo (estético) */}
                                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 size-1 bg-primary rounded-full opacity-0 data-[state=active]:opacity-100 transition-opacity" />
                            </TabsTrigger>

                            <TabsTrigger
                                value="financeiro"
                                className="relative flex-1 md:flex-none rounded-xl md:rounded-[1.5rem] px-3 md:px-8 h-full data-[state=active]:bg-white dark:data-[state=active]:bg-slate-800 data-[state=active]:shadow-lg data-[state=active]:text-primary font-black text-[9px] md:text-[11px] uppercase tracking-wider md:tracking-widest gap-2 md:gap-3 transition-all duration-300 group/item"
                            >
                                <Wallet className="size-3.5 md:size-4 group-hover/item:scale-110 transition-transform" />
                                <span>Financeiro</span>
                            </TabsTrigger>

                            <TabsTrigger
                                value="seguranca"
                                className="relative flex-1 md:flex-none rounded-xl md:rounded-[1.5rem] px-3 md:px-8 h-full data-[state=active]:bg-white dark:data-[state=active]:bg-slate-800 data-[state=active]:shadow-lg data-[state=active]:text-primary font-black text-[9px] md:text-[11px] uppercase tracking-wider md:tracking-widest gap-2 md:gap-3 transition-all duration-300 group/item"
                            >
                                <Lock className="size-3.5 md:size-4 group-hover/item:scale-110 transition-transform" />
                                <span>Segurança</span>
                            </TabsTrigger>
                        </TabsList>
                    </div>

                    {/* Conteúdo das Abas com Animação de Entrada */}
                    <div className="mt-6 md:mt-8 transition-all duration-500">
                        <TabsContent value="geral" className="space-y-10 outline-none animate-in fade-in slide-in-from-left-4 duration-500">
                            <div className="max-w-4xl mx-auto">
                                <PersonalDataSettings user={user} />
                            </div>
                        </TabsContent>

                        <TabsContent value="financeiro" className="space-y-10 outline-none animate-in fade-in slide-in-from-right-4 duration-500">
                            <div className="max-w-4xl mx-auto space-y-10">
                                <SubscriptionStatus plan={user.plan} userId={user.id} expiresAt={user.planExpiresAt} />
                                <ManualPixSettings
                                    initialPixKey={(user as any).pixKey}
                                    initialPixQrCodeImage={(user as any).pixQrCodeImage}
                                />
                                <MercadoPagoSettings initialToken={user.mercadoPagoAccessToken} />
                            </div>
                        </TabsContent>

                        <TabsContent value="seguranca" className="space-y-10 outline-none max-w-4xl mx-auto animate-in fade-in zoom-in-95 duration-500">
                            <PasswordSettings totpEnabled={user.totpEnabled} />

                            <Card className="border-red-500/10 dark:border-red-900/20 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm shadow-sm rounded-[3rem] overflow-hidden group/risk">
                                <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-transparent via-red-500/20 to-transparent opacity-0 group-hover/risk:opacity-100 transition-opacity" />
                                <CardHeader className="p-10 pb-4">
                                    <div className="flex items-center gap-4">
                                        <div className="size-3 bg-red-500 rounded-full animate-pulse shadow-[0_0_10px_rgb(239,68,68,0.5)]" />
                                        <div>
                                            <CardTitle className="text-red-500 text-2xl font-black tracking-tighter italic">Zona de Risco</CardTitle>
                                            <CardDescription className="text-[10px] font-black uppercase tracking-[0.3em] text-red-500/60">Ação Crítica e Irreversível</CardDescription>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent className="p-10 pt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-10 bg-red-50/10 dark:bg-red-950/5">
                                    <div className="space-y-3">
                                        <p className="text-sm text-slate-500 font-bold max-w-sm leading-relaxed">
                                            Ao encerrar seu perfil, todos os registros de vendas, campanhas e configurações financeira serão <span className="text-red-500 underline decoration-red-500/20 underline-offset-4">deletados permanentemente</span>.
                                        </p>
                                        <div className="flex items-center gap-2 text-[10px] font-black text-red-600/50 uppercase tracking-widest">
                                            <ZapIcon className="size-3" /> sem volta
                                        </div>
                                    </div>
                                    <Button variant="outline" className="border-red-100 text-red-600 hover:bg-red-600 hover:text-white dark:border-red-900/20 dark:hover:bg-red-900/50 rounded-2xl h-14 px-10 font-black text-xs uppercase tracking-[0.2em] transition-all transform hover:scale-105 active:scale-95 shadow-lg shadow-red-500/5">
                                        Purga Total da Conta
                                    </Button>
                                </CardContent>
                            </Card>
                        </TabsContent>
                    </div>
                </Tabs>
            </div>
        </div>
    )
}
