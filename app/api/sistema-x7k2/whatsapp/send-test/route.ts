import { NextResponse } from "next/server"
import { sendWhatsAppMessage } from "@/lib/evolution"
import { auth } from "@/auth"

export async function POST(req: Request) {
    const session = await auth()
    if (!session || !["SUPER_ADMIN", "ADMIN"].includes(session.user.role)) {
        return new NextResponse(null, { status: 404 })
    }

    try {
        const { number, message } = await req.json()
        if (!number || !message) {
            return NextResponse.json({ error: "Número e mensagem são obrigatórios" }, { status: 400 })
        }

        console.log(`[WA-TEST] Sending to ${number}: ${message}`)
        const result = await sendWhatsAppMessage(number, message)
        console.log(`[WA-TEST] Result:`, JSON.stringify(result))

        return NextResponse.json(result)
    } catch (error) {
        console.error(`[WA-TEST] Error:`, error)
        return NextResponse.json({ status: "error" }, { status: 500 })
    }
}
