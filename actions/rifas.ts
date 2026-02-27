"use server"

import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"
import { z } from "zod"
import { revalidatePath } from "next/cache"
import { checkPlanLimit, PlanType } from "@/lib/plan-limits"
import { RifaStatus } from "@prisma/client"

const createRifaSchema = z.object({
    title: z.string().min(3).max(80),
    description: z.string().max(500).optional(),
    rules: z.string().max(2000).optional(),
    category: z.enum(['SORTEIO', 'ARRECADACAO', 'VIAGEM', 'MISSAO', 'SAUDE', 'ESPORTE', 'OUTRO']),
    totalNumbers: z.number().min(10).max(10000),
    numberPrice: z.number().min(1).max(10000),
    drawDate: z.date().optional(),
    minPercentToRaffle: z.number().min(1).max(100).default(100),
    maxPerBuyer: z.number().min(1).optional(),
    isPrivate: z.boolean().default(false),
    coverImage: z.string().url().optional(),
    images: z.array(z.string().url()).optional(),
    prizes: z.array(z.object({
        title: z.string().min(3).max(100),
        position: z.number().min(1)
    })).optional(),
})

// Centralized image validation logic (Anti-Bypass)
function validateRifaImages(plan: string, coverImage?: string, images?: string[]) {
    // 1. Plan Gate Check
    if (plan === "FREE" && images && images.length > 0) {
        return { error: "O plano FREE permite apenas a imagem de capa. Faça upgrade para usar a galeria." }
    }

    if (images && images.length > 5) {
        return { error: "O limite máximo é de 5 imagens na galeria." }
    }

    return { success: true }
}

