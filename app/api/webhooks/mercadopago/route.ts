import { prisma } from "@/lib/prisma"
import { MercadoPagoConfig, Payment } from 'mercadopago'
import { sendWhatsAppMessage, templates } from "@/lib/evolution"

export async function POST(request: Request) {
    try {
        const url = new URL(request.url)
        const topic = url.searchParams.get("topic") || url.searchParams.get("type")
        const rifaId = url.searchParams.get("rifaId")

        if (topic === "payment") {
            const paymentId = url.searchParams.get("data.id") || url.searchParams.get("id")

            if (!paymentId) {
                return Response.json({ error: "Missing payment ID" }, { status: 400 })
            }

            if (!rifaId) {
                return Response.json({ error: "Missing rifaId for multi-tenant routing" }, { status: 400 })
            }

            // Find the Rifa owner's Mercado Pago Token
            const rifa = await prisma.rifa.findUnique({
                where: { id: rifaId },
                include: { user: true }
            })

            const ownerToken = rifa?.user?.mercadoPagoAccessToken

            if (!ownerToken) {
                return Response.json({ error: "Rifa owner has no MP Token configured" }, { status: 400 })
            }

            // Verify payment with MP using the owner's specific token
            const client = new MercadoPagoConfig({ accessToken: ownerToken })
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
