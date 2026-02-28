import { RifaTheme, THEME_CONFIGS } from "@/lib/themes"

export function validateThemeAccess(plan: string, requestedTheme: string | null | undefined): RifaTheme {
    const theme = (requestedTheme as RifaTheme) || 'DEFAULT'
    const config = THEME_CONFIGS[theme] || THEME_CONFIGS.DEFAULT

    if (config.isPremium && plan === "FREE") {
        return 'DEFAULT'
    }

    return theme
}

export function validateRifaImages(plan: string, coverImage?: string, images?: string[]) {
    // 1. Plan Gate Check
    if (plan === "FREE" && images && images.length > 0) {
        return { error: "O plano FREE permite apenas a imagem de capa. Faça upgrade para usar a galeria." }
    }

    if (images && images.length > 5) {
        return { error: "O limite máximo é de 5 imagens na galeria." }
    }

    return { success: true }
}

export function generateSlug(title: string) {
    return title
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s_-]+/g, '-')
        .replace(/^-+|-+$/g, '') + '-' + Date.now().toString().slice(-6)
}
