"use server"

import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"
import { revalidatePath } from "next/cache"
import bcrypt from "bcrypt"

export async function saveMercadoPagoToken(token: string) {
    try {
        const session = await auth()

        if (!session?.user?.id) {
            return { error: "Não autorizado." }
        }

        const trimmedToken = token.trim()

        if (!trimmedToken) {
            // Allow clearing the token
            await prisma.user.update({
                where: { id: session.user.id },
                data: { mercadoPagoAccessToken: null }
            })
            revalidatePath('/dashboard/configuracoes')
            return { success: true, message: "Integração removida." }
        }

        // Basic validation: MP Access Tokens usually start with APP_USR- or TEST-
        if (!trimmedToken.startsWith("APP_USR-") && !trimmedToken.startsWith("TEST-")) {
            return { error: "Token inválido. Verifique se copiou corretamente do painel do Mercado Pago." }
        }

        await prisma.user.update({
            where: { id: session.user.id },
            data: { mercadoPagoAccessToken: trimmedToken }
        })

        revalidatePath('/dashboard/configuracoes')
        return { success: true, message: "Token salvo com sucesso!" }

    } catch (error) {
        console.error("Error saving Mercado Pago token:", error)
        return { error: "Ocorreu um erro ao salvar o token. Tente novamente." }
    }
}

export async function saveManualPixSettings({ pixKey, pixQrCodeImage }: { pixKey?: string; pixQrCodeImage?: string }) {
    try {
        const session = await auth()

        if (!session?.user?.id) {
            return { error: "Não autorizado." }
        }

        await prisma.user.update({
            where: { id: session.user.id },
            data: {
                pixKey: pixKey ?? null,
                pixQrCodeImage: pixQrCodeImage ?? null
            }
        })

        revalidatePath('/conta')
        return { success: true, message: "Configurações de PIX manual salvas!" }

    } catch (error) {
        console.error("Error saving Manual PIX settings:", error)
        return { error: "Erro ao salvar configurações de PIX." }
    }
}

export async function updateUserImage(imageUrl: string) {
    try {
        const session = await auth()
        if (!session?.user?.id) return { error: "Não autorizado." }

        await prisma.user.update({
            where: { id: session.user.id },
            data: { image: imageUrl }
        })

        revalidatePath('/conta')
        revalidatePath('/dashboard', 'layout')
        revalidatePath('/', 'layout')
        return { success: true }
    } catch (error) {
        return { error: "Erro ao atualizar imagem." }
    }
}

export async function updateUserPassword(data: { current: string; new: string }) {
    try {
        const session = await auth()
        if (!session?.user?.id) return { error: "Não autorizado." }

        const user = await prisma.user.findUnique({
            where: { id: session.user.id }
        })

        if (!user || !user.password) return { error: "Usuário não encontrado ou senha não definida." }

        const isCorrect = await bcrypt.compare(data.current, user.password)
        if (!isCorrect) return { error: "A senha atual está incorreta." }

        const hashed = await bcrypt.hash(data.new, 10)

        await prisma.user.update({
            where: { id: session.user.id },
            data: { password: hashed }
        })

        revalidatePath('/conta')
        return { success: true, message: "Senha atualizada com sucesso!" }
    } catch (error) {
        console.error("Password update error:", error)
        return { error: "Erro ao atualizar senha." }
    }
}

export async function updatePersonalData(data: { name: string; whatsapp: string }) {
    try {
        const session = await auth()
        if (!session?.user?.id) return { error: "Não autorizado." }

        await prisma.user.update({
            where: { id: session.user.id },
            data: {
                name: data.name,
                whatsapp: data.whatsapp
            }
        })

        revalidatePath('/conta')
        revalidatePath('/dashboard', 'layout')
        revalidatePath('/', 'layout')
        return { success: true, message: "Perfil atualizado com sucesso!" }
    } catch (error) {
        console.error("Profile update error:", error)
        return { error: "Erro ao atualizar perfil." }
    }
}

export async function disconnectGoogle() {
    try {
        const session = await auth()
        if (!session?.user?.id) return { error: "Não autorizado." }

        const user = await prisma.user.findUnique({
            where: { id: session.user.id }
        })

        if (!user) return { error: "Usuário não encontrado." }

        // Security check: Don't allow disconnection if user has no password
        // This prevents the user from being locked out of their account
        if (!user.password) {
            return {
                error: "Você precisa definir uma senha antes de desvincular sua conta Google para não perder o acesso."
            }
        }

        await prisma.account.deleteMany({
            where: {
                userId: session.user.id,
                provider: "google"
            }
        })

        revalidatePath('/conta')
        return { success: true, message: "Conta Google desvinculada com sucesso!" }
    } catch (error) {
        console.error("Google disconnect error:", error)
        return { error: "Erro ao desvincular conta Google." }
    }
}
