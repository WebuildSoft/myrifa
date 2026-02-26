import * as React from "react";
import { AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Share2 } from "lucide-react";

/**
 * ShareRaffleModal
 *
 * A reusable modal component that allows the user to share a raffle link.
 * It uses the existing AlertDialog primitives for consistent styling and
 * behavior across the application.
 */
export function ShareRaffleModal({
    raffleUrl,
    raffleTitle,
}: {
    raffleUrl: string;
    raffleTitle: string;
}) {
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

    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button variant="outline" size="sm" className="flex items-center gap-2">
                    <Share2 className="h-4 w-4" />
                    Compartilhar
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent size="sm">
                <AlertDialogHeader>
                    <AlertDialogTitle>Compartilhar Rifa</AlertDialogTitle>
                    <AlertDialogDescription>
                        Compartilhe o link da sua rifa com amigos ou nas redes sociais.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <div className="mt-4 flex items-center gap-2">
                    <input
                        type="text"
                        readOnly
                        value={raffleUrl}
                        className="flex-1 rounded border p-2 text-sm focus:outline-none"
                    />
                    <Button onClick={copyToClipboard} variant="secondary">
                        {copied ? "Copiado!" : "Copiar"}
                    </Button>
                </div>
                <AlertDialogFooter className="mt-4">
                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                    <AlertDialogAction asChild>
                        <a
                            href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(
                                `Confira a rifa "${raffleTitle}"! ${raffleUrl}`
                            )}`}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <Button variant="default">Twitter</Button>
                        </a>
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
