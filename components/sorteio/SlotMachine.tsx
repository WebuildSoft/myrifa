import { Target, ShieldCheck } from "lucide-react"

interface SlotMachineProps {
    slotNumbers: string[]
    drawing: boolean
}

export function SlotMachine({ slotNumbers, drawing }: SlotMachineProps) {
    return (
        <div className="relative group mb-16">
            <div className="absolute -inset-4 bg-amber-400/20 blur-2xl rounded-[3rem] opacity-50 group-hover:opacity-100 transition-opacity"></div>
            <div className="relative flex items-center gap-2 md:gap-4 p-4 md:p-8 bg-white/5 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] shadow-2xl">
                {slotNumbers.map((num, i) => (
                    <div key={i} className="w-24 h-36 md:w-44 md:h-64 bg-slate-900 rounded-2xl overflow-hidden relative border border-white/10 shadow-inner">
                        {/* Slot Background Gradient */}
                        <div className="absolute inset-0 z-10"
                            style={{ background: 'linear-gradient(180deg, rgba(124, 59, 237, 0.2) 0%, rgba(124, 59, 237, 0) 50%, rgba(124, 59, 237, 0.2) 100%)' }}></div>

                        <div className="flex flex-col items-center justify-center h-full">
                            <span className={`text-7xl md:text-[10rem] font-black text-amber-400 leading-none ${drawing ? 'blur-[1px]' : ''}`}
                                style={{ fontFamily: 'Syne, sans-serif', textShadow: '0 0 20px rgba(251, 191, 36, 0.4)' }}>
                                {num}
                            </span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Background Decoration (Internal to component now) */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden -z-10">
                <Target className="absolute -top-20 -left-20 text-amber-400/5 size-64 -rotate-12" />
                <ShieldCheck className="absolute -bottom-20 -right-20 text-amber-400/5 size-48 rotate-12" />
            </div>
        </div>
    )
}
