import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import WizardClient from "./WizardClient"

export const metadata = {
    title: 'Nova Campanha - MyRifa',
    description: 'Crie uma nova campanha de arrecadação',
}

export default async function NovaRifaPage() {
    const session = await auth()

    if (!session?.user?.id) {
        redirect("/login")
    }

    const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: { plan: true }
    })

    if (!user) {
        redirect("/login")
    }

    return <WizardClient userPlan={user.plan} />
}
