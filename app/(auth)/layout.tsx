import { ReactNode } from "react"
import { Wallet } from "lucide-react"
import Link from "next/link"

export default function AuthLayout({ children }: { children: ReactNode }) {
    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-0 lg:p-8">
            <div className="flex w-full max-w-[1200px] h-full lg:h-[800px] bg-white dark:bg-slate-900 rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-500">
                {/* Left Side: Visual Content (Desktop only) */}
                <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-primary">
                    <div
                        className="absolute inset-0 bg-cover bg-center mix-blend-overlay opacity-50 transition-transform duration-[10s] hover:scale-110"
                        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1553413077-190dd305871c?q=80&w=1200&auto=format&fit=crop')" }}
                    ></div>
                    <div className="relative z-10 flex flex-col justify-end p-16 text-white h-full bg-gradient-to-t from-primary via-primary/40 to-transparent">
                        <div className="mb-8">
                            <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center mb-6">
                                <Wallet className="h-7 w-7 text-white" />
                            </div>
                            <h1 className="text-5xl font-extrabold mb-6 leading-tight tracking-tight">
                                Sua próxima grande conquista começa aqui.
                            </h1>
                            <p className="text-xl opacity-90 max-w-md font-medium leading-relaxed">
                                Junte-se a milhares de organizadores. Crie suas campanhas e explore oportunidades exclusivas.
                            </p>
                        </div>

                        <div className="mt-4 flex items-center gap-4">
                            <div className="flex -space-x-3">
                                {[1, 2, 3].map((i) => (
                                    <div key={i} className="w-10 h-10 rounded-full border-2 border-primary bg-slate-200 overflow-hidden">
                                        <img
                                            src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i + 10}`}
                                            alt="User"
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                ))}
                            </div>
                            <p className="text-sm font-bold tracking-tight">
                                +5k pessoas entraram esta semana
                            </p>
                        </div>
                    </div>
                </div>

                {/* Right Side: Form Content */}
                <div className="w-full lg:w-1/2 flex flex-col p-8 lg:p-16 overflow-y-auto bg-white dark:bg-slate-900">
                    <div className="flex justify-between items-center mb-12">
                        <Link href="/" className="flex items-center gap-2 group">
                            <div className="bg-primary p-2 rounded-xl group-hover:scale-110 transition-transform">
                                <Wallet className="h-5 w-5 text-white" />
                            </div>
                            <span className="font-bold text-2xl text-slate-900 dark:text-slate-100 tracking-tight">MyRifa</span>
                        </Link>
                    </div>

                    <div className="flex-1 flex flex-col justify-center max-w-md mx-auto w-full">
                        {children}
                    </div>
                </div>
            </div>
        </div>
    )
}
