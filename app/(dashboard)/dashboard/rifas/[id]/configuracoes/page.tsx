import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { notFound, redirect } from "next/navigation"
import { RifaStatus } from "@prisma/client"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { ConfiguracoesClient } from "./ConfiguracoesClient"

export default async function RifaConfigPage({ params }: { params: Promise<{ id: string }> }) {
    const session = await auth()
    if (!session?.user?.id) redirect("/login")

    const { id } = await params

    const rifa = await prisma.rifa.findUnique({
        where: {
            id,
            userId: session.user.id
        }
    })

    if (!rifa || (rifa.status as string) === "DELETED") notFound()

    return (
        <div className="space-y-6 max-w-3xl mx-auto">
            <div className="flex items-center gap-4">
                <Button variant="outline" size="icon" asChild>
                    <Link href={`/dashboard/rifas/${rifa.id}`}>
                        <ArrowLeft className="h-4 w-4" />
                    </Link>
                </Button>
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Configurações</h1>
                    <p className="text-muted-foreground mt-1">
                        Ajuste o comportamento e a visibilidade da sua rifa: <span className="font-medium text-foreground">{rifa.title}</span>
                    </p>
                </div>
            </div>

            <ConfiguracoesClient rifa={rifa} />
        </div>
    )
}
