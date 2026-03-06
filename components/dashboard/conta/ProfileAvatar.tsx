"use client"

import { useState } from "react"
import { User, Camera, Loader2, Image as ImageIcon } from "lucide-react"
import Image from "next/image"
import { uploadImageAction } from "@/actions/upload"
import { updateUserImage } from "@/actions/user/settings"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

interface ProfileAvatarProps {
    initialImage?: string | null
    userId: string
}

export function ProfileAvatar({ initialImage, userId }: ProfileAvatarProps) {
    const router = useRouter()
    const [image, setImage] = useState(initialImage)
    const [isUploading, setIsUploading] = useState(false)

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        setIsUploading(true)
        const formData = new FormData()
        formData.append("file", file)

        try {
            const uploadRes = await uploadImageAction(formData)
            if (uploadRes.url) {
                await updateUserImage(uploadRes.url)
                setImage(uploadRes.url)
                router.refresh()
                toast.success("Foto do perfil atualizada!")
            }
        } catch (error) {
            toast.error("Erro ao fazer upload da imagem.")
        } finally {
            setIsUploading(false)
        }
    }

    return (
        <div className="relative group shrink-0">
            <div className="size-16 md:size-20 rounded-2xl bg-gradient-to-br from-slate-800 to-slate-950 border-2 border-slate-700/50 flex items-center justify-center shadow-xl overflow-hidden relative">
                {image ? (
                    <Image
                        src={image}
                        alt="Profile"
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                        unoptimized
                    />
                ) : (
                    <User className="size-8 text-slate-600 group-hover:text-primary transition-colors duration-500" />
                )}

                {isUploading && (
                    <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center z-20">
                        <Loader2 className="size-6 text-primary animate-spin" />
                    </div>
                )}

                <label
                    htmlFor="avatar-upload"
                    className="absolute inset-0 bg-black/40 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-all flex flex-col items-center justify-center cursor-pointer z-10"
                >
                    <Camera className="size-4 text-white mb-0.5" />
                    <span className="text-[7px] font-black text-white uppercase tracking-tighter">Bio</span>
                    <input
                        type="file"
                        id="avatar-upload"
                        className="hidden"
                        accept="image/*"
                        onChange={handleFileUpload}
                        disabled={isUploading}
                    />
                </label>
            </div>

            {/* Badge de Verificado Premium */}
            <div className="absolute -bottom-1 -right-1 size-6 bg-primary rounded-lg border-[3px] border-white dark:border-slate-900 flex items-center justify-center shadow-lg group-hover:rotate-12 transition-transform">
                <ImageIcon className="size-2.5 text-slate-950" />
            </div>
        </div>
    )
}
