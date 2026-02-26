"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
    Edit,
    ExternalLink,
    Trash2,
    MoreVertical,
    AlertTriangle,
    Loader2
} from "lucide-react"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { deleteRifaAction } from "@/actions/rifas"
import { toast } from "sonner"

interface RifaActionsClientProps {
    rifa: {
        id: string
        slug: string
        title: string
        status: string
    }
}

export default function RifaActionsClient({ rifa }: RifaActionsClientProps) {
    const router = useRouter()
    const [isDeleting, setIsDeleting] = useState(false)
    const [showDeleteDialog, setShowDeleteDialog] = useState(false)

    const handleDelete = async () => {
        setIsDeleting(true)
        try {
            const res = await deleteRifaAction(rifa.id)
            if (res.success) {
                toast.success("Rifa excluída com sucesso!")
                router.push("/dashboard/rifas")
            } else {
                toast.error(res.error || "Erro ao excluir rifa")
            }
        } catch (error) {
            toast.error("Erro inesperado ao excluir rifa")
        } finally {
            setIsDeleting(false)
            setShowDeleteDialog(false)
        }
    }

    return (
        <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="hidden md:flex rounded-full gap-2 font-black text-[10px] uppercase tracking-wider" asChild>
                <Link href={`/r/${rifa.slug}`} target="_blank">
                    <ExternalLink className="h-3 w-3" /> Ver Rifa
                </Link>
            </Button>

            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="rounded-full hover:bg-primary/10">
                        <MoreVertical className="h-5 w-5 text-primary" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 rounded-2xl p-2">
                    <DropdownMenuItem asChild className="rounded-xl cursor-pointer">
                        <Link href={`/r/${rifa.slug}`} target="_blank" className="flex items-center gap-2 py-2 w-full">
                            <ExternalLink className="h-4 w-4" /> Página Pública
                        </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild className="rounded-xl cursor-pointer">
                        <Link href={`/dashboard/rifas/${rifa.id}/editar`} className="flex items-center gap-2 py-2 text-primary font-bold w-full">
                            <Edit className="h-4 w-4" /> Editar Rifa
                        </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                        className="text-destructive focus:text-destructive flex items-center gap-2 py-2 rounded-xl cursor-pointer"
                        onSelect={() => setShowDeleteDialog(true)}
                    >
                        <Trash2 className="h-4 w-4" /> Excluir Rifa
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                <AlertDialogContent className="rounded-3xl border-primary/10">
                    <AlertDialogHeader>
                        <AlertDialogTitle className="flex items-center gap-2">
                            <AlertTriangle className="h-5 w-5 text-destructive" />
                            Confirmar Exclusão
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            Você tem certeza que deseja excluir a rifa <strong>"{rifa.title}"</strong>?
                            Esta ação não pode ser desfeita e removerá todos os dados associados.
                            <br /><br />
                            <span className="text-xs text-muted-foreground italic">
                                * Nota: Só é possível excluir rifas sem vendas aprovadas.
                            </span>
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter className="gap-2">
                        <AlertDialogCancel className="rounded-xl border-slate-200">Cancelar</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={(e) => {
                                e.preventDefault()
                                handleDelete()
                            }}
                            className="bg-destructive hover:bg-destructive/90 text-white rounded-xl gap-2 min-w-[100px]"
                            disabled={isDeleting}
                        >
                            {isDeleting ? (
                                <>
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                    Excluindo...
                                </>
                            ) : (
                                "Excluir"
                            )}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    )
}
