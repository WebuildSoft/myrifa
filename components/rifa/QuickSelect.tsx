"use client"

import { Sparkles } from "lucide-react"

interface QuickSelectProps {
    onSelectRandom: (amount: number) => void
    primaryColor?: string | null
}

export function QuickSelect({
    onSelectRandom,
    primaryColor
}: QuickSelectProps) {
    const amounts = [1, 5, 10, 25, 50]

    return (
        <div className="bg-slate-50 dark:bg-slate-700/30 p-6 rounded-2xl border border-slate-100 dark:border-slate-700 space-y-4">
            <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-4 h-4 shadow-sm" style={{ color: primaryColor || undefined }} />
                <h3 className="font-black text-xs uppercase tracking-widest text-slate-500 dark:text-slate-400">
                    Seleção Rápida
                </h3>
            </div>
            <div className="flex flex-wrap gap-2">
                {amounts.map((amount) => (
                    <button
                        key={amount}
                        onClick={() => onSelectRandom(amount)}
                        className="flex-1 min-w-[60px] h-10 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-black transition-all active:scale-95 shadow-sm hover:translate-y-[-1px]"
                        style={{
                            // Using standard CSS variables or dynamic colors on hover is hard with inline styles alone without state
                            // But we can set the text color if primaryColor exists
                            color: primaryColor || undefined,
                        }}
                    >
                        +{amount}
                    </button>
                ))}
                <button
                    onClick={() => onSelectRandom(1)}
                    className="flex-[2] min-w-[120px] h-10 text-white rounded-xl text-sm font-black shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2 hover:brightness-110"
                    style={{
                        backgroundColor: primaryColor || undefined,
                        boxShadow: primaryColor ? `0 10px 15px -3px ${primaryColor}40` : undefined // 40 is approx 25% opacity in hex
                    }}
                >
                    🚀 Apoiar agora!
                </button>
            </div>
        </div>
    )
}
