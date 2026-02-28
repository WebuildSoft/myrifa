"use client"

import { useState, useCallback } from "react"
import { toast } from "sonner"

interface UseShareProps {
    url: string
    title: string
    text?: string
}

export function useShare({ url, title, text }: UseShareProps) {
    const [copied, setCopied] = useState(false)

    const copyToClipboard = useCallback(async () => {
        try {
            if (navigator?.clipboard?.writeText) {
                await navigator.clipboard.writeText(url)
                setCopied(true)
                toast.success("Link copiado com sucesso!")
                setTimeout(() => setCopied(false), 2000)
            } else {
                throw new Error("Clipboard API not available")
            }
        } catch (err) {
            console.error("Failed to copy:", err)
            // Fallback for older browsers or non-secure contexts
            try {
                const textArea = document.createElement("textarea")
                textArea.value = url
                textArea.style.position = "fixed"
                textArea.style.left = "-999999px"
                textArea.style.top = "-999999px"
                document.body.appendChild(textArea)
                textArea.focus()
                textArea.select()
                document.execCommand('copy')
                textArea.remove()
                setCopied(true)
                toast.success("Link copiado com sucesso!")
                setTimeout(() => setCopied(false), 2000)
            } catch (fallbackErr) {
                console.error("Fallback failed:", fallbackErr)
                toast.error("Erro ao copiar link. Tente copiar manualmente na caixa de texto.")
            }
        }
    }, [url])

    const nativeShare = useCallback(async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title,
                    text: text || title,
                    url,
                })
            } catch (err) {
                console.error("Error sharing:", err)
            }
        } else {
            // Fallback if native share is not available
            copyToClipboard()
        }
    }, [url, title, text, copyToClipboard])

    return {
        copied,
        copyToClipboard,
        nativeShare,
        canNativeShare: typeof navigator !== "undefined" && !!navigator?.share,
    }
}
