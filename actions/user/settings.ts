"use server"

import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"
import { revalidatePath } from "next/cache"

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
