import { Share2, QrCode } from "lucide-react"
import { Button } from "@/components/ui/button"
import CopyLinkButton from "@/app/(dashboard)/dashboard/rifas/[id]/CopyLinkButton"
import { DashboardCard } from "../DashboardCard"

interface SharingCardProps {
    slug: string
}

export function SharingCard({ slug }: SharingCardProps) {
    const fullUrl = `https://rifa.com.br/r/${slug}`

    return (
        <DashboardCard title="Compartilhamento">
            <div className="space-y-6">
                <div className="space-y-3">
                    <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Link da sua Campanha</p>
                    <div className="flex items-center gap-3 p-4 bg-slate-50 dark:bg-slate-900 rounded-3xl border border-primary/10 group overflow-hidden">
                        <span className="text-xs text-slate-500 flex-1 truncate font-mono">rifa.com.br/r/{slug}</span>
                        <CopyLinkButton url={fullUrl} />
                    </div>
                </div>

                <div className="flex gap-4">
                    <Button className="flex-1 bg-[#25D366] hover:bg-[#20bd5a] text-white h-14 rounded-2xl font-black text-sm flex items-center gap-3 shadow-xl shadow-emerald-500/10 active:scale-95 transition-all">
                        <Share2 className="h-4 w-4" />
                        WhatsApp
                    </Button>
                    <Button variant="outline" className="w-16 h-14 bg-white dark:bg-slate-900 border-primary/20 rounded-2xl flex items-center justify-center text-primary group active:scale-95 transition-all">
                        <QrCode className="h-5 w-5 group-hover:scale-110 transition-transform" />
                    </Button>
                </div>
            </div>
        </DashboardCard>
    )
}
