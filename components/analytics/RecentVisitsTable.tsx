"use client"

import React, { useState } from "react"
import {
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from "@/components/ui/table"
import { Eye, ChevronDown, ChevronRight, Monitor, Smartphone, Tablet } from "lucide-react"

const DEVICE_ICONS: Record<string, React.ReactNode> = {
    mobile: <Smartphone className="h-3.5 w-3.5" />,
    desktop: <Monitor className="h-3.5 w-3.5" />,
    tablet: <Tablet className="h-3.5 w-3.5" />,
}

const DEVICE_COLORS: Record<string, string> = {
    mobile: "bg-indigo-400",
    desktop: "bg-violet-400",
    tablet: "bg-blue-400",
}

const SOURCE_COLORS: Record<string, string> = {
    "WhatsApp": "text-emerald-400",
    "Instagram": "text-pink-400",
    "Facebook": "text-blue-400",
    "Google": "text-red-400",
    "Twitter/X": "text-sky-400",
    "TikTok": "text-rose-400",
    "Telegram": "text-blue-300",
    "YouTube": "text-red-500",
    "Direto": "text-slate-400",
}

export type ViewItem = {
    id: string
    createdAt: Date
    rifaId: string
    sessionId: string
    referrer: string | null
    rawReferrer: string | null
    device: string
    os: string | null
    browser: string | null
    duration: number | null
    utmSource: string | null
    utmMedium: string | null
    utmCampaign: string | null
    ip: string | null
}

export type GroupedVisits = {
    rifaId: string
    rifaTitle: string
    totalViews: number
    uniqueVisitors: number
    views: ViewItem[]
}

export function RecentVisitsTable({ groupedVisits, totalViews }: { groupedVisits: GroupedVisits[], totalViews: number }) {
    const [expandedRows, setExpandedRows] = useState<Record<string, boolean>>({})

    const toggleRow = (rifaId: string) => {
        setExpandedRows(prev => ({
            ...prev,
            [rifaId]: !prev[rifaId]
        }))
    }

    return (
        <div className="overflow-x-auto custom-scrollbar">
            <Table>
                <TableHeader className="bg-white/[0.01]">
                    <TableRow className="border-white/[0.05] hover:bg-transparent">
                        <TableHead className="w-10"></TableHead>
                        <TableHead className="text-slate-500 font-bold uppercase tracking-widest text-[10px] py-4 px-6">Rifa</TableHead>
                        <TableHead className="text-slate-500 font-bold uppercase tracking-widest text-[10px] py-4 px-6 text-center">Visualizações</TableHead>
                        <TableHead className="text-slate-500 font-bold uppercase tracking-widest text-[10px] py-4 px-6 text-center">Visitantes Únicos</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {groupedVisits.length === 0 ? (
                        <TableRow className="border-white/[0.03]">
                            <TableCell colSpan={4} className="h-40 text-center text-slate-600 text-sm font-medium">
                                Nenhuma visita registrada no banco local.
                            </TableCell>
                        </TableRow>
                    ) : (
                        groupedVisits.map((group) => (
                            <React.Fragment key={group.rifaId}>
                                <TableRow
                                    className="border-white/[0.03] hover:bg-white/[0.02] transition-colors group cursor-pointer"
                                    onClick={() => toggleRow(group.rifaId)}
                                >
                                    <TableCell className="py-3.5 px-4 text-slate-400">
                                        {expandedRows[group.rifaId] ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                                    </TableCell>
                                    <TableCell className="py-3.5 px-6">
                                        <div className="flex flex-col">
                                            <span className="text-white font-medium text-sm">{group.rifaTitle}</span>
                                            <span className="text-slate-500 font-mono text-[10px]">ID: {group.rifaId}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="py-3.5 px-6 text-center">
                                        <div className="inline-flex items-center justify-center px-2.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 font-bold text-xs ring-1 ring-inset ring-indigo-500/20">
                                            {group.totalViews}
                                        </div>
                                    </TableCell>
                                    <TableCell className="py-3.5 px-6 text-center">
                                        <div className="inline-flex items-center justify-center px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 font-bold text-xs ring-1 ring-inset ring-emerald-500/20">
                                            {group.uniqueVisitors}
                                        </div>
                                    </TableCell>
                                </TableRow>

                                {expandedRows[group.rifaId] && (
                                    <TableRow className="border-white/[0.03] bg-black/20">
                                        <TableCell colSpan={4} className="p-0">
                                            <div className="p-4 pl-12">
                                                <div className="overflow-hidden border border-white/[0.05] rounded-xl bg-[#020617]/40 shadow-inner">
                                                    <Table>
                                                        <TableHeader className="bg-white/[0.01]">
                                                            <TableRow className="hover:bg-transparent border-white/[0.05]">
                                                                <TableHead className="text-slate-500 font-bold uppercase tracking-widest text-[10px] py-3 px-4">Data/Hora</TableHead>
                                                                <TableHead className="text-slate-500 font-bold uppercase tracking-widest text-[10px] py-3 px-4">Dispositivo / OS</TableHead>
                                                                <TableHead className="text-slate-500 font-bold uppercase tracking-widest text-[10px] py-3 px-4">Origem</TableHead>
                                                                <TableHead className="text-slate-500 font-bold uppercase tracking-widest text-[10px] py-3 px-4">UTM / IP</TableHead>
                                                            </TableRow>
                                                        </TableHeader>
                                                        <TableBody>
                                                            {group.views.map((v) => (
                                                                <TableRow key={v.id} className="border-white/[0.03] hover:bg-white/[0.02] transition-colors">
                                                                    <TableCell className="py-2.5 px-4 whitespace-nowrap">
                                                                        <span className="text-slate-300 font-mono text-[11px]">
                                                                            {new Intl.DateTimeFormat('pt-BR', { dateStyle: 'short', timeStyle: 'medium', timeZone: 'America/Manaus' }).format(new Date(v.createdAt))}
                                                                        </span>
                                                                    </TableCell>
                                                                    <TableCell className="py-2.5 px-4">
                                                                        <div className="flex flex-col gap-0.5">
                                                                            <div className="flex items-center gap-1.5">
                                                                                <span className={`${DEVICE_COLORS[v.device] || "bg-slate-500"}/20 p-0.5 rounded`}>
                                                                                    {DEVICE_ICONS[v.device] || <Monitor className="h-3 w-3" />}
                                                                                </span>
                                                                                <span className="text-slate-300 text-[11px] capitalize">{v.device}</span>
                                                                            </div>
                                                                            <span className="text-slate-500 text-[9px]">{v.os} / {v.browser}</span>
                                                                        </div>
                                                                    </TableCell>
                                                                    <TableCell className="py-2.5 px-4">
                                                                        <div className="flex flex-col gap-0.5">
                                                                            <span className={`text-[11px] font-bold ${SOURCE_COLORS[v.referrer || "Direto"] || "text-slate-400"}`}>
                                                                                {v.referrer || "Direto"}
                                                                            </span>
                                                                            <span className="text-slate-500 text-[9px] truncate max-w-[120px]" title={v.rawReferrer || ""}>
                                                                                {v.rawReferrer || "Sem href"}
                                                                            </span>
                                                                        </div>
                                                                    </TableCell>
                                                                    <TableCell className="py-2.5 px-4">
                                                                        <div className="flex flex-col gap-0.5">
                                                                            <span className="text-slate-400 text-[10px] font-mono">
                                                                                UTM: {v.utmSource || "—"}
                                                                            </span>
                                                                            <span className="text-slate-500 text-[9px] font-mono">
                                                                                IP: {v.ip || "—"}
                                                                            </span>
                                                                        </div>
                                                                    </TableCell>
                                                                </TableRow>
                                                            ))}
                                                        </TableBody>
                                                    </Table>
                                                </div>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                )}
                            </React.Fragment>
                        ))
                    )}
                </TableBody>
            </Table>
        </div>
    )
}
