"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
} from "@/components/ui/dialog"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { MessageSquarePlus, Send, Loader2, AlertCircle, Sparkles } from "lucide-react"
import { submitFeedbackAction } from "@/actions/user/feedback"
import { toast } from "sonner"

const feedbackSchema = z.object({
    type: z.enum(["ERROR", "SUGGESTION", "OTHER"]),
    content: z.string().min(10, "O feedback deve ter pelo menos 10 caracteres"),
})

type FeedbackFormValues = z.infer<typeof feedbackSchema>

export function FeedbackModal() {
    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(false)

    const form = useForm<FeedbackFormValues>({
        resolver: zodResolver(feedbackSchema),
        defaultValues: {
            type: "SUGGESTION",
            content: "",
        },
    })

    async function onSubmit(data: FeedbackFormValues) {
        setLoading(true)
        try {
            const formData = new FormData()
            formData.append("type", data.type)
            formData.append("content", data.content)

            const result = await submitFeedbackAction(formData)

            if (result?.success) {
                toast.success("Feedback enviado com sucesso! Obrigado pela colaboração.")
                setOpen(false)
                form.reset()
            } else {
                toast.error(result?.error || "Ocorreu um erro ao enviar seu feedback.")
            }
        } catch (error) {
            toast.error("Erro inesperado ao enviar feedback.")
        } finally {
            setLoading(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" className="w-full bg-white dark:bg-slate-800 border-primary/20 text-primary hover:bg-primary hover:text-white transition-all text-[11px] font-bold h-8 gap-2">
                    <MessageSquarePlus className="h-4 w-4" />
                    Enviar Sugestão
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] rounded-[2.5rem] p-0 overflow-hidden border-none shadow-2xl">
                <div className="bg-primary p-8 text-white relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-8 opacity-10">
                        <MessageSquarePlus className="h-20 w-20" />
                    </div>
                    <div className="relative z-10 space-y-2">
                        <p className="text-primary-foreground/70 text-xs font-bold uppercase tracking-widest">Feedback e Melhorias</p>
                        <DialogTitle className="text-3xl font-black">Nos Ajude a Evoluir</DialogTitle>
                    </div>
                </div>

                <div className="p-8 bg-white dark:bg-slate-950">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                            <FormField
                                control={form.control}
                                name="type"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-xs font-bold uppercase tracking-wider text-slate-500">Tipo de Contato</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger className="h-12 rounded-xl border-slate-200 dark:border-slate-800">
                                                    <SelectValue placeholder="Selecione o tipo..." />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent className="rounded-xl border-slate-200 dark:border-slate-800">
                                                <SelectItem value="SUGGESTION" className="flex items-center gap-2">
                                                    <div className="flex items-center gap-2">
                                                        <Sparkles className="h-4 w-4 text-amber-500" />
                                                        Sugestão de Melhoria
                                                    </div>
                                                </SelectItem>
                                                <SelectItem value="ERROR" className="flex items-center gap-2">
                                                    <div className="flex items-center gap-2">
                                                        <AlertCircle className="h-4 w-4 text-red-500" />
                                                        Relatar um Erro
                                                    </div>
                                                </SelectItem>
                                                <SelectItem value="OTHER">Outros Assuntos</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="content"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-xs font-bold uppercase tracking-wider text-slate-500">Sua Mensagem</FormLabel>
                                        <FormControl>
                                            <Textarea
                                                placeholder="Descreva detalhadamente o erro ou sua sugestão..."
                                                className="min-h-[120px] rounded-2xl border-slate-200 dark:border-slate-800 resize-none"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <DialogFooter className="pt-4">
                                <Button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full h-12 rounded-xl font-bold uppercase tracking-wider shadow-lg shadow-primary/20 gap-2"
                                >
                                    {loading ? (
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                    ) : (
                                        <Send className="h-4 w-4" />
                                    )}
                                    {loading ? "Enviando..." : "Enviar agora"}
                                </Button>
                            </DialogFooter>
                        </form>
                    </Form>
                </div>
            </DialogContent>
        </Dialog>
    )
}
