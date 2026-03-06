"use server"

import { prisma } from "@/lib/prisma"
import { sendWhatsAppMessage } from "@/lib/evolution"
import bcrypt from "bcrypt"
import crypto from "crypto"

export async function requestPasswordResetAction(email: string) {
    try {
        const user = await prisma.user.findUnique({
            where: { email }
        })

        if (!user) {
            return { error: "E-mail não encontrado." }
        }

        // Generate secure token
        const resetToken = crypto.randomBytes(32).toString('hex')
        const resetTokenExpires = new Date(Date.now() + 3600000) // 1 hour

        await prisma.user.update({
            where: { id: user.id },
            data: {
                resetToken,
                resetTokenExpires
            }
        })

        return {
            success: true,
            hasWhatsApp: !!user.whatsapp,
            whatsappNumber: user.whatsapp,
            resetToken
        }
    } catch (error) {
        console.error("Error requesting password reset:", error)
        return { error: "Erro ao processar solicitação. Tente novamente." }
    }
}

export async function sendResetWhatsAppAction(whatsapp: string, resetToken: string) {
    try {
        const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${resetToken}`
        const message = `*Recuperação de Senha*\n\nVocê solicitou a redefinição de sua senha na MyRifa.\n\nClique no link abaixo para criar uma nova senha:\n${resetUrl}\n\n_O link expira em 1 hora._`

        const res = await sendWhatsAppMessage(whatsapp, message)

        if (!res || res.error) {
            return { error: res?.error || "Erro ao enviar mensagem para o WhatsApp." }
        }

        return { success: true }
    } catch (error) {
        console.error("Error sending recovery WhatsApp:", error)
        return { error: "Erro ao enviar WhatsApp. Tente novamente." }
    }
}

export async function resetPasswordAction(token: string, formData: FormData) {
    const password = formData.get("password") as string
    const confirmPassword = formData.get("confirmPassword") as string

    if (password !== confirmPassword) {
        return { error: "As senhas não coincidem." }
    }

    if (password.length < 8) {
        return { error: "A senha deve ter pelo menos 8 caracteres." }
    }

    try {
        const user = await prisma.user.findFirst({
            where: {
                resetToken: token,
                resetTokenExpires: {
                    gt: new Date()
                }
            }
        })

        if (!user) {
            return { error: "Link de recuperação inválido ou expirado." }
        }

        const hashedPassword = await bcrypt.hash(password, 12)

        await prisma.user.update({
            where: { id: user.id },
            data: {
                password: hashedPassword,
                resetToken: null,
                resetTokenExpires: null
            }
        })

        return { success: true }
    } catch (error) {
        console.error("Error resetting password:", error)
        return { error: "Erro ao redefinir senha. Tente novamente." }
    }
}
