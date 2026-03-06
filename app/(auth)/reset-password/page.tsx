"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AlertCircle, CheckCircle2, Lock, ArrowRight } from "lucide-react"
import { Suspense } from "react"
import { resetPasswordAction } from "@/actions/user/password-recovery"

function ResetPasswordContent() {
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")
    const [success, setSuccess] = useState(false)

    const router = useRouter()
    const searchParams = useSearchParams()
    const token = searchParams.get("token")

    const handleReset = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!token) {
            setError("Token de recuperação ausente.")
            return
        }

        setLoading(true)
        setError("")

        const formData = new FormData()
        formData.append("password", password)
        formData.append("confirmPassword", confirmPassword)

        const res = await resetPasswordAction(token, formData)

        if (res.error) {
            setError(res.error)
            setLoading(false)
        } else {
            setSuccess(true)
            setLoading(false)
            // Redirect after a short delay
            setTimeout(() => {
                router.push("/login")
            }, 3000)
        }
    }

    if (!token) {
        return (
            <Card className="border-0 shadow-lg animate-in fade-in slide-in-from-bottom-4 duration-500">
                <CardHeader>
                    <div className="size-12 bg-red-100 dark:bg-red-900/40 text-red-600 rounded-xl flex items-center justify-center mb-2">
                        <AlertCircle className="h-6 w-6" />
                    </div>
                    <CardTitle className="text-2xl font-bold tracking-tight">Vínculo Inválido</CardTitle>
                    <CardDescription>O link de recuperação parece estar incompleto ou expirado.</CardDescription>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                        Links de recuperação de senha têm validade curta por motivos de segurança.
                        Por favor, solicite um novo link.
                    </p>
                </CardContent>
                <CardFooter>
                    <Button asChild variant="outline" className="w-full h-12 rounded-xl border-slate-200 dark:border-slate-800">
                        <Link href="/forgot-password">Solicitar novo link</Link>
                    </Button>
                </CardFooter>
            </Card>
        )
    }

    if (success) {
        return (
            <Card className="border-0 shadow-lg animate-in zoom-in-95 duration-500">
                <CardContent className="pt-10 pb-10 text-center space-y-4">
                    <div className="size-16 bg-emerald-500/10 text-emerald-500 rounded-full flex items-center justify-center mx-auto">
                        <CheckCircle2 className="h-10 w-10" />
                    </div>
                    <div className="space-y-2">
                        <h3 className="text-2xl font-bold">Senha Alterada!</h3>
                        <p className="text-sm text-slate-500">
                            Sua nova senha foi definida com sucesso. <br />
                            Você será redirecionado para o login em instantes...
                        </p>
                    </div>
                    <Button asChild className="w-full h-12 rounded-xl font-bold bg-emerald-600 hover:bg-emerald-700">
                        <Link href="/login">Entrar Agora</Link>
                    </Button>
                </CardContent>
            </Card>
        )
    }

    return (
        <Card className="border-0 shadow-lg animate-in fade-in slide-in-from-bottom-4 duration-500">
            <CardHeader className="space-y-1">
                <div className="size-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center mb-2">
                    <Lock className="h-6 w-6" />
                </div>
                <CardTitle className="text-2xl font-bold tracking-tight">Nova Senha</CardTitle>
                <CardDescription>
                    Crie uma senha forte para proteger sua conta
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleReset} className="space-y-4">
                    {error && (
                        <div className="p-3 bg-red-50 text-red-600 rounded-xl border border-red-100 flex items-center gap-2 text-sm font-medium animate-in shake duration-300">
                            <AlertCircle className="h-4 w-4" />
                            {error}
                        </div>
                    )}

                    <div className="space-y-2">
                        <Label htmlFor="password">Nova Senha</Label>
                        <Input
                            id="password"
                            name="password"
                            type="password"
                            placeholder="••••••••"
                            required
                            minLength={8}
                            className="h-12 rounded-xl"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="confirmPassword">Confirmar Nova Senha</Label>
                        <Input
                            id="confirmPassword"
                            name="confirmPassword"
                            type="password"
                            placeholder="••••••••"
                            required
                            minLength={8}
                            className="h-12 rounded-xl"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                    </div>

                    <Button type="submit" className="w-full h-12 rounded-xl font-bold gap-2" disabled={loading}>
                        {loading ? "Redefinindo..." : "Redefinir Senha"}
                        {!loading && <ArrowRight className="h-4 w-4" />}
                    </Button>
                </form>
            </CardContent>
        </Card>
    )
}

function ResetPasswordFallback() {
    return (
        <Card className="border-0 shadow-lg animate-pulse opacity-50">
            <CardHeader className="space-y-1">
                <div className="size-12 bg-slate-200 rounded-xl mb-2" />
                <div className="h-8 bg-slate-200 rounded w-1/2" />
                <div className="h-4 bg-slate-200 rounded w-3/4" />
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2">
                    <div className="h-4 bg-slate-200 rounded w-1/4" />
                    <div className="h-12 bg-slate-200 rounded-xl" />
                </div>
                <div className="space-y-2">
                    <div className="h-4 bg-slate-200 rounded w-1/4" />
                    <div className="h-12 bg-slate-200 rounded-xl" />
                </div>
                <div className="h-12 bg-slate-200 rounded-xl" />
            </CardContent>
        </Card>
    )
}

export default function ResetPasswordPage() {
    return (
        <Suspense fallback={<ResetPasswordFallback />}>
            <ResetPasswordContent />
        </Suspense>
    )
}
