"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { User, Mail, Smartphone, AlertTriangle } from "lucide-react"
import { updatePersonalData, disconnectGoogle } from "@/actions/user/settings"
import { loginWithGoogle } from "@/actions/auth"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { ProfileAvatar } from "./ProfileAvatar"

interface PersonalDataSettingsProps {
    user: {
        id: string
        name: string
        email: string
        image?: string | null
        whatsapp?: string | null
    }
    isGoogleLinked?: boolean
    hasPassword?: boolean
}

export function PersonalDataSettings({ user, isGoogleLinked = false, hasPassword = false }: PersonalDataSettingsProps) {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)
    const [isDisconnecting, setIsDisconnecting] = useState(false)
    const [formData, setFormData] = useState({
        name: user.name,
        whatsapp: user.whatsapp || ""
    })

    const maskPhone = (value: string) => {
        let digits = value.replace(/\D/g, "")
        if (digits.startsWith("55") && digits.length > 11) {
            digits = digits.slice(2)
        }
        digits = digits.slice(0, 11)

        if (digits.length <= 2) return digits.length ? `(${digits}` : ""
        if (digits.length <= 6) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`
        if (digits.length <= 10) return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`
        return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`
    }

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        try {
            const res = await updatePersonalData(formData)
            if (res.success) {
                router.refresh()
                toast.success(res.message)
            } else {
                toast.error(res.error)
            }
        } catch (error) {
            toast.error("Erro ao atualizar perfil")
        } finally {
            setIsLoading(false)
        }
    }

    const handleDisconnect = async () => {
        if (!hasPassword) {
            toast.error("Você precisa definir uma senha antes de desvincular o Google.", {
                description: "Isso garante que você não perca o acesso à sua conta.",
                icon: <AlertTriangle className="h-5 w-5 text-orange-500" />
            })
            return
        }

        if (!confirm("Tem certeza que deseja desvincular sua conta Google?")) return

        setIsDisconnecting(true)
        try {
            const res = await disconnectGoogle()
            if (res.success) {
                router.refresh()
                toast.success(res.message)
            } else {
                toast.error(res.error)
            }
        } catch (error) {
            toast.error("Erro ao desvincular conta")
        } finally {
            setIsDisconnecting(false)
        }
    }

    return (
        <div className="space-y-6">
            <Card className="border-slate-200/60 dark:border-slate-800/60 bg-white dark:bg-slate-900/50 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.2)] rounded-2xl md:rounded-[2rem] overflow-hidden">
                <CardHeader className="border-b border-slate-100 dark:border-slate-800/50 p-5 md:p-6 bg-slate-50/30 dark:bg-slate-900/30">
                    <div className="flex items-center gap-5">
                        <ProfileAvatar initialImage={user.image} userId={user.id} />
                        <div>
                            <CardTitle className="text-xl font-black tracking-tight italic">Perfil</CardTitle>
                            <CardDescription className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Sincronize seus dados e imagem</CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-5 md:p-6 space-y-6">
                    <form onSubmit={handleUpdate} className="space-y-6">
                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label htmlFor="name" className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Assinatura Pública</Label>
                                <div className="relative group">
                                    <User className="absolute left-4 top-3.5 h-4 w-4 text-slate-400 group-focus-within:text-primary transition-colors" />
                                    <Input
                                        id="name"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="pl-12 h-12 bg-slate-50/50 dark:bg-slate-950/50 border-slate-200 dark:border-slate-800 rounded-xl focus-visible:ring-primary/20 transition-all font-bold text-base"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="email" className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">E-mail de Operação</Label>
                                <div className="relative opacity-60">
                                    <Mail className="absolute left-4 top-3.5 h-4 w-4 text-slate-400" />
                                    <Input
                                        id="email"
                                        defaultValue={user.email}
                                        className="pl-12 h-12 bg-slate-100 dark:bg-slate-900/50 border-slate-200 dark:border-slate-800 rounded-xl cursor-not-allowed font-medium text-sm"
                                        disabled
                                    />
                                </div>
                            </div>
                            <div className="space-y-2 md:col-span-2">
                                <Label htmlFor="whatsapp" className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Linha WhatsApp Business</Label>
                                <div className="relative group">
                                    <Smartphone className="absolute left-4 top-3.5 h-4 w-4 text-slate-400 group-focus-within:text-primary transition-colors" />
                                    <Input
                                        id="whatsapp"
                                        value={formData.whatsapp}
                                        onChange={(e) => setFormData({ ...formData, whatsapp: maskPhone(e.target.value) })}
                                        className="pl-12 h-12 bg-slate-50/50 dark:bg-slate-950/50 border-slate-200 dark:border-slate-800 rounded-xl focus-visible:ring-primary/20 transition-all font-black text-lg"
                                        placeholder="(99) 99999-9999"
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="flex justify-end pt-2">
                            <Button disabled={isLoading} className="h-11 px-6 md:px-8 rounded-xl bg-slate-900 border border-slate-800 hover:bg-slate-800 dark:bg-primary dark:border-none dark:hover:bg-primary/90 font-black tracking-[0.1em] uppercase text-[10px] shadow-lg hover:scale-[1.02] active:scale-95 transition-all w-full md:w-auto">
                                {isLoading ? "Processando..." : "Sincronizar Dados"}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>

            <Card className="border-slate-200/60 dark:border-slate-800/60 bg-white dark:bg-slate-900/50 shadow-sm rounded-2xl md:rounded-[2rem] overflow-hidden">
                <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                        <div className="flex items-center gap-4">
                            <div className={`p-3 rounded-2xl ${isGoogleLinked ? 'bg-emerald-500/10' : 'bg-slate-100 dark:bg-slate-800'}`}>
                                <svg className={`w-6 h-6 ${isGoogleLinked ? 'fill-emerald-500' : 'fill-slate-400'}`} viewBox="0 0 24 24">
                                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                                </svg>
                            </div>
                            <div>
                                <h3 className="font-black text-slate-900 dark:text-white uppercase tracking-tighter italic">Conta Google</h3>
                                <p className="text-xs font-bold text-slate-500 uppercase tracking-widest leading-none mt-1">
                                    {isGoogleLinked ? 'Vinculada com sucesso' : 'Não vinculada'}
                                </p>
                            </div>
                        </div>

                        {isGoogleLinked ? (
                            <div className="flex items-center gap-4">
                                <div className="flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
                                    <div className="size-2 bg-emerald-500 rounded-full animate-pulse" />
                                    <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Sincronizado</span>
                                </div>
                                <Button
                                    onClick={handleDisconnect}
                                    disabled={isDisconnecting}
                                    variant="ghost"
                                    className="h-10 px-4 rounded-xl text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 font-black text-[9px] uppercase tracking-widest transition-all"
                                >
                                    {isDisconnecting ? "Processando..." : "Desvincular"}
                                </Button>
                            </div>
                        ) : (
                            <form action={loginWithGoogle}>
                                <Button type="submit" variant="outline" className="h-12 px-6 rounded-xl border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 font-black text-[10px] uppercase tracking-widest transition-all hover:scale-105 active:scale-95 shadow-sm">
                                    Conectar Agora
                                </Button>
                            </form>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
