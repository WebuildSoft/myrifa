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

    // Clean number (remove non-digits)
    let cleanTo = to.replace(/\D/g, '')

    // Auto-fix Brazilian numbers
    if (cleanTo.length >= 10 && cleanTo.length <= 11 && !cleanTo.startsWith('55')) {
        cleanTo = '55' + cleanTo
    }

    // Evolution API / WhatsApp JID logic for Brazil:
    // Numbers with 13 digits (55 + DDD + 9 + number) are often normalized 
    // to 12 digits (55 + DDD + number) by the API/WhatsApp itself.
    // However, some instances require the 9. We'll keep what's provided 
    // but ensure the country code is present.

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
    async get(key: 'newReservation' | 'manualReservation' | 'paymentReminder' | 'paymentConfirmed' | 'winner', variables: Record<string, string>) {
        try {
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
Olá, *{cliente}*! 😊

Recebemos sua reserva na campanha *{rifa}*! Agradecemos imensamente por sua colaboração.

🎫 *Suas Cotas:* {numeros}
💰 *Total:* {valor_total}

Agora é só realizar o pagamento via PIX para confirmar sua participação:
🔗 {pix_url}

Aguardamos com carinho 💜
*Que Deus abençoe!* 🙏
_Equipe MyRifa_
`.trim(),

        manualReservation: `
Olá, *{cliente}*! 😊

Recebemos sua reserva na campanha *{rifa}*! Agradecemos imensamente por sua colaboração.

🎫 *Suas Cotas:* {numeros}
💰 *Total:* {valor_total}

⏳ *Status:* *Aguardando Confirmação*.

Como esta é uma reserva com *Pix Manual*, o administrador da campanha foi notificado e irá conferir o recebimento para validar sua participação.

*Fique tranquilo(a)!* Assim que o administrador confirmar, você receberá um novo aviso por aqui. 💜

*Que Deus abençoe!* 🙏
_Equipe MyRifa_
`.trim(),

        paymentReminder: `
Olá, *{cliente}*! 😊

Passamos apenas para lembrar que sua reserva para a campanha *{rifa}* ainda não foi confirmada.

Para garantir que suas cotas ({numeros}) continuem reservadas, você pode acessar os dados por este link:

🔗 *Acesse aqui:* {pix_url}

Se já realizou o pagamento, basta aguardar a conferência do administrador. Caso precise de alguma ajuda, estamos à disposição! ✨

*Agradecemos sua participação!*
_Equipe MyRifa_
`.trim(),

        paymentConfirmed: `
💜 *Participação Confirmada!*

Olá, *{cliente}*! Que bom ter você com a gente 🙌

Seu apoio à campanha *{rifa}* foi confirmado com sucesso!

🎫 *Suas cotas:* {numeros}

Você já está participando! Acompanhe tudo por aqui e que Deus abençoe 🙏

_Obrigado por apoiar essa causa! — Equipe MyRifa_
`.trim(),

        winner: `
🎉 *CONTEEMPLADO(A)!* 🎉

Olá, *{cliente}*, que notícia abençoada! 🥳

Você foi o(a) contemplado(a) da campanha:
🏆 *{rifa}*

🔢 Sua cota premiada: *{numero_vencedor}*

Parabéns! O organizador entrará em contato em breve para combinar a entrega. 🎁

_Com carinho — Equipe MyRifa_ 💜
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

    manualReservation: async (name: string, rifaTitle: string, numbers: number[], total: string) => {
        return waTemplates.get('manualReservation', {
            cliente: name,
            rifa: rifaTitle,
            numeros: numbers.join(', '),
            valor_total: total
        })
    },

    paymentReminder: async (name: string, rifaTitle: string, numbers: number[], pixUrl: string) => {
        return waTemplates.get('paymentReminder', {
            cliente: name,
            rifa: rifaTitle,
            numeros: numbers.join(', '),
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
