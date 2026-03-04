import { sendWhatsAppMessage, templates } from "@/lib/evolution"

export interface ReservationNotificationParams {
    whatsapp: string
    buyerName: string
    rifaTitle: string
    numbers: number[]
    amount: number
    checkoutUrl: string
}

export class NotificationService {
    static async sendReservationConfirm({
        whatsapp,
        buyerName,
        rifaTitle,
        numbers,
        amount,
        checkoutUrl
    }: ReservationNotificationParams) {
        const formattedAmount = new Intl.NumberFormat("pt-BR", {
            style: "currency",
            currency: "BRL"
        }).format(amount)

        const message = await templates.newReservation(
            buyerName,
            rifaTitle,
            numbers,
            formattedAmount,
            checkoutUrl
        )

        return sendWhatsAppMessage(whatsapp, message)
    }

    static async sendOrganizerAlert({
        whatsapp,
        buyerName,
        rifaTitle,
        numbers,
        amount,
        type
    }: {
        whatsapp: string
        buyerName: string
        rifaTitle: string
        numbers: number[]
        amount: number
        type: 'RESERVATION' | 'PAYMENT'
    }) {
        const formattedAmount = new Intl.NumberFormat("pt-BR", {
            style: "currency",
            currency: "BRL"
        }).format(amount)

        let message = ""
        if (type === 'RESERVATION') {
            message = `🚨 *Nova Reserva!*\n\n` +
                `📌 Campanha: ${rifaTitle}\n` +
                `👤 Cliente: ${buyerName}\n` +
                `🔢 Cotas: ${numbers.join(', ')}\n` +
                `💰 Valor: ${formattedAmount}\n\n` +
                `Aguardando pagamento...`
        } else {
            message = `✅ *Pagamento Confirmado!*\n\n` +
                `📌 Campanha: ${rifaTitle}\n` +
                `👤 Cliente: ${buyerName}\n` +
                `🔢 Cotas: ${numbers.join(', ')}\n` +
                `💰 Valor: ${formattedAmount}\n\n` +
                `Venda concluída com sucesso!`
        }

        return sendWhatsAppMessage(whatsapp, message)
    }
}
