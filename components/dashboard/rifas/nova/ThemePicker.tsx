import { cn } from "@/lib/utils"
import { Check, Palette, Waves, Sunrise, Moon, Crown, Zap, Stars, Diamond, Lock } from "lucide-react"
import { Label } from "@/components/ui/label"
import { RifaTheme, THEME_CONFIGS } from "@/lib/themes"

interface ThemePickerProps {
    value: RifaTheme
    onChange: (val: RifaTheme) => void
    userPlan?: string
}

const themes = [
    {
        id: 'DEFAULT',
        label: 'Modern Violet',
        description: 'Padrão elegante (Violeta & Ardósia)',
        icon: Palette,
        colors: ['bg-primary', 'bg-slate-900']
    },
    {
        id: 'OCEAN',
        label: 'Ocean Breeze',
        description: 'Refrescante (Azul & Ciano)',
        icon: Waves,
        colors: ['bg-blue-600', 'bg-cyan-400']
    },
    {
        id: 'SUNSET',
        label: 'Sunset Gold',
        description: 'Cálido (Rosa & Laranja)',
        icon: Sunrise,
        colors: ['bg-rose-500', 'bg-amber-500']
    },
    {
        id: 'MIDNIGHT',
        label: 'Midnight Emerald',
        description: 'Dark Elegance (Esmeralda & Noite)',
        icon: Moon,
        colors: ['bg-emerald-500', 'bg-black']
    },
    {
        id: 'ROYAL',
        label: 'Royal Amber',
        description: 'Premium (Âmbar & Dourado)',
        icon: Crown,
        colors: ['bg-amber-600', 'bg-[#fffdf5]'],
        isPremium: true
    },
    {
        id: 'NEON',
        label: 'Cyber Neon',
        description: 'Vibrante (Verde Neon & Black)',
        icon: Zap,
        colors: ['bg-[#00ff9f]', 'bg-[#0c0c0c]'],
        isPremium: true
    },
    {
        id: 'GALAXY',
        label: 'Deep Galaxy',
        description: 'Espacial (Roxo Profundo & Estrelas)',
        icon: Stars,
        colors: ['bg-[#8b5cf6]', 'bg-[#050b18]'],
        isPremium: true
    },
    {
        id: 'LUXURY',
        label: 'Luxury White',
        description: 'Sofisticado (Dourado Champagne & White)',
        icon: Diamond,
        colors: ['bg-[#af9164]', 'bg-white'],
        isPremium: true
    }
]

export function ThemePicker({ value, onChange, userPlan = "FREE" }: ThemePickerProps) {
    const isPro = userPlan === "PRO" || userPlan === "INSTITUTIONAL"

    return (
        <div className="space-y-4">
            <Label className="text-sm font-bold text-slate-700 dark:text-slate-300 ml-1 flex items-center justify-between">
                <span>Tema da Página Pública</span>
                <div className="flex gap-2">
                    <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-500 text-[10px] font-black uppercase tracking-widest">Grátis: 4</span>
                    <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-600 text-[10px] font-black uppercase tracking-widest">PRO: +4</span>
                </div>
            </Label>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {themes.map((theme) => {
                    const Icon = theme.icon
                    const isSelected = value === theme.id
                    const isDisabled = theme.isPremium && !isPro

                    return (
                        <button
                            key={theme.id}
                            type="button"
                            disabled={isDisabled}
                            onClick={() => onChange(theme.id as RifaTheme)}
                            className={cn(
                                "flex items-center gap-4 p-4 rounded-2xl border-2 text-left transition-all relative group",
                                isSelected
                                    ? "border-primary bg-primary/5 ring-4 ring-primary/5"
                                    : "border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-200",
                                isDisabled && "opacity-60 grayscale-[0.5] cursor-not-allowed border-dashed"
                            )}
                        >
                            <div className={cn(
                                "size-12 rounded-xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-110",
                                isSelected ? "bg-primary text-white" : "bg-slate-100 dark:bg-slate-800 text-slate-500"
                            )}>
                                <Icon className="h-6 w-6" />
                            </div>

                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2">
                                    <h4 className="font-bold text-sm text-slate-900 dark:text-white truncate">{theme.label}</h4>
                                    {theme.isPremium && (
                                        <span className="shrink-0 p-0.5 rounded-md bg-amber-100 text-amber-600">
                                            <Crown className="size-3" />
                                        </span>
                                    )}
                                </div>
                                <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-tight line-clamp-1">{theme.description}</p>
                            </div>

                            <div className="flex gap-1 absolute top-4 right-4">
                                {theme.colors.map((color, i) => (
                                    <div key={i} className={cn("size-2 rounded-full", color)} />
                                ))}
                            </div>

                            {isDisabled && (
                                <div className="absolute inset-0 bg-slate-50/10 dark:bg-slate-900/10 backdrop-blur-[1px] rounded-2xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                    <div className="bg-white dark:bg-slate-800 p-2 rounded-full shadow-lg">
                                        <Lock className="size-4 text-amber-500" />
                                    </div>
                                </div>
                            )}

                            {isSelected && (
                                <div className="absolute -top-2 -right-2 size-6 bg-primary rounded-full flex items-center justify-center text-white shadow-lg border-2 border-white dark:border-slate-900 animate-in zoom-in duration-300">
                                    <Check className="h-3 w-3" />
                                </div>
                            )}
                        </button>
                    )
                })}
            </div>
        </div>
    )
}
