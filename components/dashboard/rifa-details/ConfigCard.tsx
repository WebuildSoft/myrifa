import { Layers, Gift, Calendar, UserCircle, Smartphone } from "lucide-react"
import { DashboardCard } from "../DashboardCard"

interface ConfigCardProps {
    category: string
    drawMethod: string
    drawDate: Date | null
    maxPerBuyer: number | null
    isPrivate: boolean
}

function ConfigItem({ icon, label, value }: { icon: React.ReactNode, label: string, value: string }) {
    return (
        <div className="flex items-center justify-between group">
            <div className="flex items-center gap-3">
                <div className="p-2 bg-slate-50 dark:bg-slate-900 rounded-xl text-slate-400 group-hover:text-primary transition-colors">
                    {icon}
                </div>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">{label}</span>
            </div>
            <span className="text-xs font-black text-slate-900 dark:text-white">{value}</span>
        </div>
    )
}

export function ConfigCard({ category, drawMethod, drawDate, maxPerBuyer, isPrivate }: ConfigCardProps) {
    return (
        <DashboardCard title="Configurações">
            <div className="space-y-5">
                <ConfigItem icon={<Layers className="h-4 w-4" />} label="Categoria" value={category} />
                <ConfigItem icon={<Gift className="h-4 w-4" />} label="Método" value={drawMethod} />
                <ConfigItem
                    icon={<Calendar className="h-4 w-4" />}
                    label="Premiação"
                    value={drawDate ? new Date(drawDate).toLocaleDateString("pt-BR") : "Não definido"}
                />
                <ConfigItem
                    icon={<UserCircle className="h-4 w-4" />}
                    label="Limite/User"
                    value={maxPerBuyer ? `${maxPerBuyer} cotas` : "Ilimitado"}
                />
                <ConfigItem
                    icon={<Smartphone className="h-4 w-4" />}
                    label="Visibilidade"
                    value={isPrivate ? "Privada" : "Pública"}
                />
            </div>
        </DashboardCard>
    )
}
