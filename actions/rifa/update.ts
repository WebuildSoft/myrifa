"use server"

import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"
import { revalidatePath } from "next/cache"
import { createRifaSchema } from "./schema"
import { validateRifaImages, validateThemeAccess } from "./utils"
import { validateShapeAccess } from "@/lib/shapes"

export async function updateRifaConfigAction(rifaId: string, data: { isPrivate?: boolean, drawDate?: string, minPercentToRaffle?: number }) {
    const session = await auth()
    if (!session?.user?.id) return { error: "Não autorizado" }

    try {
        await prisma.rifa.update({
            where: { id: rifaId, userId: session.user.id },
            data: {
                isPrivate: data.isPrivate,
                drawDate: data.drawDate ? new Date(data.drawDate) : undefined,
                minPercentToRaffle: data.minPercentToRaffle
            }
        })
        revalidatePath(`/dashboard/rifas/${rifaId}`)
        revalidatePath(`/dashboard/rifas/${rifaId}/configuracoes`)
        return { success: true }
    } catch (error) {
        return { error: "Não foi possível atualizar as configurações" }
    }
}

export async function updateRifaAction(rifaId: string, formData: FormData) {
    const session = await auth()
    if (!session?.user?.id) return { error: "Não autorizado" }

    const title = formData.get("title") as string
    const description = formData.get("description") as string
    const rules = formData.get("rules") as string || undefined

    if (!title || title.length < 3) {
        return { error: "Título deve ter pelo menos 3 caracteres" }
    }

    const coverImage = formData.get("coverImage") as string
    const imagesStr = formData.get("images") as string
    const images = imagesStr ? imagesStr.split(',').filter(Boolean) : []
    const prizesStr = formData.get("prizes") as string
    const prizes = prizesStr ? JSON.parse(prizesStr) : []

    try {
        const user = await prisma.user.findUnique({
            where: { id: session.user.id },
            select: { plan: true }
        })

        if (!user) return { error: "Usuário não encontrado" }

        const imageValidation = validateRifaImages(user.plan, coverImage, images)
        if (imageValidation.error) return { error: imageValidation.error }

        const validatedShape = validateShapeAccess(user.plan, formData.get("balloonShape") as string)
        const validatedTheme = validateThemeAccess(user.plan, formData.get("theme") as string)

        await prisma.$transaction(async (tx) => {
            await tx.rifa.update({
                where: { id: rifaId, userId: session.user?.id as string },
                data: {
                    title,
                    description,
                    rules,
                    coverImage: coverImage || undefined,
                    images: images.length > 0 ? images : undefined,
                    theme: validatedTheme,
                    balloonShape: validatedShape,
                }
            })

            if (prizes.length > 0) {
                for (const p of prizes) {
                    if (p.id) {
                        await tx.prize.update({
                            where: { id: p.id },
                            data: { title: p.title, position: p.position }
                        })
                    } else {
                        await tx.prize.create({
                            data: { title: p.title, position: p.position, rifaId: rifaId }
                        })
                    }
                }

                const prizeIdsToKeep = prizes.map((p: any) => p.id).filter(Boolean)
                await tx.prize.deleteMany({
                    where: {
                        rifaId,
                        id: { notIn: prizeIdsToKeep },
                        winnerId: null
                    }
                })
            }
        })

        revalidatePath(`/dashboard/rifas/${rifaId}`)
        revalidatePath(`/dashboard/rifas/${rifaId}/editar`)
        revalidatePath("/dashboard/rifas")
        return { success: true }
    } catch (error) {
        console.error("Update error:", error)
        return { error: "Não foi possível atualizar a campanha" }
    }
}
