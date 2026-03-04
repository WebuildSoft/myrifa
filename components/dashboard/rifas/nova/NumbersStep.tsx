"use client"

import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Calendar, Bolt } from "lucide-react"

interface NumbersStepProps {
    totalNumbers: number
    setTotalNumbers: (val: number) => void
    numberPrice: number
    setNumberPrice: (val: number) => void
    drawDate: string
    setDrawDate: (val: string) => void
    notifyOrganizer: boolean
    setNotifyOrganizer: (val: boolean) => void
    organizerWhatsapp: string
    setOrganizerWhatsapp: (val: string) => void
    loading: boolean
    onBack: () => void
}

export function NumbersStep({
    totalNumbers, setTotalNumbers,
    numberPrice, setNumberPrice,
    drawDate, setDrawDate,
    notifyOrganizer, setNotifyOrganizer,
    organizerWhatsapp, setOrganizerWhatsapp,
    loading,
    onBack
}: NumbersStepProps) {
    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <section className="space-y-4">
                <Label className="text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">Quantidade de Cotas</Label>
                <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
                    {[10, 50, 100, 250, 500, 1000].map((num) => (
                        <button
                            key={num}
                            type="button"
                            onClick={() => setTotalNumbers(num)}
                            className={`h-14 rounded-2xl border-2 font-bold transition-all ${totalNumbers === num
                                ? "border-primary bg-primary/5 text-primary"
                                : "border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:border-primary/30"
                                }`}
                        >
                            {num}
                        </button>
                    ))}
                </div>
                <div className="relative group">
                    <Label htmlFor="totalNumbers" className="text-xs text-slate-500 mb-2 block">Ou digite uma quantidade personalizada:</Label>
                    <Input
                        id="totalNumbers"
                        name="totalNumbers"
                        type="number"
                        required
                        min={10}
                        max={10000}
                        placeholder="Ex: 1500"
                        className="h-14 rounded-2xl border-slate-200 dark:border-slate-800"
                        value={totalNumbers || ""}
                        onChange={(e) => setTotalNumbers(Number(e.target.value))}
                    />
                </div>
            </section>

            <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <Label htmlFor="numberPrice" className="text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">Valor por Cota</Label>
                    <div className="relative group">
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-slate-400 group-focus-within:text-primary transition-colors">R$</div>
                        <Input
                            id="numberPrice"
                            name="numberPrice"
                            type="number"
                            step="0.01"
                            required
                            min={1}
                            className="h-14 pl-12 rounded-2xl border-slate-200 dark:border-slate-800"
                            value={numberPrice || ""}
                            onChange={(e) => setNumberPrice(Number(e.target.value))}
                        />
                    </div>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="drawDate" className="text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">Data Prevista da Premiação</Label>
                    <div className="relative group">
                        <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-primary transition-colors" />
                        <Input
                            id="drawDate"
                            name="drawDate"
                            type="date"
                            className="h-14 pl-12 rounded-2xl border-slate-200 dark:border-slate-800"
                            value={drawDate}
                            onChange={(e) => setDrawDate(e.target.value)}
                        />
                    </div>
                </div>
            </section>

            <section className="space-y-6">
                <div className="p-6 rounded-3xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800">
                    <div className="flex items-center justify-between transition-all duration-300">
                        <div className="flex items-center gap-4">
                            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-colors ${notifyOrganizer ? 'bg-green-100 text-green-600' : 'bg-slate-200 text-slate-400'}`}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-message-circle"><path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" /><path d="M8 12h.01" /><path d="M12 12h.01" /><path d="M16 12h.01" /></svg>
                            </div>
                            <div>
                                <p className="font-bold text-slate-900 dark:text-white">Alertas para o Organizador</p>
                                <p className="text-xs text-slate-500">Receba avisos no WhatsApp a cada reserva ou pagamento.</p>
                            </div>
                        </div>
                        <div className="relative inline-flex items-center cursor-pointer" onClick={() => setNotifyOrganizer(!notifyOrganizer)}>
                            <div className={`w-11 h-6 rounded-full transition-colors ${notifyOrganizer ? 'bg-primary' : 'bg-slate-200 dark:bg-slate-700'}`}>
                                <div className={`absolute top-[2px] left-[2px] bg-white rounded-full h-5 w-5 transition-transform ${notifyOrganizer ? 'translate-x-5' : 'translate-x-0'}`}></div>
                            </div>
                        </div>
                    </div>

                    {notifyOrganizer && (
                        <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-700 animate-in fade-in slide-in-from-top-2 duration-300">
                            <Label htmlFor="organizerWhatsapp" className="text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">WhatsApp para Alertas</Label>
                            <div className="relative group mt-2">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors font-bold">+55</span>
                                <Input
                                    id="organizerWhatsapp"
                                    placeholder="(00) 00000-0000"
                                    className="h-14 pl-14 rounded-2xl border-slate-200 dark:border-slate-800"
                                    value={organizerWhatsapp}
                                    onChange={(e) => setOrganizerWhatsapp(e.target.value)}
                                />
                            </div>
                        </div>
                    )}
                </div>

                <div className="p-6 rounded-3xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                                <Bolt className="h-6 w-6" />
                            </div>
                            <div>
                                <p className="font-bold text-slate-900 dark:text-white">Premiação Automática</p>
                                <p className="text-xs text-slate-500">O sistema libera o resultado assim que a meta for atingida.</p>
                            </div>
                        </div>
                        <div className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" name="autoDraw" className="sr-only peer" defaultChecked />
                            <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                        </div>
                    </div>
                </div>
            </section>

            <div className="flex items-center justify-between pt-6 border-t border-slate-100 dark:border-slate-800">
                <Button type="button" variant="ghost" size="lg" className="h-14 px-8 rounded-2xl font-bold" onClick={onBack}>
                    Voltar
                </Button>
                <Button type="submit" size="lg" className="h-14 px-10 rounded-2xl font-bold shadow-lg shadow-primary/20" disabled={loading}>
                    {loading ? "Salvando..." : "Salvar e Revisar"}
                </Button>
            </div>
        </div>
    )
}
