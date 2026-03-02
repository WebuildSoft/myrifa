import { sendWhatsAppMessage } from "./evolution"
import { prisma } from "./prisma"

const ADMIN_ALERT_PHONE = process.env.ADMIN_ALERT_PHONE

interface AlertOptions {
    severity?: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL"
    source?: string
    stack?: string
    url?: string
    userAgent?: string
    userId?: string
}

/**
 * Sends a formatted error alert to the admin via WhatsApp
 * AND saves a detailed record to the SystemError database table.
 */
export async function sendSystemAlert(
    context: string,
    error: unknown,
    options: AlertOptions = {}
) {
    const { severity = "HIGH", source = "server", stack, url, userAgent, userId } = options

    const errorMessage = error instanceof Error
        ? error.message
        : typeof error === "string"
            ? error
            : JSON.stringify(error)

    const errorStack = stack ?? (error instanceof Error ? error.stack : undefined)

    // Always save to database (in all environments)
    try {
        await (prisma as any).systemError.create({
            data: {
                context,
                message: errorMessage,
                stack: errorStack,
                severity,
                source,
                url,
                userAgent,
                userId,
            }
        })
    } catch (dbError) {
        console.error("[SystemAlert] Failed to save error to DB:", dbError)
    }

    // Only send WhatsApp in production
    if (process.env.NODE_ENV !== "production") {
        console.warn(`[SystemAlert] [DEV] ${context}:`, errorMessage)
        return
    }

    if (!ADMIN_ALERT_PHONE) {
        console.error("[SystemAlert] ADMIN_ALERT_PHONE not configured. WhatsApp alert skipped.")
        return
    }

    const severityEmoji = {
        LOW: "🟡",
        MEDIUM: "🟠",
        HIGH: "🔴",
        CRITICAL: "🚨"
    }[severity]

    const now = new Date().toLocaleString("pt-BR", { timeZone: "America/Sao_Paulo" })

    const lines = [
        `${severityEmoji} *ERRO NO SISTEMA — ${severity}*`,
        ``,
        `📍 *Contexto:* ${context}`,
        `❌ *Erro:* ${errorMessage}`,
        `🕒 *Horário:* ${now}`,
        `🌐 *Origem:* ${source}`,
    ]

    if (url) lines.push(`🔗 *URL:* ${url}`)
    if (userId) lines.push(`👤 *Usuário ID:* ${userId}`)
    lines.push(``, `Verifique a aba de *Logs* no painel para detalhes completos.`)

    try {
        await sendWhatsAppMessage(ADMIN_ALERT_PHONE, lines.join("\n"))
    } catch (sendError) {
        console.error("[SystemAlert] Failed to send WhatsApp alert:", sendError)
    }
}
