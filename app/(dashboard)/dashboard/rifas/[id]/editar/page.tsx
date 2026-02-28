import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { notFound, redirect } from "next/navigation"
import { RifaStatus } from "@prisma/client"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    ArrowLeft,
    Settings,
    Info,
    Layout
} from "lucide-react"
import EditRifaForm from "./EditRifaForm"

export default async function EditarRifaPage({ params }: { params: Promise<{ id: string }> }) {
    const session = await auth()
    if (!session?.user?.id) redirect("/login")

    const { id } = await params

    const rifa = await prisma.rifa.findUnique({
        where: {
            id,
            userId: session.user.id
        },
        include: {
            prizes: {
                orderBy: { position: "asc" }
            }
        }
    })

    if (!rifa || (rifa.status as string) === "DELETED") notFound()

    return (
        <div className="min-h-screen bg-[#f7f6f8] dark:bg-[#171121] text-slate-900 dark:text-slate-100 pb-24 -m-4 md:-m-8">
            {/* Header */}
            <header className="sticky top-0 z-50 bg-white/80 dark:bg-[#171121]/80 backdrop-blur-md px-6 py-4 flex items-center justify-between border-b border-primary/10">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" className="rounded-full hover:bg-primary/10 group" asChild>
                        <Link href={`/dashboard/rifas/${rifa.id}`}>
                            <ArrowLeft className="h-5 w-5 text-primary group-hover:-translate-x-1 transition-transform" />
                        </Link>
                    </Button>
                    <div>
                        <h1 className="font-sans font-black text-lg text-slate-900 dark:text-white leading-none">
                            Editar Campanha
                        </h1>
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mt-1">
                            Atualize sua campanha
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" className="rounded-full hover:bg-primary/10 text-primary">
                        <Settings className="h-5 w-5" />
                    </Button>
                </div>
            </header>

            <main className="p-6 space-y-8 max-w-2xl mx-auto">
                {/* Info Alert */}
                <div className="bg-primary/5 dark:bg-primary/10 border border-primary/20 p-5 rounded-[2rem] flex items-start gap-4">
                    <div className="size-10 rounded-2xl bg-primary/20 flex items-center justify-center text-primary shrink-0">
                        <Info className="h-5 w-5" />
                    </div>
                    <div>
                        <h4 className="font-black text-sm text-primary uppercase tracking-widest mb-1">Nota importante</h4>
                        <p className="text-xs text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
                            Por questões de conformidade e segurança do comprador, a quantidade de números e o preço da cota não podem ser alterados após o início da arrecadação.
                        </p>
                    </div>
                </div>

                <EditRifaForm
                    rifa={{
                        id: rifa.id,
                        title: rifa.title,
                        description: rifa.description,
                        rules: rifa.rules,
                        coverImage: rifa.coverImage,
                        images: rifa.images
                    }}
                    initialPrizes={(rifa as any).prizes.map((p: any) => ({
                        id: p.id,
                        title: p.title,
                        position: p.position
                    }))}
                />
            </main>
        </div>
    )
}
