import { Zap, Globe2, PieChart } from "lucide-react"

export function HomeFeatures() {
    return (
        <section className="py-24 px-6 bg-white dark:bg-[#0f0a19]">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-16 space-y-4">
                    <h2 className="text-3xl md:text-5xl font-black tracking-tight dark:text-white">Gerenciamento inteligente de fundos.</h2>
                    <p className="text-slate-500 dark:text-slate-400 font-medium max-w-xl mx-auto">Oferecemos a infraestrutura necessária para que igrejas, ONGs e projetos sociais foquem no que importa.</p>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    <FeatureCard
                        icon={<Zap />}
                        title="Baixa Automática"
                        description="Integração via PIX para reconhecimento instantâneo de contribuições e liberação de cotas de apoio."
                        color="text-amber-500"
                        bg="bg-amber-500/10"
                    />
                    <FeatureCard
                        icon={<Globe2 />}
                        title="Campanhas Globais"
                        description="Alcance apoiadores em qualquer lugar através de links otimizados para redes sociais."
                        color="text-primary"
                        bg="bg-primary/10"
                    />
                    <FeatureCard
                        icon={<PieChart />}
                        title="Dashboard de Gestão"
                        description="Controle total sobre o progresso da arrecadação, dados de apoiadores e métricas de conversão."
                        color="text-emerald-500"
                        bg="bg-emerald-500/10"
                    />
                </div>
            </div>
        </section>
    )
}

function FeatureCard({ icon, title, description, color, bg }: { icon: React.ReactNode, title: string, description: string, color: string, bg: string }) {
    return (
        <div className="group p-10 bg-[#fcfcfd] dark:bg-slate-800/50 rounded-[2.5rem] border border-primary/5 hover:border-primary/20 hover:shadow-2xl hover:shadow-primary/5 transition-all">
            <div className={`size-16 ${bg} ${color} rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 group-hover:rotate-3 transition-transform`}>
                {icon}
            </div>
            <h3 className="text-xl font-black mb-4 dark:text-white">{title}</h3>
            <p className="text-slate-500 dark:text-slate-400 text-sm font-medium leading-relaxed">{description}</p>
        </div>
    )
}
