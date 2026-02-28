"use server"

import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"

export async function submitFeedbackAction(formData: FormData) {
    const session = await auth()
    const userId = session?.user?.id

    const type = formData.get("type") as any
    const content = formData.get("content") as string

    if (!content || content.length < 10) {
        return { error: "O feedback deve ter pelo menos 10 caracteres." }
    }

    try {
        await prisma.feedback.create({
            data: {
                userId,
                type,
                content,
                status: "PENDING"
            }
        })

        // Se for um erro, podemos notificar o admin ou enviar um email (implementação futura)

        revalidatePath("/dashboard")

        return { success: true }
    } catch (error) {
        console.error("Error submitting feedback:", error)
        return { error: "Ocorreu um erro ao salvar seu feedback. Tente novamente mais tarde." }
    }
}
