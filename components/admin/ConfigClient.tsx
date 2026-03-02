"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Save, Key, Globe, Shield } from "lucide-react"

export default function ConfigClient() {
    return (
        <div className="space-y-8 pb-12">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-4xl font-black tracking-tight text-white mb-2">
                        Configurações
                    </h1>
                    <p className="text-slate-400 text-sm font-medium flex items-center">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mr-2 shadow-[0_0_8px_rgba(245,158,11,0.5)]" />
                        Gerencie chaves de API, integradores e preferências globais.
                    </p>
                </div>
            </div>

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                {/* Evolution API Config */}
                <Card className="border-white/[0.05] bg-white/[0.02] backdrop-blur-md shadow-2xl flex flex-col">
                    <CardHeader className="border-b border-white/[0.05] bg-white/[0.01] p-6">
                        <div className="flex items-center space-x-3">
                            <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/20">
                                <Key className="h-5 w-5 text-amber-500" />
                            </div>
                            <div>
                                <CardTitle className="text-lg font-bold text-white uppercase tracking-tight">WhatsApp</CardTitle>
                                <CardDescription className="text-slate-500 text-[10px] font-black uppercase tracking-widest">Evolution API</CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="p-6 space-y-6 flex-1">
                        <div className="space-y-2">
                            <Label htmlFor="api_url" className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">API URL</Label>
                            <Input id="api_url" placeholder="https://api.seusite.com" className="bg-white/[0.03] border-white/[0.05] rounded-xl text-white h-11 focus:ring-amber-500/20" defaultValue={process.env.NEXT_PUBLIC_EVOLUTION_API_URL} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="api_key" className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Global API Key</Label>
                            <Input id="api_key" type="password" placeholder="••••••••••••••••" className="bg-white/[0.03] border-white/[0.05] rounded-xl text-white h-11 focus:ring-amber-500/20" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="instance" className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Instância Padrão</Label>
                            <Input id="instance" placeholder="Main" className="bg-white/[0.03] border-white/[0.05] rounded-xl text-white h-11 focus:ring-amber-500/20" />
                        </div>
                    </CardContent>
                    <div className="p-6 pt-0 mt-auto">
                        <Button className="w-full bg-white/[0.05] hover:bg-white/[0.1] text-white border border-white/10 rounded-xl h-11 font-bold text-xs uppercase tracking-widest transition-all">
                            Testar Conexão
                        </Button>
                    </div>
                </Card>

                {/* System Toggles */}
                <Card className="border-white/[0.05] bg-white/[0.02] backdrop-blur-md shadow-2xl">
                    <CardHeader className="border-b border-white/[0.05] bg-white/[0.01] p-6">
                        <div className="flex items-center space-x-3">
                            <div className="p-2 rounded-xl bg-blue-500/10 border border-blue-500/20">
                                <Globe className="h-5 w-5 text-blue-500" />
                            </div>
                            <div>
                                <CardTitle className="text-lg font-bold text-white uppercase tracking-tight">Plataforma</CardTitle>
                                <CardDescription className="text-slate-500 text-[10px] font-black uppercase tracking-widest">Preferências Globais</CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="p-6 space-y-6">
                        {[
                            { label: "Modo Manutenção", desc: "Bloqueia o acesso de usuários ao site.", checked: false },
                            { label: "Novos Cadastros", desc: "Permitir que novos usuários se registrem.", checked: true },
                            { label: "Notificações WhatsApp", desc: "Enviar avisos automáticos de reserva.", checked: true },
                            { label: "Auditoria Estrita", desc: "Logs de todas as leituras (VIEW).", checked: false },
                        ].map((item, idx) => (
                            <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-white/[0.03] hover:bg-white/[0.04] transition-colors group">
                                <div className="space-y-0.5 min-w-0 pr-4">
                                    <Label className="text-sm font-bold text-slate-200 block group-hover:text-blue-400 transition-colors uppercase tracking-tight">{item.label}</Label>
                                    <p className="text-[10px] text-slate-500 font-medium italic group-hover:text-slate-400 transition-colors">{item.desc}</p>
                                </div>
                                <Switch defaultChecked={item.checked} className="data-[state=checked]:bg-blue-500" />
                            </div>
                        ))}
                    </CardContent>
                </Card>

                {/* Security Settings */}
                <Card className="border-white/[0.05] bg-white/[0.02] backdrop-blur-md shadow-2xl flex flex-col">
                    <CardHeader className="border-b border-white/[0.05] bg-white/[0.01] p-6">
                        <div className="flex items-center space-x-3">
                            <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                                <Shield className="h-5 w-5 text-emerald-500" />
                            </div>
                            <div>
                                <CardTitle className="text-lg font-bold text-white uppercase tracking-tight">Segurança</CardTitle>
                                <CardDescription className="text-slate-500 text-[10px] font-black uppercase tracking-widest">Políticas Administrativas</CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="p-6 space-y-6 flex-1">
                        <div className="space-y-2">
                            <Label className="text-[10px) font-black uppercase tracking-widest text-slate-400 ml-1">Tempo de Sessão (Horas)</Label>
                            <Input type="number" defaultValue={24} className="bg-white/[0.03] border-white/[0.05] rounded-xl text-white h-11 focus:ring-emerald-500/20" />
                        </div>
                        <div className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-white/[0.03] hover:bg-white/[0.04] transition-colors group">
                            <div className="space-y-0.5">
                                <Label className="text-sm font-bold text-slate-200 group-hover:text-emerald-400 transition-colors uppercase tracking-tight">Forçar 2FA</Label>
                                <p className="text-[10px] text-slate-500 group-hover:text-slate-400 transition-colors italic">Exigir TOTP para todos os admins.</p>
                            </div>
                            <Switch className="data-[state=checked]:bg-emerald-500" />
                        </div>
                    </CardContent>
                    <div className="p-6 pt-0 mt-auto">
                        <Button variant="outline" className="w-full border-white/10 bg-white/[0.02] hover:bg-white/[0.05] text-white rounded-xl h-11 font-bold text-[10px] uppercase tracking-widest transition-all">
                            Revisar Logs de Segurança
                        </Button>
                    </div>
                </Card>
            </div>

            <div className="flex justify-end pt-4">
                <Button className="rounded-xl bg-gradient-to-r from-indigo-500 to-violet-500 hover:from-indigo-600 hover:to-violet-600 text-white shadow-xl shadow-indigo-500/20 transition-all py-6 h-auto font-black text-xs uppercase tracking-widest px-10">
                    <Save className="mr-2 h-4 w-4" />
                    Salvar Todas as Configurações
                </Button>
            </div>
        </div>
    )
}
