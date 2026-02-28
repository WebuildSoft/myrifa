import { MercadoPagoConfig, Payment } from "mercadopago"
import { headers } from "next/headers"

export interface CreatePixPaymentParams {
    amount: number
    description: string
    externalReference: string
    buyer: {
        name: string
        email?: string | null
    }
    accessToken: string
    rifaId: string
}

export class PaymentService {
    static async createPixPayment({ amount, description, externalReference, buyer, accessToken, rifaId }: CreatePixPaymentParams) {

        // Dynamically instantiate the client for the specific user generating the sale
        const client = new MercadoPagoConfig({
            accessToken: accessToken,
            options: { timeout: 10000 }
        })

        const payment = new Payment(client)

        const [firstName, ...lastNameParts] = buyer.name.split(" ")
        const lastName = lastNameParts.join(" ") || "Silva"

        // Discover base URL dynamically or fallback to env for the webhook notification URL
        const headersList = await headers()
        const host = headersList.get("host") || process.env.NEXTAUTH_URL?.replace("https://", "") || "myrifa.com.br"
        const protocol = process.env.NODE_ENV === "development" ? "https" : "https" // MP requires HTTPS even in dev basically, so use Ngrok/localtunnel if testing

        const notificationUrl = `${protocol}://${host}/api/webhooks/mercadopago?rifaId=${rifaId}`

        const response = await payment.create({
            body: {
                transaction_amount: amount,
                description,
                payment_method_id: 'pix',
                payer: {
                    email: buyer.email || "contato@rifa.com.br",
                    first_name: firstName,
                    last_name: lastName,
                    identification: { type: 'CPF', number: '19119119100' } // Placeholder for MP rules
                },
                external_reference: externalReference,
                notification_url: notificationUrl
            }
        })

        return {
            id: response.id?.toString(),
            qrCode: response.point_of_interaction?.transaction_data?.qr_code_base64,
            qrCodeCopy: response.point_of_interaction?.transaction_data?.qr_code
        }
    }
}
