import { ReactNode } from "react"
import { Sidebar } from "@/components/layout/sidebar"
import { Header } from "@/components/layout/header"

export default function DashboardLayout({ children }: { children: ReactNode }) {
    return (
        <div className="flex min-h-screen bg-gray-50/50 overflow-x-hidden">
            <Sidebar />
            <div className="flex-1 flex flex-col pt-16 md:pt-0 md:pl-64 min-w-0">
                <Header />
                <main className="flex-1 p-4 md:p-8 overflow-x-hidden">
                    <div className="max-w-6xl mx-auto w-full">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    )
}
