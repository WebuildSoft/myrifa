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

        const message = templates.newReservation(
            buyerName,
            rifaTitle,
            numbers,
            formattedAmount,
            checkoutUrl
        )

        return sendWhatsAppMessage(whatsapp, message)
    }
}
