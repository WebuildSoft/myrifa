"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Cpu, HardDrive, Layout, Activity } from "lucide-react"

interface Metrics {
    system: {
        cpu: number
        ram: number
        ramUsed: number
        disk: number
        uptime: number
    }
    users: {
        total: number
        today: number
        online: number
    }
}

export default function SystemMetrics() {
    const [metrics, setMetrics] = useState<Metrics | null>(null)

    useEffect(() => {
        const eventSource = new EventSource("/api/sistema-x7k2/metrics")

        eventSource.onmessage = (event) => {
            const data = JSON.parse(event.data)
            setMetrics(data)
        }

        eventSource.onerror = (err) => {
            console.error("SSE Error:", err)
            eventSource.close()
        }

        return () => {
            eventSource.close()
        }
    }, [])

    if (!metrics) {
        return <div className="animate-pulse space-y-4">
            <div className="h-32 rounded-lg bg-slate-100 dark:bg-slate-800" />
            <div className="h-32 rounded-lg bg-slate-100 dark:bg-slate-800" />
        </div>
    }

    const { system } = metrics

    const MetricCard = ({ title, value, progress, icon: Icon, color }: any) => (
        <Card className="border-white/[0.05] bg-white/[0.02] backdrop-blur-sm transition-all hover:bg-white/[0.04]">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-[10px] font-bold uppercase tracking-widest text-slate-500">{title}</CardTitle>
                <Icon className={`h-4 w-4 text-${color}-400/80`} />
            </CardHeader>
            <CardContent>
                <div className="flex items-end justify-between mb-2">
                    <div className="text-2xl font-black text-white">{value}</div>
                    <div className={`text-[10px] font-bold text-${color}-400`}>{progress.toFixed(0)}%</div>
                </div>
                <div className="h-1.5 w-full bg-white/[0.05] rounded-full overflow-hidden">
                    <div
                        className={`h-full bg-${color}-500 transition-all duration-500 rounded-full shadow-[0_0_8px_rgba(var(--${color}-rgb),0.5)]`}
                        style={{ width: `${progress}%` }}
                    />
                </div>
            </CardContent>
        </Card>
    )

    return (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <MetricCard title="Carga de CPU" value={`${system.cpu.toFixed(1)}%`} progress={system.cpu} icon={Cpu} color="indigo" />
            <MetricCard title="Memória RAM" value={`${system.ramUsed.toFixed(1)}%`} progress={system.ramUsed} icon={Activity} color="violet" />
            <MetricCard title="Uso de Disco" value={`${system.disk.toFixed(1)}%`} progress={system.disk} icon={HardDrive} color="blue" />

            <Card className="border-white/[0.05] bg-white/[0.02] backdrop-blur-sm transition-all hover:bg-white/[0.04]">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Visitantes Online</CardTitle>
                    <Layout className="h-4 w-4 text-emerald-400/80" />
                </CardHeader>
                <CardContent>
                    <div className="text-3xl font-black text-white">{metrics.users.online}</div>
                    <div className="mt-2 flex items-center space-x-2">
                        <div className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                        </div>
                        <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest">Tempo Real Ativo</span>
                    </div>
                </CardContent>
            </Card>

        </div>
    )
}
