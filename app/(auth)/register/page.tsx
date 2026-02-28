import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { registerAction, loginWithGoogle } from "@/actions/auth"
import Link from "next/link"
import { SubmitButton } from "@/components/ui/submit-button"
import { User, Mail, Smartphone, Lock, ShieldCheck, Eye, Gift, CheckCircle2 } from "lucide-react"

export default async function RegisterPage({
    searchParams,
}: {
    searchParams: Promise<{ error?: string }>
}) {
    const { error } = await searchParams

    return (
        <div className="space-y-6">
            <div className="space-y-2">
                <div className="flex items-center gap-2 mb-1">
                    <div className="bg-purple-100 dark:bg-purple-900/30 p-1.5 rounded-lg">
                        <Gift className="h-4 w-4 text-primary" />
                    </div>
                    <span className="text-[10px] font-bold text-primary uppercase tracking-widest">Cadastro Gratuito</span>
                </div>
                <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">Criar Conta</h2>
                <p className="text-slate-500 dark:text-slate-400 font-medium">
                    Preencha seus dados para começar a criar suas campanhas hoje.
                </p>
            </div>

            <div className="space-y-4">
                <form action={registerAction} className="space-y-4">
                    {/* Full Name */}
                    <div className="space-y-1.5">
                        <Label htmlFor="name" className="text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">Nome Completo</Label>
                        <div className="relative group">
                            <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-primary transition-colors" />
                            <Input
                                id="name"
                                name="name"
                                placeholder="João da Silva"
                                required
                                minLength={3}
                                className="h-12 pl-12 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl focus-visible:ring-2 focus-visible:ring-primary text-slate-900 dark:text-slate-100 placeholder:text-slate-400 transition-all font-medium"
                            />
                        </div>
                    </div>

                    {/* Email */}
                    <div className="space-y-1.5">
                        <Label htmlFor="email" className="text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">E-mail</Label>
                        <div className="relative group">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-primary transition-colors" />
                            <Input
                                id="email"
                                name="email"
                                type="email"
                                placeholder="exemplo@email.com"
                                required
                                className="h-12 pl-12 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl focus-visible:ring-2 focus-visible:ring-primary text-slate-900 dark:text-slate-100 placeholder:text-slate-400 transition-all font-medium"
                            />
                        </div>
                    </div>

                    {/* WhatsApp */}
                    <div className="space-y-1.5">
                        <Label htmlFor="whatsapp" className="text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">WhatsApp</Label>
                        <div className="relative group">
                            <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center gap-2 pr-2 border-r border-slate-200 dark:border-slate-700">
                                <span className="text-sm font-bold text-slate-500">BR</span>
                            </div>
                            <Smartphone className="absolute left-14 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-primary transition-colors" />
                            <Input
                                id="whatsapp"
                                name="whatsapp"
                                placeholder="(99) 99999-9999"
                                required
                                className="h-12 pl-24 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl focus-visible:ring-2 focus-visible:ring-primary text-slate-900 dark:text-slate-100 placeholder:text-slate-400 transition-all font-medium"
                            />
                        </div>
                    </div>

                    {/* Password */}
                    <div className="space-y-1.5">
                        <Label htmlFor="password" className="text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">Senha</Label>
                        <div className="relative group">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-primary transition-colors" />
                            <Input
                                id="password"
                                name="password"
                                type="password"
                                placeholder="••••••••"
                                required
                                minLength={8}
                                className="h-12 pl-12 pr-12 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl focus-visible:ring-2 focus-visible:ring-primary text-slate-900 dark:text-slate-100 transition-all font-medium"
                            />
                            <button type="button" className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-primary transition-colors">
                                <Eye className="h-5 w-5" />
                            </button>
                        </div>
                        {/* Password Strength */}
                        <div className="flex gap-1.5 px-1 mt-2">
                            <div className="h-1.5 flex-1 rounded-full bg-primary/20"></div>
                            <div className="h-1.5 flex-1 rounded-full bg-primary/10"></div>
                            <div className="h-1.5 flex-1 rounded-full bg-slate-100 dark:bg-slate-800"></div>
                            <div className="h-1.5 flex-1 rounded-full bg-slate-100 dark:bg-slate-800"></div>
                        </div>
                    </div>

                    {/* Terms */}
                    <div className="flex items-start gap-3 py-2 px-1">
                        <input
                            type="checkbox"
                            id="terms"
                            name="terms"
                            required
                            className="mt-1 rounded-lg border-slate-300 dark:border-slate-700 text-primary focus:ring-primary h-4 w-4 bg-slate-50 dark:bg-slate-800"
                        />
                        <Label htmlFor="terms" className="text-xs text-slate-500 dark:text-slate-400 leading-snug cursor-pointer font-medium">
                            Li e aceito os <Link href="#" className="font-bold text-primary hover:underline">Termos de Uso</Link> e <Link href="#" className="font-bold text-primary hover:underline">Política de Privacidade</Link>
                        </Label>
                    </div>

                    {error && (
                        <div className="text-sm text-red-500 font-bold bg-red-50 dark:bg-red-900/10 p-3 rounded-xl border border-red-100 dark:border-red-900/20">
                            {error}
                        </div>
                    )}

                    <SubmitButton className="w-full h-12 bg-primary hover:bg-primary/90 text-white font-bold rounded-2xl shadow-lg shadow-primary/25 transition-all mt-2 hover:scale-[1.02] active:scale-95">
                        Criar Minha Conta
                    </SubmitButton>
                </form>

                <div className="relative flex py-2 items-center">
                    <div className="flex-grow border-t border-slate-100 dark:border-slate-800"></div>
                    <span className="flex-shrink mx-4 text-slate-400 text-[10px] font-bold uppercase tracking-widest">ou continue com</span>
                    <div className="flex-grow border-t border-slate-100 dark:border-slate-800"></div>
                </div>

                <form action={loginWithGoogle}>
                    <button type="submit" className="w-full flex items-center justify-center gap-3 h-12 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-800 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-750 transition-all text-slate-700 dark:text-slate-200 font-bold shadow-sm">
                        <svg className="w-5 h-5" viewBox="0 0 24 24">
                            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                        </svg>
                        Criar com Google
                    </button>
                </form>
            </div>

            <p className="text-center text-xs font-semibold text-slate-400 pt-2">
                Já tem uma conta?{" "}
                <Link href="/login" className="text-primary hover:underline">
                    Entrar agora
                </Link>
            </p>
        </div>
    )
}
