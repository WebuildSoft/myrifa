"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Lock, ShieldCheck, ShieldAlert, KeyRound } from "lucide-react"
import { toast } from "sonner"

import { updateUserPassword } from "@/actions/user/settings"

interface PasswordSettingsProps {
    totpEnabled: boolean
}

export function PasswordSettings({ totpEnabled }: PasswordSettingsProps) {
    const [isLoading, setIsLoading] = useState(false)
    const [passwords, setPasswords] = useState({ current: "", new: "", confirm: "" })

    const handleUpdatePassword = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!passwords.current || !passwords.new) {
            return toast.error("Preencha todos os campos obrigatórios.")
        }

        if (passwords.new !== passwords.confirm) {
            return toast.error("As novas senhas não coincidem.")
        }

        setIsLoading(true)
        try {
            const res = await updateUserPassword({ current: passwords.current, new: passwords.new })
            if (res.success) {
                toast.success(res.message)
                setPasswords({ current: "", new: "", confirm: "" })
            } else {
                toast.error(res.error)
            }
        } catch (error) {
            toast.error("Ocorreu um erro inesperado.")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Card className="border-slate-200/60 dark:border-slate-800/60 bg-white dark:bg-slate-900/50 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.2)] rounded-2xl md:rounded-[2rem] overflow-hidden">
            <CardHeader className="border-b border-slate-100 dark:border-slate-800/50 p-5 md:p-6 pb-4 bg-slate-50/30 dark:bg-slate-900/30">
                <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
                        <Lock className="size-4 text-slate-900 dark:text-slate-100" />
                    </div>
                    <div>
                        <CardTitle className="text-xl font-black tracking-tight italic">Segurança</CardTitle>
                        <CardDescription className="text-[10px] font-black uppercase tracking-widest text-slate-500">Proteção de acesso à conta</CardDescription>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="p-5 md:p-6 space-y-8">
                <form onSubmit={handleUpdatePassword} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label htmlFor="current_password" className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Validação de Acesso</Label>
                            <div className="relative group">
                                <KeyRound className="absolute left-4 top-3.5 h-4 w-4 text-slate-400 group-focus-within:text-primary transition-colors" />
                                <Input
                                    id="current_password"
                                    type="password"
                                    value={passwords.current}
                                    onChange={(e) => setPasswords({ ...passwords, current: e.target.value })}
                                    className="pl-12 h-12 bg-slate-50/50 dark:bg-slate-950/50 border-slate-200 dark:border-slate-800 rounded-xl focus-visible:ring-primary/20 transition-all font-mono text-sm"
                                    placeholder="Senha Atual"
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="new_password" className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Nova Credencial</Label>
                            <div className="relative group">
                                <Lock className="absolute left-4 top-3.5 h-4 w-4 text-slate-400 group-focus-within:text-primary transition-colors" />
                                <Input
                                    id="new_password"
                                    type="password"
                                    value={passwords.new}
                                    onChange={(e) => setPasswords({ ...passwords, new: e.target.value })}
                                    className="pl-12 h-12 bg-slate-50/50 dark:bg-slate-950/50 border-slate-200 dark:border-slate-800 rounded-xl focus-visible:ring-primary/20 transition-all font-mono text-sm"
                                    placeholder="Nova Senha"
                                />
                            </div>
                        </div>
                        <div className="space-y-2 md:col-span-2">
                            <Label htmlFor="confirm_password" className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Confirmar Blindagem</Label>
                            <div className="relative group">
                                <ShieldCheck className="absolute left-4 top-3.5 h-4 w-4 text-slate-400 group-focus-within:text-primary transition-colors" />
                                <Input
                                    id="confirm_password"
                                    type="password"
                                    value={passwords.confirm}
                                    onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })}
                                    className="pl-12 h-12 bg-slate-50/50 dark:bg-slate-950/50 border-slate-200 dark:border-slate-800 rounded-xl focus-visible:ring-primary/20 transition-all font-mono text-sm"
                                    placeholder="Confirmar Nova Senha"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/50 border border-slate-100 dark:border-slate-800">
                        <div className="flex items-start gap-3">
                            <div className={`p-2 rounded-xl border ${totpEnabled ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500' : 'bg-amber-500/10 border-amber-500/20 text-amber-500'}`}>
                                {totpEnabled ? <ShieldCheck className="size-4" /> : <ShieldAlert className="size-4" />}
                            </div>
                            <div>
                                <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-0.5">Autenticação 2FA</p>
                                <p className="text-xs font-bold text-slate-900 dark:text-slate-100">
                                    {totpEnabled ? "Blindagem Ativa" : "Sua conta está vulnerável"}
                                </p>
                            </div>
                        </div>
                        <Button type="button" variant="outline" className="rounded-xl h-10 px-4 font-black text-[9px] uppercase tracking-widest transition-all">
                            {totpEnabled ? "Configurar" : "Ativar"}
                        </Button>
                    </div>

                    <div className="flex justify-end pt-2">
                        <Button disabled={isLoading} className="h-11 px-6 md:px-8 rounded-xl bg-slate-900 border border-slate-800 hover:bg-slate-800 dark:bg-primary dark:border-none dark:hover:bg-primary/90 font-black tracking-[0.1em] uppercase text-[10px] shadow-lg transition-all w-full md:w-auto">
                            {isLoading ? "Processando..." : "Alterar Senha"}
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    )
}
