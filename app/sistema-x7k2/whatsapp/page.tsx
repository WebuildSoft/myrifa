import { auth } from "@/auth"
import { redirect } from "next/navigation"
import WhatsappManager from "@/components/admin/whatsapp/WhatsappManager"

export const dynamic = 'force-dynamic'

export default async function WhatsappPage() {
    const session = await auth()

    if (!session || !["SUPER_ADMIN", "ADMIN"].includes(session.user.role)) {
        redirect("/sistema-x7k2/login")
    }

    return (
        <div className="space-y-8 pb-12">
            <div>
                <h1 className="text-4xl font-black tracking-tight text-white mb-2 uppercase italic">
                    WhatsApp <span className="text-indigo-500">Center</span>
                </h1>
                <p className="text-slate-400 text-sm font-medium flex items-center">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 mr-2 shadow-[0_0_8px_rgba(99,102,241,0.5)] animate-pulse" />
                    Gerenciamento avançado da Evolution API v2.0
                </p>
            </div>

            <WhatsappManager />
        </div>
    )
}
