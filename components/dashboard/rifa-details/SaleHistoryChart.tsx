import { Badge } from "@/components/ui/badge"

export function SaleHistoryChart() {
    // Note: In a real app, these values would be passed as props 
    // based on actual transaction statistics. 
    // Keeping the current UI logic for consistency.
    const weeklyData = [42, 68, 35, 85, 52, 98, 90]
    const days = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom']

    return (
        <div className="bg-white dark:bg-slate-800 p-10 rounded-[2.5rem] border border-primary/5 shadow-sm space-y-8">
            <div className="flex justify-between items-start">
                <div className="space-y-1">
                    <h3 className="font-black text-slate-900 dark:text-white text-lg">Histórico Semanal</h3>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em]">Desempenho de Vendas</p>
                </div>
                <Badge className="bg-emerald-100 text-emerald-600 border-none font-black text-[10px] uppercase tracking-widest">+12.4%</Badge>
            </div>

            <div className="flex items-end justify-between h-48 gap-4 px-2">
                {weeklyData.map((val, i) => (
                    <div key={i} className="flex-1 space-y-3 group cursor-pointer">
                        <div
                            className={`w-full rounded-t-2xl transition-all duration-700 group-hover:scale-x-105 active:scale-y-95 ${i === 6 ? 'bg-primary shadow-[0_0_20px_rgba(236,91,19,0.3)]' : 'bg-primary/10 dark:bg-primary/20'}`}
                            style={{ height: `${val}%` }}
                        ></div>
                        <div className="text-[9px] text-slate-400 font-black text-center uppercase tracking-widest">
                            {days[i]}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
