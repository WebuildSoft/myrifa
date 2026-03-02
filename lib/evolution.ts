import { prisma } from "./prisma"
/**
 * Utility for Evolution API integration (WhatsApp)
 * Based on requirements from prompt-rifa-online.md
 */

const EVOLUTION_API_URL = process.env.EVOLUTION_API_URL
const EVOLUTION_API_KEY = process.env.EVOLUTION_API_KEY
const EVOLUTION_INSTANCE = process.env.EVOLUTION_INSTANCE

export async function sendWhatsAppMessage(to: string, message: string) {
    const isPlaceholder = (val?: string) => !val || val.includes("[YOUR_") || val.includes("YOUR_")

    if (isPlaceholder(EVOLUTION_API_URL) || isPlaceholder(EVOLUTION_API_KEY) || isPlaceholder(EVOLUTION_INSTANCE)) {
        console.warn("WhatsApp Notification skipped: Evolution API credentials are unset or placeholders.")
        return null
    }

    // Clean number (remove non-digits, ensure country code)
    let cleanTo = to.replace(/\D/g, '')
    if (!cleanTo.startsWith('55')) {
        cleanTo = '55' + cleanTo
    }

    try {
        const url = `${EVOLUTION_API_URL}/message/sendText/${EVOLUTION_INSTANCE}`
        const body = JSON.stringify({
            number: cleanTo,
            text: message, // Evolution v2 prefers direct 'text' field
            options: {
                delay: 0,
                presence: "composing",
                linkPreview: false
            }
        })

        console.log(`[EVOLUTION-API] Fetching ${url}`)
        // console.log(`[EVOLUTION-API] Body:`, body) // Masked for safety usually, but for debug:

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'apikey': EVOLUTION_API_KEY as string
            },
            body: body
        })

        const data = await response.json()
        console.log(`[EVOLUTION-API] Response Status: ${response.status}`, data)
        return data
    } catch (error) {
        console.error("Evolution API Error:", error)
        return null
    }
}

export async function getEvolutionStatus() {
    try {
        const response = await fetch(`${EVOLUTION_API_URL}/instance/connectionState/${EVOLUTION_INSTANCE}`, {
            headers: { 'apikey': EVOLUTION_API_KEY as string }
        })
        const data = await response.json()
        return data?.instance?.state || "DISCONNECTED"
    } catch (error) {
        console.error("Evolution Status Error:", error)
        return "ERROR"
    }
}

export async function getEvolutionStats() {
    try {
        const url = `${EVOLUTION_API_URL}/instance/fetchInstances`
        const response = await fetch(url, {
            headers: { 'apikey': EVOLUTION_API_KEY as string }
        })

        if (!response.ok) return null

        const data = await response.json()

        // Find our specific instance in the list
        const instance = Array.isArray(data)
            ? data.find((i: any) => i.name === EVOLUTION_INSTANCE || i.instanceName === EVOLUTION_INSTANCE)
            : data

        if (!instance) return null

        return {
            status: instance.connectionStatus || instance.instance?.state || "UNKNOWN",
            instanceName: EVOLUTION_INSTANCE,
            owner: instance.ownerJid || instance.instance?.owner,
            profileName: instance.profileName || instance.instance?.profileName,
            profilePicture: instance.profilePictureUrl || instance.instance?.profilePictureUrl,
            battery: instance.batteryLevel,
            updatedAt: new Date().toISOString()
        }
    } catch (error) {
        console.error("Evolution Stats Error:", error)
        return null
    }
}

export async function getEvolutionQR() {
    try {
        const response = await fetch(`${EVOLUTION_API_URL}/instance/connect/${EVOLUTION_INSTANCE}`, {
            headers: { 'apikey': EVOLUTION_API_KEY as string }
        })
        return await response.json()
    } catch (error) {
        console.error("Evolution QR Error:", error)
        return null
    }
}

