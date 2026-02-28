import { BalloonShape } from "@prisma/client"

export const FREE_SHAPES: BalloonShape[] = ["ROUNDED" as BalloonShape, "SQUARE" as BalloonShape]
export const PREMIUM_SHAPES: BalloonShape[] = ["CIRCLE" as BalloonShape, "HEART" as BalloonShape, "STAR" as BalloonShape, "HEXAGON" as BalloonShape, "DIAMOND" as BalloonShape, "SHIELD" as BalloonShape, "FLOWER" as BalloonShape]

export interface ShapeConfig {
    id: BalloonShape
    name: string
    radiusClass: string
    clipPathStyle?: string
    isPremium: boolean
}

export const SHAPE_CONFIGS: Record<string, ShapeConfig> = {
    ROUNDED: {
        id: "ROUNDED" as BalloonShape,
        name: "Arredondado",
        radiusClass: "rounded-xl",
        isPremium: false,
    },
    SQUARE: {
        id: "SQUARE" as BalloonShape,
        name: "Quadrado",
        radiusClass: "rounded-sm",
        isPremium: false,
    },
    CIRCLE: {
        id: "CIRCLE" as BalloonShape,
        name: "Círculo",
        radiusClass: "rounded-full",
        isPremium: true,
    },
    HEART: {
        id: "HEART" as BalloonShape,
        name: "Coração",
        radiusClass: "rounded-none",
        clipPathStyle: "polygon(50% 15%, 85% 0%, 100% 35%, 50% 100%, 0% 35%, 15% 0%)",
        isPremium: true,
    },
    STAR: {
        id: "STAR" as BalloonShape,
        name: "Estrela",
        radiusClass: "rounded-sm",
        clipPathStyle: "polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)",
        isPremium: true,
    },
    HEXAGON: {
        id: "HEXAGON" as BalloonShape,
        name: "Hexágono",
        radiusClass: "rounded-sm",
        clipPathStyle: "polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)",
        isPremium: true,
    },
    DIAMOND: {
        id: "DIAMOND" as BalloonShape,
        name: "Losango",
        radiusClass: "rounded-md",
        clipPathStyle: "polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)",
        isPremium: true,
    },
    SHIELD: {
        id: "SHIELD" as BalloonShape,
        name: "Escudo",
        radiusClass: "rounded-sm",
        clipPathStyle: "polygon(0 0, 100% 0, 100% 80%, 50% 100%, 0 80%)",
        isPremium: true,
    },
    FLOWER: {
        id: "FLOWER" as BalloonShape,
        name: "Flor",
        radiusClass: "rounded-[40%]", // Simulates a flower-like soften edge visually
        isPremium: true,
    }
}

export function getShapeConfig(shape?: BalloonShape | null): ShapeConfig {
    if (!shape) return SHAPE_CONFIGS["ROUNDED" as BalloonShape]
    return SHAPE_CONFIGS[shape] || SHAPE_CONFIGS["ROUNDED" as BalloonShape]
}

/**
 * Validates if the given plan has access to the requested shape.
 * Returns the requested shape if allowed, otherwise falls back to ROUNDED.
 */
export function validateShapeAccess(plan: string, requestedShape: string | null | undefined): BalloonShape {
    if (!requestedShape) return "ROUNDED" as BalloonShape

    // Hard cast to check against our enums
    const shape = requestedShape as BalloonShape

    // Pro/Institutional plans can use any shape
    if (plan === "PRO" || plan === "INSTITUTIONAL") {
        if (FREE_SHAPES.includes(shape) || PREMIUM_SHAPES.includes(shape)) {
            return shape
        }
    }

    // Free plan can only use FREE_SHAPES
    if (FREE_SHAPES.includes(shape)) {
        return shape
    }

    // Default fallback
    return "ROUNDED" as BalloonShape
}
