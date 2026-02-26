import type { Metadata } from "next"
import { Plus_Jakarta_Sans } from "next/font/google"
import "./globals.css"
import { Toaster } from "sonner"

const plusJakartaSans = Plus_Jakarta_Sans({
    variable: "--font-plus-jakarta",
    subsets: ["latin"],
})

export const metadata: Metadata = {
    title: "RifaOnline - Sua plataforma de rifas e sorteios",
    description: "Crie, gerencie e participe de rifas online de forma segura e rápida.",
}

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <html lang="pt-BR">
            <body className={`${plusJakartaSans.variable} font-sans antialiased`}>
                {children}
                <Toaster position="top-right" richColors />
            </body>
        </html>
    )
}
