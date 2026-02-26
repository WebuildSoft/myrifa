import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { SubmitButton } from "@/components/ui/submit-button"

export default function ResetPasswordPage({
    searchParams
}: {
    searchParams: { token?: string }
}) {
    async function resetPasswordAction(formData: FormData) {
        "use server"
        // TODO: Implement DB update
        console.log("Password reset for token:", searchParams.token)
    }

    if (!searchParams.token) {
        return (
            <Card className="border-0 shadow-lg">
                <CardHeader>
                    <CardTitle className="text-2xl font-bold tracking-tight text-red-500">Token Inválido</CardTitle>
                    <CardDescription>O link de recuperação parece estar quebrado ou expirado.</CardDescription>
                </CardHeader>
                <CardFooter>
                    <Link href="/forgot-password" className="font-semibold text-primary hover:underline">
                        Solicitar novo link
                    </Link>
                </CardFooter>
            </Card>
        )
    }

    return (
        <Card className="border-0 shadow-lg">
            <CardHeader className="space-y-1">
                <CardTitle className="text-2xl font-bold tracking-tight">Nova Senha</CardTitle>
                <CardDescription>
                    Digite sua nova senha abaixo
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form action={resetPasswordAction} className="space-y-4">
                    <input type="hidden" name="token" value={searchParams.token} />

                    <div className="space-y-2">
                        <Label htmlFor="password">Nova Senha</Label>
                        <Input id="password" name="password" type="password" required minLength={8} />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="confirmPassword">Confirmar Nova Senha</Label>
                        <Input id="confirmPassword" name="confirmPassword" type="password" required minLength={8} />
                    </div>

                    <SubmitButton className="w-full">Redefinir Senha</SubmitButton>
                </form>
            </CardContent>
        </Card>
    )
}
