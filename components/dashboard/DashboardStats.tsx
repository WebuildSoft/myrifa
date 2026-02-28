import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { DollarSign, Ticket, ShoppingCart, TrendingUp } from "lucide-react"

interface DashboardStatsProps {
    totalRaised: number
    activeRifasCount: number
    ticketsSold: number
}

export function DashboardStats({ totalRaised, activeRifasCount, ticketsSold }: DashboardStatsProps) {
    const formattedRaised = new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL"
    }).format(totalRaised)

    const stats = [
        {
            label: "Total Arrecadado",
            value: formattedRaised,
            icon: DollarSign,
            trend: "+12%",
            trendColor: "bg-green-50 text-green-600",
            iconBg: "bg-green-100 dark:bg-green-500/10 text-green-600"
        },
        {
            label: "Campanhas Ativas",
            value: activeRifasCount.toString(),
            icon: Ticket,
            trend: "+2%",
            trendColor: "bg-blue-50 text-blue-600",
            iconBg: "bg-blue-100 dark:bg-blue-500/10 text-blue-600"
        },
        {
            label: "Números Vendidos",
            value: ticketsSold.toString(),
            icon: ShoppingCart,
            trend: "+5%",
            trendColor: "bg-purple-50 text-purple-600",
            iconBg: "bg-purple-100 dark:bg-purple-500/10 text-purple-600"
        },
        {
            label: "Conversão",
            value: "14.5%",
            icon: TrendingUp,
            trend: "-1%",
            trendColor: "bg-red-50 text-red-600",
            iconBg: "bg-orange-100 dark:bg-orange-500/10 text-orange-600"
        }
    ]

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 font-sans">
            {stats.map((stat, i) => (
                <Card key={i} className="bg-white dark:bg-slate-900 border-primary/5 shadow-sm rounded-2xl overflow-hidden group hover:shadow-md transition-all">
                    <CardContent className="p-6">
                        <div className="flex justify-between items-start mb-4">
                            <div className={`p-2.5 rounded-xl ${stat.iconBg}`}>
                                <stat.icon className="h-5 w-5" />
                            </div>
                            <Badge className={`${stat.trendColor} border-none font-bold text-[10px] hover:opacity-80`}>
                                {stat.trend}
                            </Badge>
                        </div>
                        <p className="text-slate-500 text-sm font-semibold tracking-tight uppercase">{stat.label}</p>
                        <h3 className="text-2xl font-bold mt-1 tracking-tight text-foreground">{stat.value}</h3>
                    </CardContent>
                </Card>
            ))}
        </div>
    )
}
