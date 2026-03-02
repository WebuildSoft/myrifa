import { NextResponse } from "next/server"
import { getEvolutionQR } from "@/lib/evolution"
import { auth } from "@/auth"

export async function GET() {
    const session = await auth()
    if (!session || !["SUPER_ADMIN", "ADMIN"].includes(session.user.role)) {
        return new NextResponse(null, { status: 404 })
    }

    try {
        const qr = await getEvolutionQR()
        return NextResponse.json(qr)
    } catch (error) {
        return NextResponse.json({ status: "error" }, { status: 500 })
    }
}
