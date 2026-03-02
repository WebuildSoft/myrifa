"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { MessageSquare, RefreshCw, QrCode, AlertTriangle, CheckCircle2 } from "lucide-react"

interface WhatsappStats {
    status: string
    instanceName: string
    owner?: string
    profileName?: string
    updatedAt: string
}

export default function WhatsappStatus() {
    const [stats, setStats] = useState<WhatsappStats | null>(null)
    const [isLoading, setIsLoading] = useState(false)

    async function fetchStats() {
        setIsLoading(true)
        try {
            const response = await fetch("/api/sistema-x7k2/whatsapp/status")
            const data = await response.json()
            setStats(data)
        } catch (error) {
            console.error("Error fetching WA stats:", error)
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        fetchStats()
        const interval = setInterval(fetchStats, 30000) // 30s
        return () => clearInterval(interval)
    }, [])

    const isConnected = stats?.status === "open"
    const isConnecting = stats?.status === "connecting"
    const isDisconnected = !isConnected && !isConnecting

    return (
        <Card className="border-white/[0.05] bg-white/[0.02] backdrop-blur-sm shadow-xl transition-all hover:bg-white/[0.04]">
            <CardHeader className="flex flex-row items-center justify-between pb-4">
                <div className="space-y-1">
                    <CardTitle className="text-lg font-bold text-white flex items-center">
                        <MessageSquare className="mr-2 h-5 w-5 text-indigo-400" />
                        WhatsApp
                    </CardTitle>
                    <CardDescription className="text-slate-500 text-xs">Evolution API v2.0</CardDescription>
                </div>
                {isConnected ? (
                    <div className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 uppercase tracking-widest">
                        Ativo
                    </div>
                ) : (
                    <div className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-500/10 text-red-400 border border-red-500/20 uppercase tracking-widest">
                        Inativo
                    </div>
                )}
            </CardHeader>
            <CardContent>
                <div className="space-y-6">
                    <div className="rounded-2xl border border-white/[0.05] bg-white/[0.03] p-5 flex items-center justify-between group transition-colors hover:bg-white/[0.05]">
                        <div className="flex items-center space-x-4">
                            <div className={`p-2.5 rounded-xl ${isConnected ? 'bg-emerald-500/10' : 'bg-red-500/10'} group-hover:scale-110 transition-transform`}>
                                {isConnected ? (
                                    <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                                ) : isConnecting ? (
                                    <RefreshCw className="h-5 w-5 animate-spin text-blue-500" />
                                ) : (
                                    <AlertTriangle className="h-5 w-5 text-red-500" />
                                )}
                            </div>
                            <div className="flex flex-col">
                                <span className="text-[10px] uppercase tracking-widest text-slate-500 font-bold mb-0.5">Estado atual</span>
                                <span className={`text-sm font-bold ${isConnected ? 'text-emerald-400' : 'text-slate-300'}`}>
                                    {stats?.status ? stats.status.toUpperCase() : "AGUARDANDO..."}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="rounded-xl border border-white/[0.05] bg-white/[0.03] p-4 group">
                            <span className="text-[10px] uppercase tracking-widest text-slate-500 font-bold block mb-1">Instância</span>
                            <span className="text-sm font-semibold text-white truncate block">{stats?.instanceName || "—"}</span>
                        </div>
                        <div className="rounded-xl border border-white/[0.05] bg-white/[0.03] p-4 group">
                            <span className="text-[10px] uppercase tracking-widest text-slate-500 font-bold block mb-1">Perfil</span>
                            <span className="text-sm font-semibold text-white truncate block">{stats?.profileName || "—"}</span>
                        </div>
                    </div>

                    <div className="flex items-center space-x-3">
                        <Button
                            variant="ghost"
                            className="flex-1 rounded-xl bg-white/[0.03] border border-white/[0.05] text-slate-300 hover:bg-white/[0.08] hover:text-white transition-all py-6 h-auto font-bold text-xs uppercase tracking-widest"
                            onClick={fetchStats}
                            disabled={isLoading}
                        >
                            <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
                            Sincronizar
                        </Button>
                        {!isConnected && (
                            <Link href="/sistema-x7k2/whatsapp" className="flex-1">
                                <Button className="w-full rounded-xl bg-indigo-500 hover:bg-indigo-600 text-white shadow-lg shadow-indigo-500/20 transition-all py-6 h-auto font-bold text-xs uppercase tracking-widest">
                                    <QrCode className="mr-2 h-4 w-4" />
                                    Conectar
                                </Button>
                            </Link>
                        )}
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
