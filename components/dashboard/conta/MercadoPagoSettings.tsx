"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { KeyRound, ExternalLink, Loader2, CheckCircle2, ChevronDown, ListChecks } from "lucide-react"
import { saveMercadoPagoToken } from "@/actions/user/settings"
import { toast } from "sonner"

export function MercadoPagoSettings({ initialToken }: { initialToken?: string | null }) {
    const [token, setToken] = useState(initialToken || "")
    const [isLoading, setIsLoading] = useState(false)

    const handleSave = async () => {
        setIsLoading(true)
        try {
            const result = await saveMercadoPagoToken(token)
            if (result.error) {
                toast.error(result.error)
            } else {
                toast.success(result.message)
            }
        } catch (error) {
            toast.error("Erro inesperado ao salvar.")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Card className="border-primary/20 bg-primary/5">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <div className="size-8 bg-blue-500 rounded-lg flex items-center justify-center">
                        <span className="text-white font-black text-sm">MP</span>
                    </div>
                    Integração Mercado Pago
                </CardTitle>
                <CardDescription>
                    Conecte sua conta do Mercado Pago para receber os pagamentos via PIX diretamente na sua conta. Sem taxas de intermediação da plataforma.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="mpToken">Production Access Token (Token de Produção)</Label>
                    <div className="relative">
                        <KeyRound className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                            id="mpToken"
                            type="password"
                            value={token}
                            onChange={(e) => setToken(e.target.value)}
                            className="pl-10 font-mono text-sm"
                            placeholder="APP_USR-00000000000-000000-00000000000"
                        />
                    </div>
                    <div className="flex items-start justify-between mt-1">
                        <p className="text-xs text-muted-foreground max-w-[80%]">
                            Seu token fica criptografado no nosso banco de dados e só é usado para gerar os pagamentos das Suas Rifas.
                        </p>
                    </div>
                </div>

                <div className="bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-100 dark:border-slate-800 p-4 mt-6">
                    <h4 className="font-semibold text-sm flex items-center gap-2 mb-3 text-slate-800 dark:text-slate-200">
                        <ListChecks className="w-4 h-4 text-primary" />
                        Passo a Passo para obter o Token
                    </h4>

                    <ol className="space-y-3 text-sm text-slate-600 dark:text-slate-400 relative border-l-2 border-slate-200 dark:border-slate-700 ml-2 pl-4">
                        <li className="relative">
                            <span className="absolute -left-[25px] top-0.5 bg-white dark:bg-slate-950 w-5 h-5 rounded-full border-2 border-slate-200 dark:border-slate-700 flex items-center justify-center text-[10px] font-bold">1</span>
                            Acesse o <a href="https://www.mercadopago.com.br/developers/panel/applications" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-semibold">Painel de Desenvolvedor</a> do Mercado Pago e faça login.
                        </li>
                        <li className="relative">
                            <span className="absolute -left-[25px] top-0.5 bg-white dark:bg-slate-950 w-5 h-5 rounded-full border-2 border-slate-200 dark:border-slate-700 flex items-center justify-center text-[10px] font-bold">2</span>
                            Crie uma nova aplicação (Ou selecione uma existente).
                        </li>
                        <li className="relative">
                            <span className="absolute -left-[25px] top-0.5 bg-white dark:bg-slate-950 w-5 h-5 rounded-full border-2 border-slate-200 dark:border-slate-700 flex items-center justify-center text-[10px] font-bold">3</span>
                            No menu lateral esquerdo da sua aplicação, clique em <strong>Credenciais de Produção</strong>.
                        </li>
                        <li className="relative">
                            <span className="absolute -left-[25px] top-0.5 bg-white dark:bg-slate-950 w-5 h-5 rounded-full border-2 border-slate-200 dark:border-slate-700 flex items-center justify-center text-[10px] font-bold">4</span>
                            Copie o código longo chamado <strong>Access Token</strong> (Token de Produção, começa com <code className="bg-slate-200 dark:bg-slate-800 px-1 rounded text-xs select-all">APP_USR-</code>) e cole aqui.
                        </li>
                    </ol>
                </div>

                <div className="pt-4 flex items-center justify-between border-t border-slate-100 dark:border-slate-800 border-dashed mt-6">
                    {initialToken && initialToken !== "" ? (
                        <div className="flex items-center gap-2 text-sm text-emerald-600 dark:text-emerald-500 font-medium">
                            <CheckCircle2 className="h-4 w-4" />
                            Conta Conectada
                        </div>
                    ) : (
                        <div className="text-sm text-muted-foreground">
                            Nenhuma integração ativa.
                        </div>
                    )}

                    <Button onClick={handleSave} disabled={isLoading || (token === initialToken)}>
                        {isLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                        {token === "" ? "Remover Integração" : "Salvar Token"}
                    </Button>
                </div>
            </CardContent>
        </Card>
    )
}
