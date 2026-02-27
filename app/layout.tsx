import type { Metadata } from "next"
import { Plus_Jakarta_Sans } from "next/font/google"
import "./globals.css"
import { Toaster } from "sonner"

const plusJakartaSans = Plus_Jakarta_Sans({
    variable: "--font-plus-jakarta",
    subsets: ["latin"],
})

export const metadata: Metadata = {
    title: "MyRifa - Gestão de Arrecadação Digital e Campanhas",
    description: "Plataforma SaaS para criação e gerenciamento de campanhas de apoio, ações entre amigos e captação de recursos online.",
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
