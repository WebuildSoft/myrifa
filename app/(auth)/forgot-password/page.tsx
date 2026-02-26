import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { SubmitButton } from "@/components/ui/submit-button"

export default function ForgotPasswordPage() {
    // We'll implement the actual email sending via Resend in the future
    async function forgotPasswordAction(formData: FormData) {
        "use server"
        // TODO: Implement Resend email
        console.log("Recovery email requested for:", formData.get("email"))
    }

    return (
        <Card className="border-0 shadow-lg">
            <CardHeader className="space-y-1">
                <CardTitle className="text-2xl font-bold tracking-tight">Recuperar Senha</CardTitle>
                <CardDescription>
                    Digite seu e-mail para receber um link de redefinição de senha
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form action={forgotPasswordAction} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="email">E-mail</Label>
                        <Input id="email" name="email" type="email" placeholder="m@exemplo.com" required />
                    </div>

                    <SubmitButton className="w-full">Enviar link de recuperação</SubmitButton>
                </form>
            </CardContent>
            <CardFooter>
                <div className="text-sm text-center text-muted-foreground w-full">
                    Lembrou sua senha?{" "}
                    <Link href="/login" className="font-semibold text-primary hover:underline">
                        Voltar para o login
                    </Link>
                </div>
            </CardFooter>
        </Card>
    )
}
