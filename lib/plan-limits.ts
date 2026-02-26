export const PLAN_LIMITS = {
    FREE: {
        maxActiveRifas: 3,
        maxNumbersPerRifa: 500,
        pricePerNumber: "unlimited", // usually no limit on price
        commission: 0.05, // 5% commission for platform
        features: ["pix"]
    },
    PRO: {
        maxActiveRifas: 10,
        maxNumbersPerRifa: 10000,
        commission: 0.02, // 2% commission
        features: ["pix", "stripe", "custom_colors", "analytics"]
    },
    INSTITUTIONAL: {
        maxActiveRifas: 999,
        maxNumbersPerRifa: 100000,
        commission: 0.01,
        features: ["all"]
    }
} as const

export type PlanType = keyof typeof PLAN_LIMITS

export function checkPlanLimit(plan: PlanType, currentActiveCount: number, requestedNumbers: number) {
    const limits = PLAN_LIMITS[plan]

    if (currentActiveCount >= limits.maxActiveRifas) {
        return {
            allowed: false,
            error: `Seu plano ${plan} permite apenas ${limits.maxActiveRifas} rifa(s) ativa(s). Faça upgrade para criar mais.`
        }
    }

    if (requestedNumbers > limits.maxNumbersPerRifa) {
        return {
            allowed: false,
            error: `Seu plano ${plan} permite no máximo ${limits.maxNumbersPerRifa} números por rifa.`
        }
    }

    return { allowed: true }
}
