"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { KeyRound, ExternalLink, Loader2, CheckCircle2 } from "lucide-react"
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
                        <a
                            href="https://www.mercadopago.com.br/developers/panel/credentials"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-primary font-bold hover:underline flex items-center gap-1 shrink-0"
                        >
                            Onde pegar? <ExternalLink className="h-3 w-3" />
                        </a>
                    </div>
                </div>

                <div className="pt-2 flex items-center justify-between">
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
