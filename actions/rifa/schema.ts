import { z } from "zod"

export const createRifaSchema = z.object({
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
        id: z.string().optional(),
        title: z.string().min(3).max(100),
        position: z.number().min(1)
    })).optional(),
    theme: z.enum(['DEFAULT', 'OCEAN', 'SUNSET', 'MIDNIGHT']).default('DEFAULT'),
    balloonShape: z.enum(['SQUARE', 'ROUNDED', 'CIRCLE', 'HEART', 'STAR', 'HEXAGON', 'DIAMOND', 'SHIELD', 'FLOWER']).default('ROUNDED'),
})

export type CreateRifaInput = z.infer<typeof createRifaSchema>
