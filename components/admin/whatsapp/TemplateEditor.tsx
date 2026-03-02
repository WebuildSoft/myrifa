"use client"

import { useState } from "react"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Settings, Info } from "lucide-react"
import { toast } from "sonner"

interface TemplateEditorProps {
    title: string
    description: string
    value: string
    onSave: (newValue: string) => Promise<void>
    placeholders: { tag: string; label: string }[]
}

export default function TemplateEditor({ title, description, value, onSave, placeholders }: TemplateEditorProps) {
    const [tempValue, setTempValue] = useState(value)
    const [isSaving, setIsSaving] = useState(false)
    const [open, setOpen] = useState(false)

    async function handleSave() {
        setIsSaving(true)
        try {
            await onSave(tempValue)
            setOpen(false)
            toast.success("Template atualizado!")
        } catch (error) {
            toast.error("Erro ao salvar template.")
        } finally {
            setIsSaving(false)
        }
    }

    const insertTag = (tag: string) => {
        setTempValue(prev => prev + tag)
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="ghost" size="icon" className="text-slate-500 hover:text-white hover:bg-white/5 rounded-full">
                    <Settings className="h-4 w-4" />
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl bg-[#020617] border-white/[0.05] text-slate-200 backdrop-blur-3xl shadow-[0_0_50px_rgba(0,0,0,0.5)]">
                <DialogHeader>
                    <DialogTitle className="text-xl font-black text-white uppercase italic tracking-tight">{title}</DialogTitle>
                    <DialogDescription className="text-slate-500 font-medium">
                        {description}
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-6 py-4">
                    <div className="space-y-4">
                        <div className="flex flex-wrap gap-2">
                            {placeholders.map((p) => (
                                <button
                                    key={p.tag}
                                    onClick={() => insertTag(p.tag)}
                                    className="px-2 py-1 rounded-md bg-white/5 border border-white/10 text-[10px] font-bold text-indigo-400 hover:bg-indigo-500/10 hover:border-indigo-500/30 transition-all uppercase tracking-widest"
                                    title={p.label}
                                >
                                    {p.tag}
                                </button>
                            ))}
                        </div>

                        <Textarea
                            value={tempValue}
                            onChange={(e) => setTempValue(e.target.value)}
                            placeholder="Escreva sua mensagem aqui..."
                            className="min-h-[200px] bg-white/[0.02] border-white/[0.08] focus:border-indigo-500/50 focus:ring-indigo-500/20 text-sm font-medium leading-relaxed custom-scrollbar"
                        />
                    </div>

                    <div className="rounded-xl p-4 bg-indigo-500/5 border border-indigo-500/10 flex items-start space-x-3">
                        <Info className="h-5 w-5 text-indigo-400 shrink-0 mt-0.5" />
                        <p className="text-xs text-slate-400 leading-relaxed">
                            Use as tags acima para inserir dados dinâmicos. O WhatsApp suporta negrito com <span className="text-white font-bold">*texto*</span> e itálico com <span className="text-white italic">_texto_</span>.
                        </p>
                    </div>
                </div>

                <DialogFooter>
                    <Button
                        variant="ghost"
                        onClick={() => setOpen(false)}
                        className="text-slate-400 hover:text-white hover:bg-white/5 font-black uppercase text-[10px] tracking-widest"
                    >
                        Cancelar
                    </Button>
                    <Button
                        onClick={handleSave}
                        disabled={isSaving}
                        className="bg-indigo-500 hover:bg-indigo-600 text-white shadow-lg shadow-indigo-500/20 px-8 font-black uppercase text-[10px] tracking-widest h-10 rounded-xl"
                    >
                        {isSaving ? "Salvando..." : "Salvar Template"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