function generateSlug(title: string) {
    return title
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s_-]+/g, '-')
        .replace(/^-+|-+$/g, '') + '-' + Date.now().toString().slice(-6)
}

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
    }

    const result = createRifaSchema.safeParse(data)

    if (!result.success) {
        return { error: "Dados inválidos: " + result.error.issues[0].message }
    }

    try {
        // Plan Gate Check
        const user = await prisma.user.findUnique({
            where: { id: session.user.id }
        })

        if (!user) return { error: "Usuário não encontrado" }

        // Server-side Image Validation (Anti-bypass)
        const imageValidation = validateRifaImages(user.plan, result.data.coverImage, result.data.images)
        if (imageValidation.error) return { error: imageValidation.error }

        const activeRifasCount = await prisma.rifa.count({
            where: { userId: user.id, status: "ACTIVE" }
        })

        const limitCheck = checkPlanLimit(user.plan as PlanType, activeRifasCount, result.data.totalNumbers)

        if (!limitCheck.allowed) {
            return { error: limitCheck.error }
        }

        const slug = generateSlug(result.data.title)

        // Create Rifa and Generate all available numbers
        // Note: for large amounts of numbers (like 10000), createMany is necessary
        const rifa = await prisma.$transaction(async (tx) => {
            const { prizes, ...rifaData } = result.data

            const newRifa = await tx.rifa.create({
                data: {
                    ...rifaData,
                    slug,
                    userId: session.user?.id as string,
                    status: RifaStatus.DRAFT,
                    prizes: prizes ? {
                        create: prizes.map((p: any) => ({
                            title: p.title,
                            position: p.position
                        }))
                    } : undefined
                }
            })

            const numbers = Array.from({ length: result.data.totalNumbers }, (_, i) => ({
                number: i + 1,
                rifaId: newRifa.id,
                status: "AVAILABLE" as const
            }))

            // create chunks of 1000 to avoid query limits
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
        return { error: "Falha ao criar rifa. Tente novamente." }
    }
}

export async function publishRifaAction(rifaId: string) {
    const session = await auth()
    if (!session?.user?.id) return { error: "Não autorizado" }

    try {
        await prisma.rifa.update({
            where: {
                id: rifaId,
                userId: session.user.id
            },
            data: { status: RifaStatus.ACTIVE }
        })

        revalidatePath("/dashboard")
        revalidatePath("/dashboard/rifas")
        revalidatePath(`/dashboard/rifas/${rifaId}`)

        return { success: true }
    } catch (error) {
        return { error: "Não foi possível publicar a rifa" }
    }
}

export async function updateRifaConfigAction(rifaId: string, data: { isPrivate?: boolean, drawDate?: string, minPercentToRaffle?: number }) {
    const session = await auth()
    if (!session?.user?.id) return { error: "Não autorizado" }

    try {
        await prisma.rifa.update({
            where: {
                id: rifaId,
                userId: session.user.id
            },
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

    // Process images from formData
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

        // Server-side Image Validation (Anti-bypass)
        const imageValidation = validateRifaImages(user.plan, coverImage, images)
        if (imageValidation.error) return { error: imageValidation.error }

        await prisma.$transaction(async (tx) => {
            await tx.rifa.update({
                where: {
                    id: rifaId,
                    userId: session.user?.id as string
                },
                data: {
                    title,
                    description,
                    rules,
                    coverImage: coverImage || undefined,
                    images: images.length > 0 ? images : undefined,
                }
            })

            // Sync prizes: delete old ones and create new ones (simplest approach for now)
            // or we could do a more complex upsert. Let's do a simple sync.
            // Only sync if prizes were provided
            if (prizes.length > 0) {
                // We keep prizes that already have winners! 
                // Don't delete prizes that are already drawn.
                const existingPrizes = await tx.prize.findMany({
                    where: { rifaId }
                })

                // For simplicity in this UI, we'll assume the user is sending the full current list
                // If a prize has a winnerId, we should NOT delete it or update its core info in a way that breaks things.

                // Let's implement a basic sync: delete ones not in the list, update existing, create new.
                for (const p of prizes) {
                    if (p.id) {
                        await tx.prize.update({
                            where: { id: p.id },
                            data: { title: p.title, position: p.position }
                        })
                    } else {
                        await tx.prize.create({
                            data: {
                                title: p.title,
                                position: p.position,
                                rifaId: rifaId
                            }
                        })
                    }
                }

                // Delete prizes that were removed in UI AND don't have winners
                const prizeIdsToKeep = prizes.map((p: any) => p.id).filter(Boolean)
                await tx.prize.deleteMany({
                    where: {
                        rifaId,
                        id: { notIn: prizeIdsToKeep },
                        winnerId: null // Safety: don't delete winners history
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
        return { error: "Não foi possível atualizar a rifa" }
    }
}

export async function encerrarVendasAction(rifaId: string) {
    const session = await auth()
    if (!session?.user?.id) return { error: "Não autorizado" }

    try {
        await prisma.rifa.update({
            where: {
                id: rifaId,
                userId: session.user.id
            },
            data: { status: RifaStatus.PAUSED }
        })

        revalidatePath(`/dashboard/rifas/${rifaId}`)
        revalidatePath(`/dashboard/rifas/${rifaId}/configuracoes`)

        return { success: true }
    } catch (error) {
        return { error: "Não foi possível encerrar as vendas" }
    }
}

export async function cancelarRifaAction(rifaId: string) {
    const session = await auth()
    if (!session?.user?.id) return { error: "Não autorizado" }

    try {
        // Only allow cancel if not drawn
        const rifa = await prisma.rifa.findUnique({
            where: { id: rifaId, userId: session.user.id }
        })

        if (!rifa) return { error: "Rifa não encontrada" }
        if (rifa.status === "DRAWN") return { error: "Rifas sorteadas não podem ser canceladas" }

        await prisma.rifa.update({
            where: { id: rifaId },
            data: { status: RifaStatus.CANCELLED }
        })

        revalidatePath("/dashboard")
        revalidatePath("/dashboard/rifas")
        revalidatePath(`/dashboard/rifas/${rifaId}`)
        revalidatePath(`/dashboard/rifas/${rifaId}/configuracoes`)

        return { success: true }
    } catch (error) {
        return { error: "Não foi possível cancelar a rifa" }
    }
}

export async function deleteRifaAction(rifaId: string) {
    const session = await auth()
    if (!session?.user?.id) return { error: "Não autorizado" }

    try {
        const rifa = await prisma.rifa.findUnique({
            where: { id: rifaId, userId: session.user.id },
            include: {
                _count: {
                    select: { numbers: { where: { status: "PAID" } } }
                }
            }
        })

        if (!rifa) return { error: "Rifa não encontrada" }

        // Safety check: don't delete if there are paid numbers unless forced (optional logic)
        // For now, let's just allow it or check status
        if (rifa.status === "DRAWN") {
            return { error: "Não é possível excluir uma rifa que já foi sorteada." }
        }

        await prisma.$executeRaw`UPDATE "Rifa" SET status = 'DELETED' WHERE id = ${rifaId}`

        revalidatePath("/dashboard")
        revalidatePath("/dashboard/rifas")

        return { success: true }
    } catch (error) {
        console.error("Delete error:", error)
        return { error: "Erro ao excluir a rifa." }
    }
}
