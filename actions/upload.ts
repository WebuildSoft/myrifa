"use server"

import { supabase } from "@/lib/supabase"
import { auth } from "@/auth"
import { v4 as uuidv4 } from 'uuid'
import { prisma } from "@/lib/prisma"

const ALLOWED_TYPES = {
    'image/jpeg': [0xFF, 0xD8, 0xFF],
    'image/png': [0x89, 0x50, 0x4E, 0x47],
    'image/gif': [0x47, 0x49, 0x46, 0x38],
    'image/webp': [0x52, 0x49, 0x46, 0x46] // RIFF
}

export async function uploadImageAction(formData: FormData) {
    const session = await auth()
    if (!session?.user?.id) return { error: "Não autorizado" }

    const file = formData.get("file") as File
    if (!file) return { error: "Nenhum arquivo enviado" }

    // basic type check
    if (!ALLOWED_TYPES[file.type as keyof typeof ALLOWED_TYPES]) {
        return { error: "Formato de arquivo não suportado. Use JPG, PNG, GIF ou WebP." }
    }

    // Validate size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
        return { error: "A imagem deve ter no máximo 5MB" }
    }

    try {
        const arrayBuffer = await file.arrayBuffer()
        const buffer = Buffer.from(arrayBuffer)

        // Magic Number Verification (Security)
        const signature = ALLOWED_TYPES[file.type as keyof typeof ALLOWED_TYPES]
        for (let i = 0; i < signature.length; i++) {
            if (buffer[i] !== signature[i]) {
                return { error: "Arquivo inválido ou corrompido. A assinatura da imagem não confere." }
            }
        }

        // Additional WebP check for "WEBP" at offset 8
        if (file.type === 'image/webp') {
            const webpHeader = buffer.toString('ascii', 8, 12)
            if (webpHeader !== 'WEBP') {
                return { error: "Arquivo WebP inválido." }
            }
        }

        // Plan Check (Security & Business Logic)
        const user = await prisma.user.findUnique({
            where: { id: session.user.id },
            select: { plan: true }
        })

        if (!user) return { error: "Usuário não encontrado" }

        // Note: NovaRifaPage and EditRifaForm handle the logic of which images use 
        // this action. Here we just ensure basic safety. 
        // Future improvement: track image usage per user in DB.

        const fileExt = file.name.split('.').pop()
        const fileName = `${session.user.id}/${uuidv4()}.${fileExt}`
        const bucketName = 'rifas'

        const { data, error } = await supabase.storage
            .from(bucketName)
            .upload(fileName, buffer, {
                contentType: file.type,
                upsert: true
            })

        if (error) {
            console.error("Supabase upload error:", error)
            return { error: "Erro ao fazer upload para o storage" }
        }

        const { data: { publicUrl } } = supabase.storage
            .from(bucketName)
            .getPublicUrl(fileName)

        return { success: true, url: publicUrl }
    } catch (error) {
        console.error("Upload action error:", error)
        return { error: "Erro interno no servidor de upload" }
    }
}
