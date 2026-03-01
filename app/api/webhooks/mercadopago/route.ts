import { prisma } from "@/lib/prisma"
import { MercadoPagoConfig, Payment } from 'mercadopago'
import { sendWhatsAppMessage, templates } from "@/lib/evolution"
import crypto from 'crypto'

export async function POST(request: Request) {
    try {
        const url = new URL(request.url)
        const signature = request.headers.get("x-signature")
        const requestId = request.headers.get("x-request-id")

        let body: any = {}
        const rawBody = await request.text()

        try {
            body = JSON.parse(rawBody)
            console.log("Webhook body recebido:", body)
        } catch (e) {
            console.log("No JSON body in webhook")
        }

        const id = url.searchParams.get("data.id") || url.searchParams.get("id") || body?.data?.id || body?.id
        const topic = url.searchParams.get("topic") || url.searchParams.get("type") || body?.type || body?.topic
        const rifaId = url.searchParams.get("rifaId")

        // 2. Processing
        console.log(`Processing webhook - Topic: ${topic}, RifaId: ${rifaId}, ID: ${id}`)

        if (topic === "payment" || topic === "merchant_order") {
            if (!id) {
                return Response.json({ error: "Missing ID" }, { status: 400 })
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
            const paymentInfo = await paymentApi.get({ id: id })

            const externalReference = paymentInfo.external_reference // This should be our Transaction ID
            const status = paymentInfo.status

            console.log(`Payment check - ID: ${id}, Status: ${status}, Ref: ${externalReference}`)

            // 2. Idempotência com base no Status (L02)
            const eventId = `mp_${id}_${status}`
            const existingEvent = await (prisma as any).webhookEvent.findUnique({
                where: { id: eventId }
            })

            if (existingEvent) {
                console.log(`Event ${eventId} already processed or status unchanged. Skipping.`)
                return Response.json({ success: true, message: "Already processed" })
            }

            // Registrar evento para evitar processamento duplo do mesmo status
            await (prisma as any).webhookEvent.create({
                data: { id: eventId, provider: 'MERCADO_PAGO', type: topic }
            })

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
                    await prisma.$transaction(async (tx) => {
                        // Update transaction
                        await tx.transaction.update({
                            where: { id: transaction.id },
                            data: { status: "PAID", paidAt: new Date() }
                        })

                        // Update numbers
                        await tx.rifaNumber.updateMany({
                            where: { buyerId: transaction.buyerId, rifaId: transaction.rifaId },
                            data: { status: "PAID" }
                        })

                        // Update Rifa total raised
                        await tx.rifa.update({
                            where: { id: transaction.rifaId },
                            data: { totalRaised: { increment: transaction.amount } }
                        })
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

                    // Create In-App Notification for the owner
                    const formattedAmount = new Intl.NumberFormat("pt-BR", {
                        style: "currency",
                        currency: "BRL"
                    }).format(Number(transaction.amount))

                    await prisma.notification.create({
                        data: {
                            userId: transaction.rifa.userId,
                            title: "Novo pagamento recebido! 🎉",
                            message: `Você recebeu ${formattedAmount} de ${transaction.buyer.name} para a campanha "${transaction.rifa.title}".`,
                            read: false
                        }
                    })

                    console.log(`Payment confirmed for transaction ${transaction.id}, numbers secured and owner notified!`)
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
                        where: { buyerId: transaction.buyerId, status: "RESERVED", rifaId: transaction.rifaId },
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
