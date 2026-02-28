import { cn } from "@/lib/utils"

interface DashboardCardProps {
    title: string
    children: React.ReactNode
    className?: string
}

export function DashboardCard({ title, children, className }: DashboardCardProps) {
    return (
        <div className={cn("bg-white dark:bg-slate-800 p-8 rounded-[2.5rem] border border-primary/5 shadow-sm space-y-6", className)}>
            <h3 className="font-black text-slate-900 dark:text-white text-[10px] uppercase tracking-widest border-l-2 border-primary pl-3">{title}</h3>
            {children}
        </div>
    )
}
