"use client"

import { ReactNode } from "react"

interface SocialButtonProps {
    label: string
    href: string
    bg: string
    icon: ReactNode
}

export function SocialButton({ label, href, bg, icon }: SocialButtonProps) {
    return (
        <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className={`flex items-center justify-center gap-2 h-11 rounded-xl text-white text-sm font-bold transition-all ${bg}`}
        >
            {icon}
            {label}
        </a>
    )
}
