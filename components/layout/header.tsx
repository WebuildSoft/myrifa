import { auth } from "@/auth"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { NotificationBell } from "./NotificationBell"

export async function Header() {
    const session = await auth()
    const user = session?.user

    return (
        <header className="h-20 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md sticky top-0 z-30 px-8 hidden md:flex items-center justify-between border-b border-primary/5">
            <div className="flex items-center bg-gray-50 dark:bg-slate-800 rounded-full px-4 py-1.5 w-96 border border-primary/5 group focus-within:border-primary/20 transition-all">
                <Search className="h-4 w-4 text-slate-400 group-focus-within:text-primary transition-colors" />
                <Input
                    className="bg-transparent border-none focus-visible:ring-0 text-sm w-full placeholder:text-slate-400 h-8"
                    placeholder="Buscar campanhas ou transações..."
                />
            </div>

            <div className="flex items-center gap-6">
                <NotificationBell />

                <div className="flex items-center gap-3 pl-6 border-l border-slate-200 dark:border-slate-700">
                    <div className="text-right">
                        <p className="text-sm font-bold text-slate-900 dark:text-slate-100 line-clamp-1">
                            {user?.name || "Usuário"}
                        </p>
                        <p className="text-[10px] text-slate-500 font-bold tracking-wide uppercase">
                            Organizador
                        </p>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center border-2 border-primary/5 text-primary font-bold shadow-sm">
                        {user?.name?.charAt(0).toUpperCase() || "U"}
                    </div>
                </div>
            </div>
        </header>
    )
}
