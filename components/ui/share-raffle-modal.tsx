import * as React from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Share2, Copy, Check, MessageCircle, Instagram, ExternalLink, Lightbulb } from "lucide-react";

/**
 * ShareRaffleModal
 *
 * A premium modal component for sharing a raffle.
 */
export function ShareRaffleModal({
    raffleUrl,
    raffleTitle,
}: {
    raffleUrl: string;
    raffleTitle: string;
}) {
    const [open, setOpen] = React.useState(false);
    const [copied, setCopied] = React.useState(false);

    const copyToClipboard = async () => {
        try {
            await navigator.clipboard.writeText(raffleUrl);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (error) {
            console.error("Failed to copy raffle link", error);
        }
    };

    const shareWhatsApp = () => {
        const text = encodeURIComponent(`Confira minha campanha "${raffleTitle}"! Participe aqui: ${raffleUrl}`);
        window.open(`https://wa.me/?text=${text}`, '_blank');
    };

    return (
        <>
            <Button
                type="button"
                onClick={() => setOpen(true)}
                variant="secondary"
                size="lg"
                className="flex-1 h-14 rounded-2xl font-bold uppercase text-xs tracking-widest gap-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all border-none"
            >
                <Share2 className="h-4 w-4 text-primary" />
                Compartilhar
            </Button>

            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="sm:max-w-md rounded-[2.5rem] p-0 overflow-hidden border-none shadow-2xl">
                    <div className="bg-primary p-8 text-white relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-8 opacity-10">
                            <Share2 className="h-20 w-20" />
                        </div>
                        <div className="relative z-10 space-y-1">
                            <p className="text-primary-foreground/70 text-[10px] font-black uppercase tracking-widest">Sucesso!</p>
                            <DialogTitle className="text-2xl font-black">Divulgue sua Campanha</DialogTitle>
                        </div>
                    </div>

                    <div className="p-8 space-y-6 bg-white dark:bg-slate-950">
                        <div className="space-y-4">
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Link da Campanha</p>
                            <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
                                <input
                                    type="text"
                                    readOnly
                                    value={raffleUrl}
                                    className="flex-1 bg-transparent px-3 text-sm font-medium focus:outline-none text-slate-600 dark:text-slate-400"
                                />
                                <Button
                                    onClick={copyToClipboard}
                                    size="sm"
                                    className={`rounded-xl px-4 font-bold transition-all ${copied ? 'bg-green-500 hover:bg-green-600' : 'bg-primary'}`}
                                >
                                    {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4 mr-2" />}
                                    {copied ? "Copiado" : "Copiar Link"}
                                </Button>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <Button
                                onClick={shareWhatsApp}
                                variant="outline"
                                className="h-14 rounded-2xl border-slate-100 dark:border-slate-800 hover:bg-green-50 dark:hover:bg-green-900/10 hover:text-green-600 hover:border-green-200 transition-all gap-3 font-bold group"
                            >
                                <div className="w-8 h-8 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-600 group-hover:scale-110 transition-transform">
                                    <MessageCircle className="h-5 w-5 fill-current" />
                                </div>
                                WhatsApp
                            </Button>

                            <Button
                                variant="outline"
                                className="h-14 rounded-2xl border-slate-100 dark:border-slate-800 hover:bg-pink-50 dark:hover:bg-pink-900/10 hover:text-pink-600 hover:border-pink-200 transition-all gap-3 font-bold group"
                                onClick={() => window.open(`https://instagram.com`, '_blank')}
                            >
                                <div className="w-8 h-8 rounded-lg bg-pink-100 dark:bg-pink-900/30 flex items-center justify-center text-pink-600 group-hover:scale-110 transition-transform">
                                    <Instagram className="h-5 w-5" />
                                </div>
                                Instagram
                            </Button>
                        </div>

                        <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-900/20 flex gap-3 text-amber-700 dark:text-amber-400">
                            <Lightbulb className="h-5 w-5 shrink-0" />
                            <p className="text-xs font-medium leading-relaxed italic">
                                <strong>Dica do Especialista:</strong> Compartilhar nos Stories do Instagram com o sticker de link aumenta as vendas em até 60%!
                            </p>
                        </div>

                        <div className="pt-2 flex justify-center">
                            <Button variant="ghost" onClick={() => setOpen(false)} className="text-xs font-bold uppercase tracking-widest text-slate-400 hover:text-slate-900 transition-colors">
                                Fechar agora
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
}
