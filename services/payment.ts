import { MercadoPagoConfig, Payment } from "mercadopago"
import { headers } from "next/headers"
import Stripe from "stripe"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
    apiVersion: "2024-12-18.acacia" as any
})

export interface CreatePixPaymentParams {
    amount: number
    description: string
    externalReference: string
    buyer: {
        name: string
        email?: string | null
    }
    accessToken?: string // Optional if using Stripe
    rifaId: string
    provider?: 'STRIPE' | 'MERCADO_PAGO'
}

export class PaymentService {
    static async createPixPayment(params: CreatePixPaymentParams) {
        if (params.provider === 'STRIPE') {
            return this.createStripePixPayment(params);
        }
        return this.createMercadoPagoPixPayment(params);
    }

    private static async createStripePixPayment({ amount, description, externalReference, buyer, rifaId }: CreatePixPaymentParams) {
        const paymentIntent = await stripe.paymentIntents.create({
            amount: Math.round(amount * 100), // Stripe uses cents
            currency: 'brl',
            payment_method_types: ['pix'],
            description,
            metadata: {
                transactionId: externalReference,
                rifaId,
                type: 'RIFA_PAYMENT'
            },
            receipt_email: buyer.email || undefined
        });

        // To get the QR Code, we need to confirm the payment intent with payment_method: { type: 'pix' }
        // or just return the client secret and handle it on frontend. 
        // But since we want the QR code now to show it like MP:
        const confirmedIntent = await stripe.paymentIntents.confirm(paymentIntent.id, {
            payment_method_data: { type: 'pix' },
            return_url: `${process.env.NEXT_PUBLIC_APP_URL}/r/success`
        });

        console.log(`[Stripe Response] Status: ${confirmedIntent.status}, Next Action: ${confirmedIntent.next_action?.type}`)

        const nextAction = confirmedIntent.next_action?.pix_display_qr_code;

        return {
            id: paymentIntent.id,
            qrCode: nextAction?.image_url_png, // URL for image
            qrCodeCopy: nextAction?.data // Text for copy/paste
        }
    }

    private static async createMercadoPagoPixPayment({ amount, description, externalReference, buyer, accessToken, rifaId }: CreatePixPaymentParams) {
        console.log(`[PaymentService] instantiating MercadoPagoConfig for rifa ${rifaId}. Token length: ${accessToken?.length || 0}`)

        if (!accessToken) {
            throw new Error("Token do Mercado Pago não fornecido para o processamento.")
        }

        const client = new MercadoPagoConfig({
            accessToken: accessToken,
            options: { timeout: 10000 }
        })

        const payment = new Payment(client)

        const [firstName, ...lastNameParts] = buyer.name.split(" ")
        const lastName = lastNameParts.join(" ") || "Silva"

        const headersList = await headers()
        const protocol = "https"
        const host = headersList.get("host") || "myrifa.com.br"

        // Priority: Dynamic host from request (if not localhost), then env var
        let baseUrl = `${protocol}://${host}`

        if (host.includes('localhost') || host.includes('127.0.0.1')) {
            if (process.env.NEXT_PUBLIC_APP_URL && !process.env.NEXT_PUBLIC_APP_URL.includes('localhost')) {
                baseUrl = process.env.NEXT_PUBLIC_APP_URL
            }
        }

        // Final check: Mercado Pago rejects localhost/127.0.0.1
        const isLocal = baseUrl.includes('localhost') || baseUrl.includes('127.0.0.1')
        const notificationUrl = isLocal
            ? undefined
            : `${baseUrl.replace(/\/$/, "")}/api/webhooks/mercadopago?rifaId=${rifaId}`

        console.log(`Creating MP Payment: ${externalReference}, URL: ${notificationUrl || 'NONE'}`)

        try {
            const response = await payment.create({
                body: {
                    transaction_amount: amount,
                    description,
                    payment_method_id: 'pix',
                    payer: {
                        email: buyer.email || "contato@rifa.com.br",
                        first_name: firstName,
                        last_name: lastName,
                        identification: { type: 'CPF', number: '19119119100' }
                    },
                    external_reference: externalReference,
                    ...(notificationUrl && { notification_url: notificationUrl })
                }
            })

            console.log(`[MP Response] Status: ${response.status}, ID: ${response.id}`)
            if (!response.point_of_interaction?.transaction_data) {
                console.log(`[MP Response] WARNING: Missing point_of_interaction.transaction_data. Full interaction:`, JSON.stringify(response.point_of_interaction))
            }

            return {
                id: response.id?.toString(),
                qrCode: response.point_of_interaction?.transaction_data?.qr_code_base64,
                qrCodeCopy: response.point_of_interaction?.transaction_data?.qr_code
            }
        } catch (error: any) {
            console.error("Mercado Pago Payment Error:", error)
            throw new Error(`Erro API Mercado Pago: ${error.message || 'Erro desconhecido'}`)
        }
    }
}
