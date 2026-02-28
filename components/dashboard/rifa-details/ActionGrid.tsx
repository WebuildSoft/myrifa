import { Button } from "@/components/ui/button"
import { Share2, Users, Edit, Gift, CheckCircle2 } from "lucide-react"
import Link from "next/link"

interface ActionGridProps {
    rifaId: string
    slug: string
    status: string
}

function QuickActionButton({ icon, label, color, bg, darkBg, href, external = false }: { icon: React.ReactNode, label: string, color: string, bg: string, darkBg: string, href: string, external?: boolean }) {
    const content = (
        <>
            <div className={`size-12 ${bg} ${darkBg} rounded-2xl flex items-center justify-center ${color} mb-3 group-hover:scale-110 transition-transform`}>
                {icon}
            </div>
            <span className="font-black text-center text-[10px] uppercase tracking-wider leading-none">{label}</span>
        </>
    )

    return (
        <Button variant="outline" className="flex flex-col h-auto p-6 bg-white dark:bg-slate-900 border-primary/5 hover:border-primary/20 hover:bg-primary/[0.02] rounded-[2rem] shadow-sm transition-all group" asChild>
            {external ? <a href={href} target="_blank" rel="noopener noreferrer">{content}</a> : <Link href={href}>{content}</Link>}
        </Button>
    )
}

export function ActionGrid({ rifaId, slug, status }: ActionGridProps) {
    return (
        <section>
            <h3 className="font-sans font-black text-slate-900 dark:text-white mb-6 px-1 uppercase tracking-widest text-[10px]">Gerenciamento de Fluxo</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <QuickActionButton icon={<Share2 />} label="Divulgar" color="text-blue-500" bg="bg-blue-50" darkBg="dark:bg-blue-900/20" href={`/r/${slug}`} external />
                <QuickActionButton icon={<Users />} label="Apoiadores" color="text-amber-500" bg="bg-amber-50" darkBg="dark:bg-amber-900/20" href={`/dashboard/rifas/${rifaId}/compradores`} />
                <QuickActionButton icon={<Edit />} label="Editar Campanha" color="text-purple-500" bg="bg-purple-50" darkBg="dark:bg-purple-900/20" href={`/dashboard/rifas/${rifaId}/editar`} />

                {status === "DRAWN" ? (
                    <div className="flex flex-col items-center justify-center p-6 bg-slate-100 dark:bg-slate-900 opacity-50 rounded-[2rem] border border-transparent">
                        <CheckCircle2 className="h-8 w-8 mb-3 text-slate-400" />
                        <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 text-center">Finalizada</span>
                    </div>
                ) : (
                    <Button className="flex flex-col h-auto p-6 gap-3 bg-primary text-white rounded-[2rem] shadow-xl shadow-primary/20 group hover:scale-[1.02] transition-transform" asChild>
                        <Link href={`/sorteio/${rifaId}`}>
                            <Gift className="h-8 w-8 mb-0 group-hover:rotate-12 transition-transform" />
                            <span className="text-[10px] font-black uppercase tracking-widest text-center">Premiar</span>
                        </Link>
                    </Button>
                )}
            </div>
        </section>
    )
}
