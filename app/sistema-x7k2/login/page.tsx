"use client"

import { useState } from "react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, Lock, User, ShieldCheck } from "lucide-react"

export default function AdminLoginPage() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const router = useRouter()

    async function onSubmit(e: React.FormEvent) {
        e.preventDefault()
        setIsLoading(true)
        setError(null)

        try {
            const result = await signIn("credentials", {
                email,
                password,
                redirect: false,
            })

            if (result?.error) {
                if (result.error.includes("Muitas tentativas")) {
                    setError("Muitas tentativas falhas. Sua conta está bloqueada temporariamente.")
                } else {
                    setError("Credenciais inválidas. Tente novamente.")
                }
            } else {
                router.push("/sistema-x7k2/dashboard")
            }
        } catch (err) {
            setError("Ocorreu um erro ao tentar entrar. Tente novamente mais tarde.")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="relative min-h-screen w-full flex items-center justify-center p-6 bg-[#020617] overflow-hidden font-sans">
            {/* Immersive Background */}
            <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-500/20 blur-[120px] animate-pulse" />
                <div className="absolute bottom-[-10%] right-[-20%] w-[60%] h-[60%] rounded-full bg-violet-600/10 blur-[150px]" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[100%] h-[100%] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 contrast-150 brightness-150" />
            </div>

            <Card className="relative z-10 w-full max-w-[440px] border-white/[0.08] bg-white/[0.03] backdrop-blur-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden scale-in-center">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 via-violet-500 to-indigo-500" />

                <CardHeader className="space-y-4 pt-10 pb-8 text-center">
                    <div className="flex justify-center">
                        <div className="relative group">
                            <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-indigo-500 to-violet-600 opacity-50 blur group-hover:opacity-75 transition duration-500" />
                            <div className="relative p-3.5 rounded-2xl bg-[#0f172a] border border-white/10 group-hover:scale-105 transition-transform duration-300">
                                <ShieldCheck className="h-8 w-8 text-white" />
                            </div>
                        </div>
                    </div>
                    <div className="space-y-1">
                        <CardTitle className="text-3xl font-black tracking-tight text-white uppercase italic">
                            Área <span className="text-indigo-400">Restrita</span>
                        </CardTitle>
                        <CardDescription className="text-slate-400 text-sm font-medium">
                            Acesso exclusivo para administradores autorizados.
                        </CardDescription>
                    </div>
                </CardHeader>

                <form onSubmit={onSubmit} className="pb-4">
                    <CardContent className="space-y-6 px-8">
                        {error && (
                            <div className="animate-in slide-in-from-top-2 duration-300">
                                <Alert className="bg-red-500/10 border-red-500/20 text-red-400 rounded-xl">
                                    <AlertDescription className="text-xs font-bold leading-relaxed">{error}</AlertDescription>
                                </Alert>
                            </div>
                        )}

                        <div className="space-y-2">
                            <Label htmlFor="email" className="text-[10px] font-bold uppercase tracking-widest text-slate-500 ml-1">E-mail Corporativo</Label>
                            <div className="relative group">
                                <User className="absolute left-4 top-3 h-5 w-5 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="admin@rifaonline.com"
                                    className="h-12 pl-12 bg-white/[0.03] border-white/[0.08] rounded-xl text-white placeholder:text-slate-600 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500/40 transition-all"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    autoComplete="off"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="password" className="text-[10px] font-bold uppercase tracking-widest text-slate-500 ml-1">Senha de Acesso</Label>
                            <div className="relative group">
                                <Lock className="absolute left-4 top-3 h-5 w-5 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
                                <Input
                                    id="password"
                                    type="password"
                                    placeholder="••••••••••••"
                                    className="h-12 pl-12 bg-white/[0.03] border-white/[0.08] rounded-xl text-white placeholder:text-slate-600 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500/40 transition-all"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    autoComplete="off"
                                />
                            </div>
                        </div>
                    </CardContent>

                    <CardFooter className="px-8 pt-4 pb-10">
                        <Button
                            type="submit"
                            className="w-full h-14 bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700 text-white font-bold text-sm uppercase tracking-widest rounded-xl shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/40 active:scale-[0.98] transition-all disabled:opacity-50"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <div className="flex items-center">
                                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                    Validando...
                                </div>
                            ) : (
                                "Autenticação Segura"
                            )}
                        </Button>
                    </CardFooter>
                </form>
            </Card>

            <div className="absolute bottom-8 text-[10px] font-bold text-slate-600 uppercase tracking-[0.3em]">
                Secure System Encryption Enabled
            </div>

            <style jsx global>{`
                @keyframes scale-in-center {
                    0% { transform: scale(0.95); opacity: 0; }
                    100% { transform: scale(1); opacity: 1; }
                }
                .scale-in-center { animation: scale-in-center 0.6s cubic-bezier(0.250, 0.460, 0.450, 0.940) both; }
            `}</style>
        </div>
    )
}
