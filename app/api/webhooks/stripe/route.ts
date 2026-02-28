import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"
import Stripe from "stripe"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: "2024-12-18.acacia" as any
})

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!

export async function POST(req: Request) {
    const body = await req.text()
    const signature = req.headers.get("stripe-signature")!

    let event: Stripe.Event

    try {
        event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
    } catch (err: any) {
        console.error(`Webhook signature verification failed: ${err.message}`)
        return NextResponse.json({ error: err.message }, { status: 400 })
    }

    // Handle the event
    switch (event.type) {
        case "checkout.session.completed": {
            const session = event.data.object as Stripe.Checkout.Session
            const userId = session.client_reference_id
            const priceId = session.line_items?.data[0]?.price?.id || (session as any).metadata?.priceId

            if (!userId) {
                console.error("Missing client_reference_id in Stripe session")
                break
            }

            // Map Price ID to Plan Enum
            let plan: "FREE" | "PRO" | "INSTITUTIONAL" = "FREE"
            if (priceId === "price_1T5s30BwZiN8YdGtkCBsDnmm") plan = "PRO"
            if (priceId === "price_1T5s31BwZiN8YdGts7cugSZ9") plan = "INSTITUTIONAL"

            if (plan !== "FREE") {
                await prisma.user.update({
                    where: { id: userId },
                    data: {
                        plan,
                        planExpiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days
                    }
                })

                await prisma.notification.create({
                    data: {
                        userId,
                        title: "Seu plano foi atualizado! 🚀",
                        message: `Parabéns! Você agora é um membro ${plan}. Aproveite todos os recursos.`,
                        read: false
                    }
                })

                console.log(`User ${userId} upgraded to ${plan}`)
            }
            break
        }
        case "checkout.session.expired": {
            const session = event.data.object as Stripe.Checkout.Session
            const userId = session.client_reference_id

            if (userId) {
                await prisma.notification.create({
                    data: {
                        userId,
                        title: "Sua tentativa de assinatura expirou ⏳",
                        message: "Vimos que você não concluiu o pagamento do seu plano. Alguma dúvida? Estamos aqui para ajudar!",
                        read: false
                    }
                })
                console.log(`Checkout expired for user ${userId}`)
            }
            break
        }
        case "payment_intent.payment_failed": {
            const paymentIntent = event.data.object as Stripe.PaymentIntent
            const userId = paymentIntent.metadata?.userId // Precisamos garantir que isso seja passado no metadata se possível

            if (userId) {
                await prisma.notification.create({
                    data: {
                        userId,
                        title: "Ops! Houve um problema no pagamento ❌",
                        message: "Não conseguimos processar o pagamento do seu plano. Verifique os dados do seu cartão ou tente outro método.",
                        read: false
                    }
                })
                console.log(`Payment failed for user ${userId}`)
            }
            break
        }
        case "customer.subscription.deleted": {
            const subscription = event.data.object as Stripe.Subscription
            const customerId = subscription.customer as string

            // Note: In a production app, we would search for the user by stripeCustomerId
            // For now, if moving forward with Stripe integration, we should save stripeCustomerId in User model
            break
        }
    }

    return NextResponse.json({ received: true })
}
