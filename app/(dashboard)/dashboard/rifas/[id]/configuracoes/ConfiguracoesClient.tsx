"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Save, Lock, Globe, Palette, Calendar, AlertTriangle, Sparkles } from "lucide-react"
import { toast } from "sonner"
import {
    updateRifaConfigAction,
    encerrarVendasAction,
    cancelarRifaAction,
    testNotificationAction
} from "@/actions/rifas"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

interface ConfiguracoesClientProps {
    rifa: any
    userPlan?: string
}

export function ConfiguracoesClient({ rifa, userPlan = "FREE" }: ConfiguracoesClientProps) {
    const isPro = userPlan === "PRO" || userPlan === "INSTITUTIONAL"
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)
    const [isPrivate, setIsPrivate] = useState(rifa.isPrivate)
    const [drawDate, setDrawDate] = useState(rifa.drawDate ? new Date(rifa.drawDate).toISOString().split('T')[0] : "")
    const [minPercent, setMinPercent] = useState(rifa.minPercentToRaffle)
    const [notifyOrganizer, setNotifyOrganizer] = useState(rifa.notifyOrganizer || false)
    const [organizerWhatsapp, setOrganizerWhatsapp] = useState(rifa.organizerWhatsapp || "")

    async function handleSaveBasicConfigs() {
        setIsLoading(true)
        const res = await updateRifaConfigAction(rifa.id, {
            isPrivate,
            drawDate,
            minPercentToRaffle: Number(minPercent),
            notifyOrganizer,
            organizerWhatsapp
        } as any)

        setIsLoading(false)
        if (res.error) {
            toast.error(res.error)
        } else {
            toast.success("Configurações atualizadas com sucesso!")
            router.refresh()
        }
    }

    async function handleEncerrarVendas() {
        setIsLoading(true)
        const res = await encerrarVendasAction(rifa.id)
        setIsLoading(false)

        if (res.error) {
            toast.error(res.error)
        } else {
            toast.success("Vendas encerradas com sucesso!")
            router.refresh()
        }
    }

    async function handleCancelarRifa() {
        setIsLoading(true)
        const res = await cancelarRifaAction(rifa.id)
        setIsLoading(false)

        if (res.error) {
            toast.error(res.error)
        } else {
            toast.success("Campanha cancelada definitivamente.")
            router.push("/dashboard/rifas")
        }
    }

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <div className="flex items-center gap-2">
                        <Globe className="h-5 w-5 text-primary" />
                        <CardTitle>Visibilidade e Acesso</CardTitle>
                    </div>
                    <CardDescription>
                        Controle como as pessoas encontram e acessam sua campanha.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="flex items-center justify-between space-x-2">
                        <div className="flex flex-col space-y-1">
                            <Label htmlFor="isPrivate">Campanha Privada</Label>
                            <p className="text-sm text-muted-foreground">
                                Apenas pessoas com o link direto poderão acessar. Não aparecerá em buscas ou listagens públicas da plataforma.
                            </p>
                        </div>
                        <Switch
                            id="isPrivate"
                            checked={isPrivate}
                            onCheckedChange={setIsPrivate}
                        />
                    </div>
                </CardContent>
                <CardFooter className="bg-muted/50 border-t px-6 py-4">
                    <Button
                        className="ml-auto"
                        onClick={handleSaveBasicConfigs}
                        disabled={isLoading}
                    >
                        {isLoading ? "Salvando..." : "Salvar Alterações"}
                    </Button>
                </CardFooter>
            </Card>

            <Card>
                <CardHeader>
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center text-green-600">
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-message-circle"><path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" /><path d="M8 12h.01" /><path d="M12 12h.01" /><path d="M16 12h.01" /></svg>
                        </div>
                        <CardTitle>Alertas para Organizador</CardTitle>
                    </div>
                    <CardDescription>
                        Receba notificações automáticas no WhatsApp para cada nova reserva ou pagamento confirmado.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="flex items-center justify-between space-x-2">
                        <div className="flex flex-col space-y-1">
                            <Label htmlFor="notifyOrganizer">Ativar Notificações</Label>
                            <p className="text-sm text-muted-foreground">
                                Você receberá um alerta imediato quando um cliente reservar ou pagar.
                            </p>
                        </div>
                        <Switch
                            id="notifyOrganizer"
                            checked={notifyOrganizer}
                            onCheckedChange={setNotifyOrganizer}
                        />
                    </div>

                    {notifyOrganizer && (
                        <div className="space-y-4 pt-4 border-t animate-in fade-in slide-in-from-top-2 duration-300">
                            <div className="space-y-2">
                                <Label htmlFor="organizerWhatsapp">WhatsApp para Alertas</Label>
                                <div className="relative group">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors font-bold">+55</span>
                                    <Input
                                        id="organizerWhatsapp"
                                        placeholder="(00) 00000-0000"
                                        className="pl-12"
                                        value={organizerWhatsapp}
                                        onChange={(e) => setOrganizerWhatsapp(e.target.value)}
                                    />
                                </div>
                                <p className="text-xs text-muted-foreground">
                                    Informe o número com DDD. Ex: (11) 99999-9999
                                </p>
                            </div>
                        </div>
                    )}
                </CardContent>
                <CardFooter className="bg-muted/50 border-t px-6 py-4 flex flex-col md:flex-row gap-4">
                    {notifyOrganizer && organizerWhatsapp && (
                        <Button
                            variant="outline"
                            className="w-full md:w-auto border-green-200 text-green-600 hover:bg-green-50"
                            onClick={async () => {
                                const loadingToast = toast.loading("Enviando teste...")
                                const res = await testNotificationAction(organizerWhatsapp)
                                toast.dismiss(loadingToast)
                                if (res.success) {
                                    toast.success("Mensagem de teste enviada!")
                                } else {
                                    toast.error(res.error || "Erro ao enviar teste")
                                }
                            }}
                            disabled={isLoading}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2"><path d="m22 2-7 20-4-9-9-4Z" /><path d="M22 2 11 13" /></svg>
                            Enviar Teste
                        </Button>
                    )}
                    <Button
                        className="w-full md:w-auto ml-auto"
                        onClick={handleSaveBasicConfigs}
                        disabled={isLoading}
                    >
                        {isLoading ? "Salvando..." : "Salvar Configurações de Alerta"}
                    </Button>
                </CardFooter>
            </Card>

            <Card>
                <CardHeader>
                    <div className="flex items-center gap-2">
                        <Calendar className="h-5 w-5 text-primary" />
                        <CardTitle>Premiação e Datas</CardTitle>
                    </div>
                    <CardDescription>
                        Defina a previsão da entrega ou reconhecimento da sua campanha.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="drawDate">Data da Premiação (Estimada)</Label>
                            <Input
                                id="drawDate"
                                type="date"
                                value={drawDate}
                                onChange={(e) => setDrawDate(e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="minPercent">Meta Mínima para Realização (%)</Label>
                            <Input
                                id="minPercent"
                                type="number"
                                min="1"
                                max="100"
                                value={minPercent}
                                onChange={(e) => setMinPercent(e.target.value)}
                            />
                        </div>
                    </div>
                </CardContent>
                <CardFooter className="bg-muted/50 border-t px-6 py-4">
                    <Button
                        className="ml-auto"
                        onClick={handleSaveBasicConfigs}
                        disabled={isLoading}
                    >
                        {isLoading ? "Salvando..." : "Salvar Configurações"}
                    </Button>
                </CardFooter>
            </Card>

            <Card className={cn(
                "border-primary/20",
                isPro ? "bg-gradient-to-br from-indigo-500/5 via-primary/5 to-purple-500/5" : "bg-primary/5"
            )}>
                <CardHeader>
                    <div className="flex items-center gap-2">
                        <Palette className="h-5 w-5 text-primary" />
                        <CardTitle className="text-primary">Aparência e Temas</CardTitle>
                    </div>
                    <CardDescription>
                        {isPro
                            ? "Personalize as cores e o formato das cotas da sua campanha."
                            : "Destaque sua campanha com ferramentas visuais exclusivas."
                        }
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {isPro ? (
                        <div className="flex flex-col items-center text-center py-6 px-4 border-2 border-dashed border-primary/20 rounded-xl bg-background/40">
                            <Sparkles className="h-8 w-8 text-primary/60 mx-auto mb-2 animate-pulse" />
                            <h4 className="font-bold text-primary">Modo Customização Liberado</h4>
                            <p className="text-sm text-muted-foreground max-w-sm mx-auto mt-1 mb-4">
                                Você tem acesso a todos os temas premium e formatos exclusivos. Altere agora na tela de edição.
                            </p>
                            <Button
                                variant="default"
                                className="font-bold gap-2 shadow-lg shadow-primary/20"
                                onClick={() => router.push(`/dashboard/rifas/${rifa.id}/editar`)}
                            >
                                <Palette className="h-4 w-4" />
                                Personalizar Visual Agora
                            </Button>
                        </div>
                    ) : (
                        <div className="text-center py-6 px-4 border-2 border-dashed border-primary/20 rounded-xl bg-background/50">
                            <Lock className="h-8 w-8 text-primary/40 mx-auto mb-2" />
                            <h4 className="font-bold text-primary">Funcionalidade Exclusiva PRO</h4>
                            <p className="text-sm text-muted-foreground max-w-xs mx-auto mt-1 mb-4">
                                Faça upgrade no seu plano para alterar cores, formas de balões e adicionar imagens na galeria.
                            </p>
                            <Button variant="default" onClick={() => router.push("/assinatura")}>
                                Ver Planos
                            </Button>
                        </div>
                    )}
                </CardContent>
            </Card>

            <Card className="border-red-200 bg-red-50/50">
                <CardHeader>
                    <CardTitle className="text-red-600">Encerrar ou Cancelar</CardTitle>
                    <CardDescription>
                        Ações definitivas sobre o status da campanha.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <p className="text-sm text-gray-600">
                        Ao cancelar uma campanha com cotas já apoiadas, você deverá realizar o estorno manual aos apoiadores.
                        Campanhas com premiação realizada não podem ser canceladas.
                    </p>
                </CardContent>
                <CardFooter className="flex flex-col md:flex-row justify-between border-t border-red-100 px-6 py-4 gap-4">
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button variant="outline" className="text-red-600 border-red-200 hover:bg-red-50">
                                Encerrar Captação
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Encerrar captação?</AlertDialogTitle>
                                <AlertDialogDescription>
                                    As pessoas não poderão mais apoiar sua campanha. Você pode reativar a captação alterando o status para Ativa novamente.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Voltar</AlertDialogCancel>
                                <AlertDialogAction onClick={handleEncerrarVendas}>Confirmar</AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>

                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button variant="destructive">
                                Cancelar Campanha Definitivamente
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent className="border-red-500">
                            <AlertDialogHeader>
                                <AlertDialogTitle className="flex items-center gap-2 text-red-600">
                                    <AlertTriangle className="h-5 w-5" />
                                    CANCELAR CAMPANHA DEFINITIVAMENTE?
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                    Esta ação é irreversível. A campanha será marcada como cancelada e não poderá ser reativada.
                                    Você será responsável por entrar em contato e estornar o valor dos apoiadores se houver cotas pagas.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Manter Campanha</AlertDialogCancel>
                                <AlertDialogAction
                                    className="bg-red-600 hover:bg-red-700"
                                    onClick={handleCancelarRifa}
                                >
                                    SIM, CANCELAR AGORA
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </CardFooter>
            </Card>
        </div>
    )
}
