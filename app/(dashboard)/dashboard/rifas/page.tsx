import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"
import { RifaCardAdmin } from "@/components/dashboard/rifas/RifaCardAdmin"
import { EmptyRifaState } from "@/components/dashboard/rifas/EmptyRifaState"

export default async function RifasPage() {
    const session = await auth()
    if (!session?.user?.id) redirect("/login")

    const rifas = await prisma.rifa.findMany({
        where: {
            userId: session.user.id,
            status: { in: ["DRAFT", "ACTIVE", "PAUSED", "CLOSED", "DRAWN", "CANCELLED"] as any }
        },
        orderBy: { createdAt: "desc" },
        include: {
            _count: {
                select: { numbers: { where: { status: "PAID" } } }
            }
        }
    })

    return (
        <div className="space-y-8 pb-12">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Minhas Campanhas</h1>
                    <p className="text-slate-500 font-medium mt-1">
                        Gerencie e acompanhe o desempenho de todas as suas campanhas digitais.
                    </p>
                </div>
                <Button asChild className="h-12 px-6 rounded-2xl font-bold shadow-lg shadow-primary/20 hover:scale-105 transition-transform text-white">
                    <Link href="/dashboard/rifas/nova" className="flex items-center gap-2">
                        <PlusCircle className="h-5 w-5" />
                        Lançar Campanha
                    </Link>
                </Button>
            </div>

            {rifas.length === 0 ? (
                <EmptyRifaState />
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {rifas.map((rifa) => (
                        <RifaCardAdmin key={rifa.id} rifa={rifa as any} />
                    ))}
                </div>
            )}
        </div>
    )
}
