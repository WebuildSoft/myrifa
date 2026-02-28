import { MercadoPagoConfig, Payment } from "mercadopago"

const client = new MercadoPagoConfig({
    accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN || ''
})

export interface CreatePixPaymentParams {
    amount: number
    description: string
    externalReference: string
    buyer: {
        name: string
        email?: string | null
    }
}

export class PaymentService {
    static async createPixPayment({ amount, description, externalReference, buyer }: CreatePixPaymentParams) {
        const payment = new Payment(client)

        const [firstName, ...lastNameParts] = buyer.name.split(" ")
        const lastName = lastNameParts.join(" ") || "Silva"

        const response = await payment.create({
            body: {
                transaction_amount: amount,
                description,
                payment_method_id: 'pix',
                payer: {
                    email: buyer.email || "contato@rifa.com.br",
                    first_name: firstName,
                    last_name: lastName,
                    identification: { type: 'CPF', number: '19119119100' } // Placeholder for MP sandbox
                },
                external_reference: externalReference
            }
        })

        return {
            id: response.id?.toString(),
            qrCode: response.point_of_interaction?.transaction_data?.qr_code_base64,
            qrCodeCopy: response.point_of_interaction?.transaction_data?.qr_code
        }
    }
}
