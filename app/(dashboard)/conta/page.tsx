import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { User, Mail, Smartphone } from "lucide-react"
import { MercadoPagoSettings } from "@/components/dashboard/conta/MercadoPagoSettings"

export default async function ContaPage() {
    const session = await auth()
    if (!session?.user?.id) redirect("/login")

    const user = await prisma.user.findUnique({
        where: { id: session.user.id }
    })

    if (!user) redirect("/login")

    return (
        <div className="space-y-6 max-w-2xl mx-auto">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Sua Conta</h1>
                <p className="text-muted-foreground mt-1">
                    Gerencie suas informações pessoais e integrações de pagamentos.
                </p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Dados Pessoais</CardTitle>
                    <CardDescription>Estes dados são usados para identificar você como organizador.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Nome Completo</Label>
                            <div className="relative">
                                <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                <Input id="name" defaultValue={user.name} className="pl-10" />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email">E-mail de Acesso</Label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                <Input id="email" defaultValue={user.email} className="pl-10" disabled />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="whatsapp">WhatsApp</Label>
                            <div className="relative">
                                <Smartphone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                <Input id="whatsapp" defaultValue={user.whatsapp || ""} className="pl-10" placeholder="(99) 99999-9999" />
                            </div>
                        </div>
                    </div>
                    <Button>Salvar Alterações</Button>
                </CardContent>
            </Card>

            <MercadoPagoSettings initialToken={user.mercadoPagoAccessToken} />

            <Card className="border-red-200 bg-red-50/50">
                <CardHeader>
                    <CardTitle className="text-red-600">Área de Perigo</CardTitle>
                    <CardDescription>Ações irreversíveis relacionadas à sua conta.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Button variant="destructive">Excluir Minha Conta</Button>
                </CardContent>
            </Card>
        </div>
    )
}
