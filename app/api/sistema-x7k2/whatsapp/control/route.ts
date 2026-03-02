import { NextResponse } from "next/server"
import { logoutEvolutionInstance, restartEvolutionInstance } from "@/lib/evolution"
import { auth } from "@/auth"

export async function POST(req: Request) {
    const session = await auth()
    if (!session || !["SUPER_ADMIN", "ADMIN"].includes(session.user.role)) {
        return new NextResponse(null, { status: 404 })
    }

    try {
        const { action } = await req.json()

        if (action === "logout") {
            const result = await logoutEvolutionInstance()
            return NextResponse.json(result)
        }

        if (action === "restart") {
            const result = await restartEvolutionInstance()
            return NextResponse.json(result)
        }

        return NextResponse.json({ error: "Ação inválida" }, { status: 400 })
    } catch (error) {
        return NextResponse.json({ status: "error" }, { status: 500 })
    }
}
