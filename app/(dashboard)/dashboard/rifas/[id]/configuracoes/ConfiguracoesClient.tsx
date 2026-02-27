"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Save, Lock, Globe, Palette, Calendar, AlertTriangle } from "lucide-react"
import { toast } from "sonner"
import {
    updateRifaConfigAction,
    encerrarVendasAction,
    cancelarRifaAction
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
}

export function ConfiguracoesClient({ rifa }: ConfiguracoesClientProps) {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)
    const [isPrivate, setIsPrivate] = useState(rifa.isPrivate)
    const [drawDate, setDrawDate] = useState(rifa.drawDate ? new Date(rifa.drawDate).toISOString().split('T')[0] : "")
    const [minPercent, setMinPercent] = useState(rifa.minPercentToRaffle)

    async function handleSaveBasicConfigs() {
        setIsLoading(true)
        const res = await updateRifaConfigAction(rifa.id, {
            isPrivate,
            drawDate,
            minPercentToRaffle: Number(minPercent)
        })

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

            <Card className="border-primary/20 bg-primary/5">
                <CardHeader>
                    <div className="flex items-center gap-2">
                        <Palette className="h-5 w-5 text-primary" />
                        <CardTitle className="text-primary">Customização Pro</CardTitle>
                    </div>
                    <CardDescription>
                        Destaque sua campanha com ferramentas visuais exclusivas.
                    </CardDescription>
                </CardHeader>
                <CardContent>
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
