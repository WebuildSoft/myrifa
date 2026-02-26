"use server"

import { signIn } from "@/auth"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcrypt"
import { AuthError } from "next-auth"
import { redirect } from "next/navigation"

export async function loginAction(formData: FormData) {
    try {
        await signIn("credentials", {
            ...Object.fromEntries(formData),
            redirectTo: "/dashboard",
        })
    } catch (error) {
        if (error instanceof AuthError) {
            if (error.type === "CredentialsSignin") {
                return redirect("/login?error=Credenciais inválidas!")
            }
            return redirect("/login?error=Algo deu errado!")
        }
        throw error // Required for redirect to work
    }
}

export async function registerAction(formData: FormData) {
    const name = formData.get("name") as string
    const email = formData.get("email") as string
    const whatsapp = formData.get("whatsapp") as string
    const password = formData.get("password") as string

    if (!name || !email || !password) {
        return redirect("/register?error=Preencha todos os campos!")
    }

    if (password.length < 8) {
        return redirect("/register?error=A senha deve ter pelo menos 8 caracteres")
    }

    try {
        const existingUser = await prisma.user.findUnique({ where: { email } })
        if (existingUser) return redirect("/register?error=E-mail já cadastrado!")

        // Hash costs 12 as requested
        const hashedPassword = await bcrypt.hash(password, 12)

        await prisma.user.create({
            data: {
                name,
                email,
                whatsapp,
                password: hashedPassword
            }
        })

        // Automatically log in
        await signIn("credentials", {
            email,
            password,
            redirectTo: "/dashboard",
        })
    } catch (error) {
        if (error instanceof AuthError) {
            return redirect("/login?error=Conta criada, mas erro ao realizar login automático. Tente entrar manualmente.")
        }
        if ((error as any).message?.includes("NEXT_REDIRECT")) throw error
        return redirect("/register?error=Erro ao criar conta. Tente novamente.")
    }
}

export async function loginWithGoogle() {
    await signIn("google", { redirectTo: "/dashboard" })
}
