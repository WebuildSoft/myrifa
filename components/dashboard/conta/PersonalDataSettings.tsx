"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { User, Mail, Smartphone } from "lucide-react"
import { updatePersonalData } from "@/actions/user/settings"
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
}

export function PersonalDataSettings({ user }: PersonalDataSettingsProps) {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)
    const [formData, setFormData] = useState({
        name: user.name,
        whatsapp: user.whatsapp || ""
    })

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

    return (
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
                                    onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
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
    )
}
