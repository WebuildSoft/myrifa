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

        // 1. Validação de Assinatura (V01)
        // Nota: Em um modelo multi-tenant onde cada cliente tem seu token, a validação de assinatura
        // via Webhook Secret global é opcional. A segurança principal é garantida pelo "Double Check" (API Get) abaixo.
        if (process.env.MERCADOPAGO_WEBHOOK_SECRET && signature && requestId) {
            const parts = signature.split(',')
            let ts = ''
            let v1 = ''
            parts.forEach(p => {
                const [key, value] = p.trim().split('=')
                if (key === 'ts') ts = value
                if (key === 'v1') v1 = value
            })

            const manifest = `id:${id};request-id:${requestId};ts:${ts};`
            const hmac = crypto.createHmac('sha256', process.env.MERCADOPAGO_WEBHOOK_SECRET)
            hmac.update(manifest)
            const digest = hmac.digest('hex')

            if (digest !== v1) {
                console.error("V01: Invalid Mercado Pago Signature")
                return Response.json({ error: "Invalid signature" }, { status: 401 })
            }
        }

        // 2. Idempotência (L02)
        const eventId = `mp_${id}_${topic}`
        const existingEvent = await (prisma as any).webhookEvent.findUnique({
            where: { id: eventId }
        })

        if (existingEvent) {
            return Response.json({ success: true, message: "Already processed" })
        }

        console.log(`Processing webhook - Topic: ${topic}, RifaId: ${rifaId}`)

        if (topic === "payment") {
            if (!id) {
                return Response.json({ error: "Missing payment ID" }, { status: 400 })
            }

            if (!rifaId) {
                return Response.json({ error: "Missing rifaId for multi-tenant routing" }, { status: 400 })
            }

            // Registrar evento para evitar processamento duplo
            await (prisma as any).webhookEvent.create({
                data: { id: eventId, provider: 'MERCADO_PAGO', type: topic }
            })

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
