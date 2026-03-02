import { auth } from "@/auth"
import { redirect } from "next/navigation"
import ConfigClient from "@/components/admin/ConfigClient"

export const dynamic = 'force-dynamic'

export default async function ConfigPage() {
    const session = await auth()

    if (!session?.user || !["ADMIN", "SUPER_ADMIN"].includes(session.user.role)) {
        redirect("/sistema-x7k2/login")
    }

    return <ConfigClient />
}
