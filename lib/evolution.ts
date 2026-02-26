/**
 * Utility for Evolution API integration (WhatsApp)
 * Based on requirements from prompt-rifa-online.md
 */

const EVOLUTION_API_URL = process.env.EVOLUTION_API_URL
const EVOLUTION_API_KEY = process.env.EVOLUTION_API_KEY
const EVOLUTION_INSTANCE = process.env.EVOLUTION_INSTANCE

export async function sendWhatsAppMessage(to: string, message: string) {
    if (!EVOLUTION_API_URL || !EVOLUTION_API_KEY || !EVOLUTION_INSTANCE) {
        console.warn("WhatsApp Notification skipped: Evolution API credentials missing.")
        return null
    }

    // Clean number (remove non-digits, ensure country code)
    let cleanTo = to.replace(/\D/g, '')
    if (!cleanTo.startsWith('55')) {
        cleanTo = '55' + cleanTo
    }

    try {
        const response = await fetch(`${EVOLUTION_API_URL}/message/sendText/${EVOLUTION_INSTANCE}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'apikey': EVOLUTION_API_KEY
            },
            body: JSON.stringify({
                number: cleanTo,
                options: {
                    delay: 1200,
                    presence: "composing",
                    linkPreview: true
                },
                textMessage: {
                    text: message
                }
            })
        })

        const data = await response.json()
        return data
    } catch (error) {
        console.error("Evolution API Error:", error)
        return null
    }
}

export const templates = {
    newReservation: (name: string, rifaTitle: string, numbers: number[], total: string, pixUrl: string) => `
Olá *${name}*! 👋

Recebemos seu pedido para a rifa: *${rifaTitle}*

🔢 *Seus Números:* ${numbers.join(', ')}
💰 *Total:* ${total}

Para garantir seus números, realize o pagamento via PIX através do link abaixo:
🔗 ${pixUrl}

⚠️ *Atenção:* Seus números ficam reservados por apenas 30 minutos. Após esse prazo, eles voltam a ficar disponíveis para outros compradores.

Boa sorte! 🍀
  `.trim(),

    paymentConfirmed: (name: string, rifaTitle: string, numbers: number[]) => `
✅ *Pagamento Confirmado!*

Olá *${name}*, seu pagamento para a rifa *${rifaTitle}* foi aprovado com sucesso!

🎫 *Seus Números da Sorte:* ${numbers.join(', ')}

Você já está participando do sorteio. Fique atento às nossas redes sociais para acompanhar a data do sorteio.

Agradecemos sua participação e boa sorte! 🍀
  `.trim(),

    winner: (name: string, rifaTitle: string, winningNumber: number) => `
🎉🎉 *PARABÉNS, VOCÊ GANHOU!* 🎉🎉

Olá *${name}*, temos uma notícia maravilhosa! Você foi o(a) grande vencedor(a) da rifa:
🏆 *${rifaTitle}*

🔢 Seu número sorteado foi o: *${winningNumber.toString().padStart(2, '0')}*

O organizador entrará em contato em breve para combinar a entrega do prêmio. 

Parabéns pela vitória! 🎊🥳
  `.trim()
}
