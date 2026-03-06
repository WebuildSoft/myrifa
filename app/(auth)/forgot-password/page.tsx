"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AlertCircle, CheckCircle2, Mail, MessageSquare, ArrowLeft } from "lucide-react"
import { requestPasswordResetAction, sendResetWhatsAppAction } from "@/actions/user/password-recovery"

export default function ForgotPasswordPage() {
    const [step, setStep] = useState(1)
    const [email, setEmail] = useState("")
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")
    const [recoveryInfo, setRecoveryInfo] = useState<{ hasWhatsApp: boolean, whatsappNumber: string | null, resetToken: string } | null>(null)

    const handleRequest = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError("")

        const res = await requestPasswordResetAction(email)

        if (res.error) {
            setError(res.error)
            setLoading(false)
            return
        }

        if (res.success) {
            if (res.isSimulated) {
                setStep(3)
                // We keep recoveryInfo null so nothing happens on step 3 for simulated success
                setError("")
                setLoading(false)
                return
            }

            if (res.resetToken) {
                setRecoveryInfo({
                    hasWhatsApp: res.hasWhatsApp,
                    whatsappNumber: res.whatsappNumber || null,
                    resetToken: res.resetToken
                })
                setStep(2)
            }
        }
        setLoading(false)
    }

    const handleSendWhatsApp = async () => {
        if (!recoveryInfo?.whatsappNumber || !recoveryInfo?.resetToken) return
        setLoading(true)
        const res = await sendResetWhatsAppAction(recoveryInfo.whatsappNumber, recoveryInfo.resetToken)
        if (res.error) {
            setError(res.error)
            setLoading(false)
        } else {
            setStep(3)
        }
    }

    return (
        <Card className="border-0 shadow-lg animate-in fade-in slide-in-from-bottom-4 duration-500">
            <CardHeader className="space-y-1">
                <div className="flex items-center gap-2 mb-2">
                    {step > 1 && (
                        <button onClick={() => setStep(step - 1)} className="hover:text-primary transition-colors">
                            <ArrowLeft className="h-5 w-5" />
                        </button>
                    )}
                    <CardTitle className="text-2xl font-bold tracking-tight">Recuperar Senha</CardTitle>
                </div>
                <CardDescription>
                    {step === 1 && "Digite seu e-mail para receber um link de redefinição de senha"}
                    {step === 2 && "Como você prefere receber o seu link de recuperação?"}
                    {step === 3 && "Tudo pronto! Verifique seu WhatsApp"}
                </CardDescription>
            </CardHeader>
            <CardContent>
                {error && (
                    <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-xl border border-red-100 flex items-center gap-2 text-sm font-medium animate-in shake duration-300">
                        <AlertCircle className="h-4 w-4" />
                        {error}
                    </div>
                )}

                {step === 1 && (
                    <form onSubmit={handleRequest} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="email">E-mail de cadastro</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="exemplo@gmail.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="h-12 rounded-xl"
                            />
                        </div>
                        <Button className="w-full h-12 rounded-xl font-bold" disabled={loading}>
                            {loading ? "Verificando..." : "Continuar"}
                        </Button>
                    </form>
                )}

                {step === 2 && recoveryInfo && (
                    <div className="space-y-3">
                        {recoveryInfo.hasWhatsApp && (
                            <Button
                                onClick={handleSendWhatsApp}
                                className="w-full h-16 rounded-2xl flex items-center justify-start gap-4 bg-emerald-600 hover:bg-emerald-700 text-white border-0"
                                disabled={loading}
                            >
                                <div className="size-10 bg-white/20 rounded-xl flex items-center justify-center">
                                    <MessageSquare className="h-6 w-6" />
                                </div>
                                <div className="text-left">
                                    <p className="font-bold text-sm">Via WhatsApp</p>
                                    <p className="text-[10px] opacity-80 uppercase tracking-widest font-black">Enviar para seu celular</p>
                                </div>
                            </Button>
                        )}

                        <div className="relative py-2">
                            <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-slate-100 dark:border-slate-800" /></div>
                            <div className="relative flex justify-center text-[10px] uppercase font-bold text-slate-400"><span className="bg-white dark:bg-slate-900 px-2 italic">ou também por</span></div>
                        </div>

                        <Button
                            variant="outline"
                            className="w-full h-16 rounded-2xl flex items-center justify-start gap-4 border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900"
                            onClick={() => {
                                // For now we keep it simple, email is already supported (TODO in future if Resend is needed)
                                setError("A recuperação por e-mail será ativada em breve. Utilize o WhatsApp por enquanto.")
                            }}
                        >
                            <div className="size-10 bg-primary/10 text-primary rounded-xl flex items-center justify-center">
                                <Mail className="h-6 w-6" />
                            </div>
                            <div className="text-left">
                                <p className="font-bold text-sm text-slate-900 dark:text-white">Via E-mail</p>
                                <p className="text-[10px] text-slate-400 uppercase tracking-widest font-black italic">Aguardando implementação</p>
                            </div>
                        </Button>
                    </div>
                )}

                {step === 3 && (
                    <div className="text-center space-y-4 py-4 animate-in zoom-in-95 duration-500">
                        <div className="size-16 bg-emerald-500/10 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-2">
                            <CheckCircle2 className="h-10 w-10" />
                        </div>
                        <div className="space-y-1">
                            <h3 className="text-lg font-bold">Link enviado!</h3>
                            <p className="text-sm text-slate-500">Enviamos instruções de redefinição para o seu WhatsApp cadastrado.</p>
                        </div>
                        <Button asChild className="w-full h-12 rounded-xl font-bold bg-emerald-600 hover:bg-emerald-700">
                            <Link href="/login">Ir para o Login</Link>
                        </Button>
                    </div>
                )}
            </CardContent>
            {step < 3 && (
                <CardFooter>
                    <div className="text-sm text-center text-muted-foreground w-full font-medium">
                        Lembrou sua senha?{" "}
                        <Link href="/login" className="font-bold text-primary hover:underline">
                            Voltar para o login
                        </Link>
                    </div>
                </CardFooter>
            )}
        </Card>
    )
}
