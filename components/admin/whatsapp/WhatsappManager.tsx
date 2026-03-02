"use client"

import { useState, useEffect, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import {
    MessageSquare,
    RefreshCw,
    QrCode,
    AlertTriangle,
    CheckCircle2,
    Send,
    LogOut,
    Zap,
    Battery,
    User,
    ShieldCheck,
    Smartphone,
    Trophy
} from "lucide-react"
import { cn } from "@/lib/utils"
import { toast } from "sonner"
import TemplateEditor from "./TemplateEditor"

interface WAStats {
    status: string
    instanceName: string
    owner?: string
    profileName?: string
    profilePicture?: string
    battery?: number
    updatedAt: string
}

interface WATemplates {
    newReservation: string | null
    paymentConfirmed: string | null
    winner: string | null
}

export default function WhatsappManager() {
    const [stats, setStats] = useState<WAStats | null>(null)
    const [templates, setTemplates] = useState<WATemplates | null>(null)
    const [qrBase64, setQrBase64] = useState<string | null>(null)
    const [isLoading, setIsLoading] = useState(false)
    const [isConnecting, setIsConnecting] = useState(false)
    const [testNumber, setTestNumber] = useState("")
    const [testMessage, setTestMessage] = useState("Mensagem de teste do sistema RifaAdmin v2! 🚀")

    const fetchStats = useCallback(async () => {
        try {
            const response = await fetch("/api/sistema-x7k2/whatsapp/status")
            const data = await response.json()
            setStats(data)

            // If connected, clear QR
            if (data.status === "open") {
                setQrBase64(null)
                setIsConnecting(false)
            }
        } catch (error) {
            console.error("Error fetching WA stats:", error)
        }
    }, [])

    const fetchTemplates = useCallback(async () => {
        try {
            const response = await fetch("/api/sistema-x7k2/whatsapp/templates")
            const data = await response.json()
            setTemplates(data)
        } catch (error) {
            console.error("Error fetching WA templates:", error)
        }
    }, [])

    useEffect(() => {
        fetchStats()
        fetchTemplates()
        const interval = setInterval(fetchStats, 10000) // Poll every 10s
        return () => clearInterval(interval)
    }, [fetchStats, fetchTemplates])

    async function handleSaveTemplate(key: keyof WATemplates, newValue: string) {
        try {
            const response = await fetch("/api/sistema-x7k2/whatsapp/templates", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ ...templates, [key]: newValue })
            })
            const data = await response.json()
            if (response.ok) {
                setTemplates(data)
                toast.success("Template salvo com sucesso!")
            } else {
                toast.error(`Falha ao salvar template: ${data.message || response.statusText}`)
            }
        } catch (error) {
            console.error("Error saving template:", error)
            toast.error("Erro ao salvar template.")
            throw error
        }
    }

    async function handleConnect() {
        setIsConnecting(true)
        setIsLoading(true)
        try {
            const response = await fetch("/api/sistema-x7k2/whatsapp/connect")
            const data = await response.json()
            if (data.base64) {
                setQrBase64(data.base64)
            } else {
                toast.error("Não foi possível gerar o QR Code.")
            }
        } catch (error) {
            toast.error("Erro ao conectar.")
        } finally {
            setIsLoading(false)
        }
    }

    async function handleAction(action: "logout" | "restart") {
        if (action === "logout" && !confirm("Tem certeza que deseja desconectar?")) return

        setIsLoading(true)
        try {
            const response = await fetch("/api/sistema-x7k2/whatsapp/control", {
                method: "POST",
                body: JSON.stringify({ action })
            })
            const data = await response.json()
            if (data.status === "SUCCESS" || data.status === 200) {
                toast.success(action === "logout" ? "Desconectado com sucesso." : "Instância reiniciada.")
                fetchStats()
            } else {
                toast.error("Falha ao executar ação.")
            }
        } catch (error) {
            toast.error("Erro no processamento.")
        } finally {
            setIsLoading(false)
        }
    }

    async function handleSendTest() {
        if (!testNumber) return toast.error("Informe o número.")

        setIsLoading(true)
        try {
            const response = await fetch("/api/sistema-x7k2/whatsapp/send-test", {
                method: "POST",
                body: JSON.stringify({ number: testNumber, message: testMessage })
            })
            const data = await response.json()
            if (data.key || data.status === "SUCCESS") {
                toast.success("Mensagem enviada!")
            } else {
                const errorMsg = data.message || data.error || (data.response && data.response.message) || "Falha na API Evolution."
                toast.error(`Erro: ${Array.isArray(errorMsg) ? errorMsg[0] : errorMsg}`)
            }
        } catch (error) {
            toast.error("Erro no envio.")
        } finally {
            setIsLoading(false)
        }
    }

    const isOpen = stats?.status === "open"
    const isConnectingState = stats?.status === "connecting" || isConnecting

    return (
        <div className="grid gap-8 lg:grid-cols-12 max-w-[1600px] mx-auto">
            {/* Status & Identity - Left Column */}
            <div className="lg:col-span-4 space-y-8">
                <Card className="border-white/[0.05] bg-white/[0.02] backdrop-blur-md shadow-2xl overflow-hidden">
                    <CardHeader className="border-b border-white/[0.05] bg-white/[0.01] p-8">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                                <div className={cn(
                                    "p-3 rounded-2xl transition-all duration-500",
                                    isOpen ? "bg-emerald-500/10 text-emerald-500" : "bg-red-500/10 text-red-500"
                                )}>
                                    <MessageSquare className="h-6 w-6" />
                                </div>
                                <div>
                                    <CardTitle className="text-xl font-black text-white uppercase tracking-tight">Status</CardTitle>
                                    <CardDescription className="text-slate-500 text-[10px] font-black uppercase tracking-widest">Evolution v2.0</CardDescription>
                                </div>
                            </div>
                            <Badge className={cn(
                                "px-3 py-1 rounded-lg border font-black text-[10px] uppercase tracking-widest",
                                isOpen ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" : "bg-red-500/10 text-red-400 border-red-500/20"
                            )}>
                                {isOpen ? "Conectado" : "Desconectado"}
                            </Badge>
                        </div>
                    </CardHeader>
                    <CardContent className="p-8 space-y-8">
                        {/* Profile Info */}
                        <div className="flex items-center space-x-5 p-5 rounded-2xl bg-white/[0.03] border border-white/[0.05]">
                            {stats?.profilePicture ? (
                                <img src={stats.profilePicture} className="h-16 w-16 rounded-2xl border-2 border-indigo-500/30 object-cover p-1" />
                            ) : (
                                <div className="h-16 w-16 rounded-2xl bg-indigo-500/10 border-2 border-indigo-500/20 flex items-center justify-center">
                                    <User className="h-8 w-8 text-indigo-400" />
                                </div>
                            )}
                            <div className="min-w-0 flex-1">
                                <p className="text-base font-black text-white truncate uppercase tracking-tight">{stats?.profileName || "Perfil Admin"}</p>
                                <p className="text-xs font-bold text-slate-500 truncate">{stats?.owner || "Nenhum número vinculado"}</p>
                            </div>
                        </div>

                        {/* Quick Metrics */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/[0.05] group">
                                <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2 flex items-center">
                                    <Battery className="h-3 w-3 mr-1.5 text-indigo-400" /> Bateria
                                </p>
                                <p className="text-xl font-black text-white">{stats?.battery !== undefined ? `${stats.battery}%` : "—"}</p>
                            </div>
                            <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/[0.05] group">
                                <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2 flex items-center">
                                    <ShieldCheck className="h-3 w-3 mr-1.5 text-indigo-400" /> Instância
                                </p>
                                <p className="text-xl font-black text-white truncate">{stats?.instanceName || "—"}</p>
                            </div>
                        </div>

                        {/* Control Actions */}
                        <div className="pt-4 flex flex-col gap-3">
                            <Button
                                variant="outline"
                                className="w-full h-12 rounded-xl border-white/10 bg-white/[0.02] hover:bg-white/[0.05] text-white font-black text-[10px] uppercase tracking-widest transition-all"
                                onClick={() => handleAction("restart")}
                                disabled={isLoading}
                            >
                                <RefreshCw className={cn("mr-2 h-4 w-4", isLoading && "animate-spin")} />
                                Reiniciar Instância
                            </Button>
                            {isOpen && (
                                <Button
                                    variant="outline"
                                    className="w-full h-12 rounded-xl border-red-500/20 bg-red-500/5 hover:bg-red-500/10 text-red-500 font-black text-[10px] uppercase tracking-widest transition-all"
                                    onClick={() => handleAction("logout")}
                                    disabled={isLoading}
                                >
                                    <LogOut className="mr-2 h-4 w-4" />
                                    Desconectar Dispositivo
                                </Button>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Connection & Tools - Right Column */}
            <div className="lg:col-span-8 space-y-8">
                {/* Connection Section */}
                {!isOpen && (
                    <Card className="border-indigo-500/20 bg-indigo-500/5 backdrop-blur-md shadow-2xl overflow-hidden border-2 animate-in zoom-in-95 duration-500">
                        <CardHeader className="p-8 border-b border-white/[0.05]">
                            <CardTitle className="text-xl font-black text-white uppercase tracking-tight flex items-center">
                                <Zap className="h-6 w-6 mr-3 text-indigo-400 fill-indigo-400" />
                                Ativar Conexão
                            </CardTitle>
                            <CardDescription className="text-slate-400">Escaneie o código abaixo com seu WhatsApp para começar.</CardDescription>
                        </CardHeader>
                        <CardContent className="p-8 flex flex-col items-center">
                            {qrBase64 ? (
                                <div className="p-6 bg-white rounded-3xl shadow-[0_0_50px_rgba(99,102,241,0.2)] border-8 border-white mb-6">
                                    <img src={qrBase64} alt="QR Code" className="w-64 h-64" />
                                </div>
                            ) : (
                                <div className="w-64 h-64 rounded-3xl bg-white/[0.03] border-4 border-dashed border-white/10 flex flex-col items-center justify-center text-center p-10 mb-6 group hover:border-indigo-500/30 transition-all">
                                    <QrCode className="h-16 w-16 text-slate-700 group-hover:scale-110 transition-transform duration-500" />
                                    <p className="text-xs font-bold text-slate-600 uppercase tracking-widest mt-4">Nenhum código ativo</p>
                                </div>
                            )}
                            <Button
                                onClick={handleConnect}
                                className="px-12 h-14 rounded-2xl bg-indigo-500 hover:bg-indigo-600 text-white font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-indigo-500/20 transition-all hover:scale-105 active:scale-95"
                                disabled={isLoading}
                            >
                                <QrCode className="mr-2 h-5 w-5" />
                                {qrBase64 ? "Atualizar QR Code" : "Gerar QR Code"}
                            </Button>
                        </CardContent>
                    </Card>
                )}

                {/* Test Message Tool */}
                <Card className="border-white/[0.05] bg-white/[0.02] backdrop-blur-md shadow-2xl">
                    <CardHeader className="p-8 border-b border-white/[0.05] bg-white/[0.01]">
                        <CardTitle className="text-xl font-black text-white uppercase tracking-tight flex items-center">
                            <Smartphone className="h-6 w-6 mr-3 text-indigo-400" />
                            Painel de Teste
                        </CardTitle>
                        <CardDescription className="text-slate-500 font-bold uppercase text-[10px] tracking-[0.2em]">Valide sua entrega de mensagens instantaneamente</CardDescription>
                    </CardHeader>
                    <CardContent className="p-8 space-y-8">
                        <div className="grid gap-6 md:grid-cols-2">
                            <div className="space-y-2">
                                <Label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Número do Telefone</Label>
                                <Input
                                    placeholder="5511999999999"
                                    className="h-14 bg-white/[0.03] border-white/[0.08] rounded-xl text-white placeholder:text-slate-600 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                                    value={testNumber}
                                    onChange={(e) => setTestNumber(e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Ação</Label>
                                <Button
                                    className="w-full h-14 rounded-xl bg-white/[0.05] hover:bg-indigo-500 text-white font-black text-xs uppercase tracking-widest transition-all shadow-lg active:scale-95"
                                    onClick={handleSendTest}
                                    disabled={isLoading || !isOpen}
                                >
                                    <Send className="mr-2 h-4 w-4" />
                                    Enviar Agora
                                </Button>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Mensagem Customizada</Label>
                            <textarea
                                className="w-full h-24 p-4 bg-white/[0.03] border-white/[0.08] rounded-xl text-white placeholder:text-slate-600 focus:ring-2 focus:ring-indigo-500/20 transition-all outline-none resize-none text-sm"
                                value={testMessage}
                                onChange={(e) => setTestMessage(e.target.value)}
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* Automation Rules */}
                <div className="grid gap-8 md:grid-cols-2">
                    <Card className="border-white/[0.05] bg-white/[0.02] backdrop-blur-md shadow-xl group hover:border-white/[0.1] transition-all">
                        <CardContent className="p-6 flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                                <div className="p-3 rounded-xl bg-amber-500/10 text-amber-500">
                                    <AlertTriangle className="h-5 w-5" />
                                </div>
                                <div>
                                    <p className="text-xs font-black text-white uppercase tracking-tight">Reserva Pendente</p>
                                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Automação Ativa</p>
                                </div>
                            </div>
                            <TemplateEditor
                                title="Template: Reserva Pendente"
                                description="Enviada quando um cliente reserva números mas ainda não pagou."
                                value={templates?.newReservation || ""}
                                onSave={(val) => handleSaveTemplate("newReservation", val)}
                                placeholders={[
                                    { tag: "{cliente}", label: "Nome do comprador" },
                                    { tag: "{rifa}", label: "Título da rifa" },
                                    { tag: "{numeros}", label: "Números escolhidos" },
                                    { tag: "{valor_total}", label: "Valor total da reserva" },
                                    { tag: "{pix_url}", label: "Link/Copia e Cola do PIX" }
                                ]}
                            />
                        </CardContent>
                    </Card>

                    <Card className="border-white/[0.05] bg-white/[0.02] backdrop-blur-md shadow-xl group hover:border-white/[0.1] transition-all">
                        <CardContent className="p-6 flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                                <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-500">
                                    <CheckCircle2 className="h-5 w-5" />
                                </div>
                                <div>
                                    <p className="text-xs font-black text-white uppercase tracking-tight">Pagamento Confirmado</p>
                                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Automação Ativa</p>
                                </div>
                            </div>
                            <TemplateEditor
                                title="Template: Pagamento Aprovado"
                                description="Enviada assim que o sistema confirma o recebimento do PIX."
                                value={templates?.paymentConfirmed || ""}
                                onSave={(val) => handleSaveTemplate("paymentConfirmed", val)}
                                placeholders={[
                                    { tag: "{cliente}", label: "Nome do comprador" },
                                    { tag: "{rifa}", label: "Título da rifa" },
                                    { tag: "{numeros}", label: "Números confirmados" }
                                ]}
                            />
                        </CardContent>
                    </Card>

                    <Card className="border-white/[0.05] bg-white/[0.02] backdrop-blur-md shadow-xl group hover:border-white/[0.1] transition-all">
                        <CardContent className="p-6 flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                                <div className="p-3 rounded-xl bg-indigo-500/10 text-indigo-500">
                                    <Trophy className="h-5 w-5" />
                                </div>
                                <div>
                                    <p className="text-xs font-black text-white uppercase tracking-tight">Mensagem de Ganhador</p>
                                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Automação Ativa</p>
                                </div>
                            </div>
                            <TemplateEditor
                                title="Template: Ganhador"
                                description="Enviada automaticamente (se configurada) para o vencedor do sorteio."
                                value={templates?.winner || ""}
                                onSave={(val) => handleSaveTemplate("winner", val)}
                                placeholders={[
                                    { tag: "{cliente}", label: "Nome do ganhador" },
                                    { tag: "{rifa}", label: "Título da rifa" },
                                    { tag: "{numero_vencedor}", label: "O número da sorte" }
                                ]}
                            />
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
