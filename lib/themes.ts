import type { CSSProperties } from "react"

export type RifaTheme = 'DEFAULT' | 'OCEAN' | 'SUNSET' | 'MIDNIGHT' | 'ROYAL' | 'NEON' | 'GALAXY' | 'LUXURY' | 'FLOWER'

interface ThemeConfig {
    body: string
    primary: string
    primaryHex: string
    text: string
    accent: string
    selection: string
    cssVars: React.CSSProperties
    isPremium?: boolean
}

export const THEME_CONFIGS: Record<RifaTheme, ThemeConfig> = {
    DEFAULT: {
        body: "bg-[#f5f3ff] dark:bg-[#171121]",
        primary: "text-primary",
        primaryHex: "#7c3aed", // violet-600
        text: "text-slate-900 dark:text-slate-100",
        accent: "bg-primary/10",
        selection: "selection:bg-primary/20",
        cssVars: {
            '--primary': '#7c3bed',
            '--color-primary': '#7c3bed',
            '--ring': '#7c3bed'
        } as React.CSSProperties
    },
    OCEAN: {
        body: "bg-blue-50 dark:bg-[#0a192f]",
        primary: "text-blue-600",
        primaryHex: "#2563eb", // blue-600
        text: "text-slate-900 dark:text-blue-50",
        accent: "bg-blue-600/10",
        selection: "selection:bg-blue-600/20",
        cssVars: {
            '--primary': '#2563eb',
            '--color-primary': '#2563eb',
            '--ring': '#2563eb'
        } as React.CSSProperties
    },
    SUNSET: {
        body: "bg-rose-50 dark:bg-[#1a0f0f]",
        primary: "text-rose-500",
        primaryHex: "#f43f5e", // rose-500
        text: "text-slate-900 dark:text-rose-50",
        accent: "bg-rose-500/10",
        selection: "selection:bg-rose-500/20",
        cssVars: {
            '--primary': '#f43f5e',
            '--color-primary': '#f43f5e',
            '--ring': '#f43f5e'
        } as React.CSSProperties
    },
    MIDNIGHT: {
        body: "bg-slate-950 dark:bg-black",
        primary: "text-emerald-500",
        primaryHex: "#10b981", // emerald-500
        text: "text-slate-200 dark:text-emerald-50",
        accent: "bg-emerald-500/10",
        selection: "selection:bg-emerald-500/20",
        cssVars: {
            '--primary': '#10b981',
            '--color-primary': '#10b981',
            '--ring': '#10b981'
        } as React.CSSProperties
    },
    ROYAL: {
        body: "bg-[#fffdf5] dark:bg-[#1a160d]",
        primary: "text-amber-600",
        primaryHex: "#d97706",
        text: "text-slate-900 dark:text-amber-50",
        accent: "bg-amber-600/10",
        selection: "selection:bg-amber-600/20",
        cssVars: {
            '--primary': '#d97706',
            '--color-primary': '#d97706',
            '--ring': '#d97706'
        } as CSSProperties,
        isPremium: true
    },
    NEON: {
        body: "bg-[#0c0c0c] dark:bg-black",
        primary: "text-[#00ff9f]",
        primaryHex: "#00ff9f",
        text: "text-white",
        accent: "bg-[#00ff9f]/10",
        selection: "selection:bg-[#00ff9f]/20",
        cssVars: {
            '--primary': '#00ff9f',
            '--color-primary': '#00ff9f',
            '--ring': '#00ff9f'
        } as CSSProperties,
        isPremium: true
    },
    GALAXY: {
        body: "bg-[#050b18] dark:bg-black",
        primary: "text-[#8b5cf6]",
        primaryHex: "#8b5cf6",
        text: "text-white",
        accent: "bg-[#8b5cf6]/10",
        selection: "selection:bg-[#8b5cf6]/20",
        cssVars: {
            '--primary': '#8b5cf6',
            '--color-primary': '#8b5cf6',
            '--ring': '#8b5cf6'
        } as CSSProperties,
        isPremium: true
    },
    LUXURY: {
        body: "bg-[#ffffff] dark:bg-[#0a0a0a]",
        primary: "text-[#af9164]",
        primaryHex: "#af9164",
        text: "text-slate-900 dark:text-slate-100",
        accent: "bg-[#af9164]/10",
        selection: "selection:bg-[#af9164]/20",
        cssVars: {
            '--primary': '#af9164',
            '--color-primary': '#af9164',
            '--ring': '#af9164'
        } as CSSProperties,
        isPremium: true
    },
    FLOWER: {
        body: "bg-[#fffafa] dark:bg-[#1a0f0f]",
        primary: "text-rose-400",
        primaryHex: "#fb7185",
        text: "text-slate-900 dark:text-rose-50",
        accent: "bg-rose-400/10",
        selection: "selection:bg-rose-400/20",
        cssVars: {
            '--primary': '#fb7185',
            '--color-primary': '#fb7185',
            '--ring': '#fb7185'
        } as CSSProperties,
        isPremium: true
    }
}

export function getThemeConfig(theme: string | null | undefined): ThemeConfig {
    const t = (theme as RifaTheme) || 'DEFAULT'
    return THEME_CONFIGS[t] || THEME_CONFIGS.DEFAULT
}
