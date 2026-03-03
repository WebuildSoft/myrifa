import type { Metadata } from "next"
import { Plus_Jakarta_Sans } from "next/font/google"
import "./globals.css"
import { Toaster } from "sonner"

const plusJakartaSans = Plus_Jakarta_Sans({
    variable: "--font-plus-jakarta",
    subsets: ["latin"],
})

import { Providers } from "@/components/Providers"
import { VisitorTracker } from "@/components/VisitorTracker"
import { ClientErrorReporter } from "@/components/ClientErrorReporter"

export const metadata: Metadata = {
    metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
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
                <Providers>
                    <VisitorTracker />
                    <ClientErrorReporter />
                    {children}
                    <Toaster position="top-right" richColors />
                </Providers>
            </body>
        </html>
    )
}
