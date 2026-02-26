import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { notFound, redirect } from "next/navigation"
import SorteioClient from "./SorteioClient"

export default async function SorteioServerPage({ params }: { params: Promise<{ id: string }> }) {
    const session = await auth()
    if (!session?.user?.id) redirect("/login")

    const { id } = await params

    const rifa = await prisma.rifa.findUnique({
        where: {
            id,
            userId: session.user.id
        },
        include: {
            _count: {
                select: { numbers: { where: { status: "PAID" } } }
            }
        }
    })

    if (!rifa) notFound()

    let winnerName = null
    if (rifa.winnerId) {
        const winner = await prisma.buyer.findUnique({ where: { id: rifa.winnerId } })
        winnerName = winner?.name
    }

    return (
        <SorteioClient
            rifaId={rifa.id}
            title={rifa.title}
            totalPaid={rifa._count.numbers}
            totalNumbers={rifa.totalNumbers}
            numberPrice={Number(rifa.numberPrice)}
            minPercent={rifa.minPercentToRaffle}
            alreadyDrawn={rifa.status === "DRAWN"}
            winnerNumber={rifa.winnerNumber}
            winnerName={winnerName}
        />
    )
}
