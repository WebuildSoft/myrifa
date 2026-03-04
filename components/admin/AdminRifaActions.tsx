"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Trash2, XCircle, Loader2 } from "lucide-react"
import { cancelarRifaAction, deleteRifaAction } from "@/actions/rifas"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

interface AdminRifaActionsProps {
    rifaId: string
    status: string
}

export function AdminRifaActions({ rifaId, status }: AdminRifaActionsProps) {
    const [isLoading, setIsLoading] = useState(false)
    const router = useRouter()

    async function handleCancel() {
        if (!confirm("Deseja realmente cancelar esta rifa? Esta ação é irreversível.")) return

        setIsLoading(true)
        try {
            const res = await cancelarRifaAction(rifaId)
            if (res.error) {
                toast.error(res.error)
            } else {
                toast.success("Campanha cancelada com sucesso!")
                router.refresh()
            }
        } catch (error) {
            toast.error("Erro ao cancelar campanha.")
        } finally {
            setIsLoading(false)
        }
    }

    async function handleDelete() {
        if (!confirm("Deseja excluir permanentemente esta rifa? Todos os dados vinculados serão removidos.")) return

        setIsLoading(true)
        try {
            const res = await deleteRifaAction(rifaId)
            if (res.error) {
                toast.error(res.error)
            } else {
                toast.success("Campanha excluída com sucesso!")
                router.refresh()
            }
        } catch (error) {
            toast.error("Erro ao excluir campanha.")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="flex flex-row lg:flex-col gap-2 min-w-[140px]">
            {status !== 'CANCELLED' && status !== 'DRAWN' && (
                <Button
                    variant="ghost"
                    onClick={handleCancel}
                    disabled={isLoading}
                    className="w-full justify-start text-orange-400 hover:text-white hover:bg-orange-500/20 rounded-xl font-black text-[10px] uppercase tracking-widest gap-2"
                >
                    {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <XCircle className="h-4 w-4" />}
                    Cancelar
                </Button>
            )}
            <Button
                variant="ghost"
                onClick={handleDelete}
                disabled={isLoading}
                className="w-full justify-start text-red-500 hover:text-white hover:bg-red-500/20 rounded-xl font-black text-[10px] uppercase tracking-widest gap-2"
            >
                {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                Excluir
            </Button>
        </div>
    )
}
