import { NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"

export async function GET() {
    const session = await auth()
    if (!session || !["SUPER_ADMIN", "ADMIN"].includes(session.user.role)) {
        return new NextResponse(null, { status: 404 })
    }

    try {
        let config = await prisma.whatsappConfig.findUnique({
            where: { id: "default" }
        })

        if (!config) {
            config = await prisma.whatsappConfig.create({
                data: { id: "default" }
            })
        }

        return NextResponse.json(config)
    } catch (error) {
        console.error("Error fetching WA templates:", error)
        return NextResponse.json({ error: "Erro ao buscar templates" }, { status: 500 })
    }
}

export async function POST(req: Request) {
    const session = await auth()
    if (!session || !["SUPER_ADMIN", "ADMIN"].includes(session.user.role)) {
        return new NextResponse(null, { status: 404 })
    }

    try {
        const data = await req.json()
        const { newReservation, paymentConfirmed, winner } = data

        const config = await prisma.whatsappConfig.upsert({
            where: { id: "default" },
            update: { newReservation, paymentConfirmed, winner },
            create: { id: "default", newReservation, paymentConfirmed, winner }
        })

        return NextResponse.json(config)
    } catch (error) {
        console.error("Error saving WA templates:", error)
        return NextResponse.json({ error: "Erro ao salvar templates" }, { status: 500 })
    }
}
