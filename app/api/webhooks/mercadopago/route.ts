import { prisma } from "@/lib/prisma"
import { MercadoPagoConfig, Payment } from 'mercadopago'
import { sendWhatsAppMessage, templates } from "@/lib/evolution"

const client = new MercadoPagoConfig({ accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN || '' })

export async function POST(request: Request) {
    try {
        const url = new URL(request.url)
        const topic = url.searchParams.get("topic") || url.searchParams.get("type")

        if (topic === "payment") {
            const paymentId = url.searchParams.get("data.id") || url.searchParams.get("id")

            if (!paymentId) {
                return Response.json({ error: "Missing payment ID" }, { status: 400 })
            }

            // Verify payment with MP
            const paymentApi = new Payment(client)
            const paymentInfo = await paymentApi.get({ id: paymentId })

            const externalReference = paymentInfo.external_reference // This should be our Transaction ID
            const status = paymentInfo.status

            if (externalReference && status === "approved") {
                // Find transaction
                const transaction = await prisma.transaction.findUnique({
                    where: { id: externalReference },
                    include: {
                        buyer: true,
                        rifa: true
                    }
                })

                if (transaction && transaction.status !== "PAID") {
                    // Update transaction
                    await prisma.transaction.update({
                        where: { id: transaction.id },
                        data: { status: "PAID", paidAt: new Date() }
                    })

                    // Update numbers
                    await prisma.rifaNumber.updateMany({
                        where: { buyerId: transaction.buyerId },
                        data: { status: "PAID" }
                    })

                    // Trigger WhatsApp confirmation
                    if (transaction.buyer.whatsapp) {
                        const message = templates.paymentConfirmed(
                            transaction.buyer.name,
                            transaction.rifa.title,
                            transaction.numbers
                        )
                        await sendWhatsAppMessage(transaction.buyer.whatsapp, message)
                    }
                    console.log(`Payment confirmed for transaction ${transaction.id}, numbers secured!`)
                }
            } else if (externalReference && (status === "cancelled" || status === "rejected")) {
                // Free numbers if failed
                const transaction = await prisma.transaction.findUnique({
                    where: { id: externalReference }
                })

                if (transaction && transaction.status === "PENDING") {
                    await prisma.transaction.update({
                        where: { id: transaction.id },
                        data: { status: "CANCELLED" }
                    })

                    await prisma.rifaNumber.updateMany({
                        where: { buyerId: transaction.buyerId, status: "RESERVED" },
                        data: { status: "AVAILABLE", buyerId: null }
                    })
                }
            }
        }

        return Response.json({ success: true })
    } catch (error) {
        console.error("Webhook Error:", error)
        return Response.json({ error: "Webhook Error" }, { status: 500 })
    }
}
