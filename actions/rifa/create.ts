"use server"

import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"
import { revalidatePath } from "next/cache"
import { checkPlanLimit, PlanType } from "@/lib/plan-limits"
import { RifaStatus } from "@prisma/client"
import { createRifaSchema } from "./schema"
import { validateRifaImages, generateSlug, validateThemeAccess } from "./utils"
import { validateShapeAccess } from "@/lib/shapes"

export async function createRifaAction(formData: FormData) {
    const session = await auth()
    if (!session?.user?.id) return { error: "Não autorizado" }

    const totalNumbers = Number(formData.get("totalNumbers"))
    const numberPrice = Number(formData.get("numberPrice"))
    const minPercentToRaffle = Number(formData.get("minPercentToRaffle") || 100)
    const maxPerBuyerStr = formData.get("maxPerBuyer")
    const drawDateStr = formData.get("drawDate") as string

    // Process images and prizes from formData
    const coverImage = formData.get("coverImage") as string
    const imagesStr = formData.get("images") as string
    const images = imagesStr ? imagesStr.split(',').filter(Boolean) : []
    const prizesStr = formData.get("prizes") as string
    const prizes = prizesStr ? JSON.parse(prizesStr) : []

    const data = {
        title: formData.get("title") as string,
        description: formData.get("description") as string,
        rules: formData.get("rules") as string || undefined,
        category: formData.get("category") as any,
        totalNumbers,
        numberPrice,
        drawDate: drawDateStr ? new Date(drawDateStr) : undefined,
        minPercentToRaffle,
        maxPerBuyer: maxPerBuyerStr ? Number(maxPerBuyerStr) : undefined,
        isPrivate: formData.get("isPrivate") === "true",
        coverImage: coverImage || undefined,
        images: images.length > 0 ? images : undefined,
        prizes: prizes.length > 0 ? prizes : undefined,
        theme: formData.get("theme") as any || 'DEFAULT',
        balloonShape: formData.get("balloonShape") as any || 'ROUNDED',
    }

    const result = createRifaSchema.safeParse(data)

    if (!result.success) {
        return { error: "Dados inválidos: " + result.error.issues[0].message }
    }

    try {
        const user = await prisma.user.findUnique({
            where: { id: session.user.id }
        })

        if (!user) return { error: "Usuário não encontrado" }

        const imageValidation = validateRifaImages(user.plan, result.data.coverImage, result.data.images)
        if (imageValidation.error) return { error: imageValidation.error }

        const validatedShape = validateShapeAccess(user.plan, result.data.balloonShape)
        const validatedTheme = validateThemeAccess(user.plan, result.data.theme)

        const activeRifasCount = await prisma.rifa.count({
            where: { userId: user.id, status: "ACTIVE" }
        })

        const limitCheck = checkPlanLimit(user.plan as PlanType, activeRifasCount, result.data.totalNumbers)
        if (!limitCheck.allowed) return { error: limitCheck.error }

        const slug = generateSlug(result.data.title)

        const rifa = await prisma.$transaction(async (tx) => {
            const { prizes, ...rifaData } = result.data

            const newRifa = await tx.rifa.create({
                data: {
                    ...rifaData,
                    balloonShape: validatedShape,
                    theme: validatedTheme,
                    slug,
                    userId: session.user?.id as string,
                    status: RifaStatus.DRAFT,
                    quotaCommissionPercent: user.plan === "INSTITUTIONAL" ? 0.01 : user.plan === "PRO" ? 0.02 : 0.05,
                    quotaCommissionGoal: (result.data.totalNumbers * result.data.numberPrice) * (user.plan === "INSTITUTIONAL" ? 0.01 : user.plan === "PRO" ? 0.02 : 0.05),
                    prizes: prizes ? {
                        create: prizes.map((p: any) => ({
                            title: p.title,
                            position: p.position
                        }))
                    } : undefined
                } as any
            })

            const numbers = Array.from({ length: result.data.totalNumbers }, (_, i) => ({
                number: i + 1,
                rifaId: newRifa.id,
                status: "AVAILABLE" as const
            }))

            for (let i = 0; i < numbers.length; i += 1000) {
                await tx.rifaNumber.createMany({
                    data: numbers.slice(i, i + 1000)
                })
            }

            return newRifa
        })

        revalidatePath("/dashboard")
        revalidatePath("/dashboard/rifas")

        return { success: true, rifaId: rifa.id, slug: rifa.slug }
    } catch (error: any) {
        console.error("Failed to create rifa:", error)
        return { error: "Falha ao criar campanha. Tente novamente." }
    }
}