export async function logoutEvolutionInstance() {
    try {
        const response = await fetch(`${EVOLUTION_API_URL}/instance/logout/${EVOLUTION_INSTANCE}`, {
            method: 'DELETE',
            headers: { 'apikey': EVOLUTION_API_KEY as string }
        })
        return await response.json()
    } catch (error) {
        console.error("Evolution Logout Error:", error)
        return null
    }
}

export async function restartEvolutionInstance() {
    try {
        const response = await fetch(`${EVOLUTION_API_URL}/instance/restart/${EVOLUTION_INSTANCE}`, {
            method: 'POST',
            headers: { 'apikey': EVOLUTION_API_KEY as string }
        })
        return await response.json()
    } catch (error) {
        console.error("Evolution Restart Error:", error)
        return null
    }
}

export const waTemplates = {
    async get(key: 'newReservation' | 'paymentConfirmed' | 'winner', variables: Record<string, string>) {
        try {
            // Use (prisma as any) to bypass lint if generate is lagging, 
            // but the table 'WhatsappConfig' exists in DB.
            const config = await (prisma as any).whatsappConfig.findUnique({
                where: { id: "default" }
            })

            let template = config?.[key]

            // Fallback to defaults if not set in DB
            if (!template) {
                template = this.defaults[key]
            }

            // Replace variables {key} -> value
            let finalMessage = template
            Object.entries(variables).forEach(([k, v]) => {
                const regex = new RegExp(`\\{${k}\\}`, 'g')
                finalMessage = finalMessage.replace(regex, v || '')
            })

            return finalMessage
        } catch (error) {
            console.error("Error generating WA template:", error)
            // Absolute fallback using defaults and simple replacement
            let fallback = this.defaults[key]
            Object.entries(variables).forEach(([k, v]) => {
                const regex = new RegExp(`\\{${k}\\}`, 'g')
                fallback = fallback.replace(regex, v || '')
            })
            return fallback
        }
    },

    defaults: {
        newReservation: `
Olá *{cliente}*! 👋

Recebemos seu pedido para a rifa: *{rifa}*

🔢 *Seus Números:* {numeros}
💰 *Total:* {valor_total}

Pague via PIX agora para garantir suas cotas:
🔗 {pix_url}

🔒 100% Seguro • 🎯 Sorteio Automático
`.trim(),

        paymentConfirmed: `
✅ *Pagamento Confirmado!*

Olá *{cliente}*, seu pagamento para a rifa *{rifa}* foi aprovado! 🍀

🎫 *Seus Números da Sorte:* {numeros}

Você já está concorrendo ao prêmio. Boa sorte!
`.trim(),

        winner: `
🎉🎉 *PARABÉNS, VOCÊ GANHOU!* 🎉🎉

Olá *{cliente}*, temos uma notícia maravilhosa! Você foi o(a) grande vencedor(a) da rifa:
🏆 *{rifa}*

🔢 Seu número sorteado foi o: *{numero_vencedor}*

Parabéns pela vitória! 🎊🥳
`.trim()
    }
}

// Keep the old 'templates' object for compatibility, but make it use the new system
// Note: These become async now.
export const templates = {
    newReservation: async (name: string, rifaTitle: string, numbers: number[], total: string, pixUrl: string) => {
        return waTemplates.get('newReservation', {
            cliente: name,
            rifa: rifaTitle,
            numeros: numbers.join(', '),
            valor_total: total,
            pix_url: pixUrl
        })
    },

    paymentConfirmed: async (name: string, rifaTitle: string, numbers: number[]) => {
        return waTemplates.get('paymentConfirmed', {
            cliente: name,
            rifa: rifaTitle,
            numeros: numbers.join(', ')
        })
    },

    winner: async (name: string, rifaTitle: string, winningNumber: number) => {
        return waTemplates.get('winner', {
            cliente: name,
            rifa: rifaTitle,
            numero_vencedor: winningNumber.toString().padStart(2, '0')
        })
    }
}
