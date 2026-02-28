import { Ticket } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export function EmptyRifaState() {
    return (
        <Card className="rounded-3xl border-dashed border-2 border-primary/10 bg-primary/5 py-16">
            <CardContent className="flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-primary shadow-sm mb-6">
                    <Ticket className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Sua primeira campanha começa aqui</h3>
                <p className="text-slate-500 mb-8 max-w-sm">Você ainda não criou nenhuma campanha. Comece agora e alcance seus objetivos de arrecadação digital.</p>
                <Button asChild className="rounded-xl px-8 font-bold text-white">
                    <Link href="/dashboard/rifas/nova">Lançar Campanha Agora</Link>
                </Button>
            </CardContent>
        </Card>
    )
}
