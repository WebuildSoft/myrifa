"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { UserCheck, UserX, ShieldAlert, MoreHorizontal, Loader2 } from "lucide-react"
import { toggleUserStatusAction, deleteUserAction } from "@/actions/admin"
import { toast } from "sonner"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"

interface UserActionsProps {
    userId: string
    isBlocked: boolean
    isSuperAdmin: boolean
}

export function UserActions({ userId, isBlocked, isSuperAdmin }: UserActionsProps) {
    const [isLoading, setIsLoading] = useState(false)

    async function handleToggleStatus() {
        setIsLoading(true)
        try {
            const res = await toggleUserStatusAction(userId, !isBlocked)
            if (res.error) {
                toast.error(res.error)
            } else {
                toast.success(isBlocked ? "Usuário desbloqueado!" : "Usuário bloqueado!")
            }
        } catch (error) {
            toast.error("Erro ao processar ação.")
        } finally {
            setIsLoading(false)
        }
    }

    async function handleDelete() {
        if (!confirm("Tem certeza que deseja remover este usuário permanentemente?")) return

        setIsLoading(true)
        try {
            const res = await deleteUserAction(userId)
            if (res.error) {
                toast.error(res.error)
            } else {
                toast.success("Usuário removido com sucesso!")
            }
        } catch (error) {
            toast.error("Erro ao remover usuário.")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="flex justify-end items-center gap-1 opacity-60 group-hover:opacity-100 transition-opacity">
            {isBlocked ? (
                <Button
                    variant="ghost"
                    size="icon"
                    className="h-9 w-9 rounded-xl text-emerald-500 hover:text-white hover:bg-emerald-500/20 transition-all"
                    title="Desbloquear"
                    onClick={handleToggleStatus}
                    disabled={isLoading}
                >
                    {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <UserCheck className="h-4.5 w-4.5" />}
                </Button>
            ) : (
                <Button
                    variant="ghost"
                    size="icon"
                    className="h-9 w-9 rounded-xl text-orange-400 hover:text-white hover:bg-orange-500/20 transition-all"
                    title="Bloquear"
                    onClick={handleToggleStatus}
                    disabled={isLoading}
                >
                    {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <UserX className="h-4.5 w-4.5" />}
                </Button>
            )}

            {isSuperAdmin && (
                <Button
                    variant="ghost"
                    size="icon"
                    className="h-9 w-9 rounded-xl text-red-500 hover:text-white hover:bg-red-500/20 transition-all"
                    title="Excluir"
                    onClick={handleDelete}
                    disabled={isLoading}
                >
                    {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ShieldAlert className="h-4.5 w-4.5" />}
                </Button>
            )}

            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-all">
                        <MoreHorizontal className="h-4.5 w-4.5" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48 bg-[#0a0f1d] border-white/5 backdrop-blur-xl">
                    <DropdownMenuItem className="text-slate-400 focus:text-white font-black text-[10px] uppercase tracking-widest cursor-pointer">
                        Ver Perfil
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-slate-400 focus:text-white font-black text-[10px] uppercase tracking-widest cursor-pointer">
                        Histórico de Rifas
                    </DropdownMenuItem>
                    {isSuperAdmin && (
                        <DropdownMenuItem
                            className="text-red-400 focus:text-red-300 font-black text-[10px] uppercase tracking-widest cursor-pointer"
                            onClick={handleDelete}
                        >
                            Remover Conta
                        </DropdownMenuItem>
                    )}
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    )
}
