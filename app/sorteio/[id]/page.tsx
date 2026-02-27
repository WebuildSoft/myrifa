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
            },
            prizes: {
                orderBy: { position: "asc" },
                include: { winner: true }
            }
        }
    })

    if (!rifa) notFound()

    return (
        <SorteioClient
            rifaId={rifa.id}
            title={rifa.title}
            totalPaid={rifa._count.numbers}
            totalNumbers={rifa.totalNumbers}
            numberPrice={Number(rifa.numberPrice)}
            minPercent={rifa.minPercentToRaffle}
            initialPrizes={rifa.prizes.map(p => ({
                id: p.id,
                title: p.title,
                position: p.position,
                winnerId: p.winnerId,
                winnerNumber: p.winnerNumber,
                winnerName: p.winner?.name,
                drawnAt: p.drawnAt
            }))}
            isDrawn={rifa.status === "DRAWN"}
        />
    )
}
