"use client"

import { Copy, Check } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"

export default function CopyLinkButton({ url }: { url: string }) {
    const [copied, setCopied] = useState(false)

    const handleCopy = () => {
        navigator.clipboard.writeText(url)
        setCopied(true)
        toast.success("Link copiado!")
        setTimeout(() => setCopied(false), 2000)
    }

    return (
        <button
            className="p-2 text-primary hover:bg-primary/10 rounded-2xl transition-colors active:scale-90"
            onClick={handleCopy}
            title="Copiar Link"
        >
            {copied ? <Check className="h-5 w-5 text-emerald-500" /> : <Copy className="h-5 w-5" />}
        </button>
    )
}
