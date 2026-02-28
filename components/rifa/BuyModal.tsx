"use client"

import { Dialog, DialogContent } from "@/components/ui/dialog"
import { useBuyModal } from "./hooks/useBuyModal"
import { StepIndicator } from "./StepIndicator"
import { SummaryPanel } from "./SummaryPanel"
import { StepUserData } from "./steps/StepUserData"
import { StepPaymentMethod } from "./steps/StepPaymentMethod"
import { StepPaymentDetails } from "./steps/StepPaymentDetails"
import { StepSuccess } from "./steps/StepSuccess"

interface BuyModalProps {
    rifaId: string
    selectedNumbers: number[]
    totalPrice: number
    isOpen: boolean
    onClose: () => void
    rifaTitle?: string
    rifaCover?: string | null
}

const STEP_LABELS = ["Seus dados", "Forma de pagamento", "Pagamento"]
const PAYMENT_EXPIRY_SECONDS = 30 * 60 // 30 minutes

export function BuyModal({
    rifaId,
    selectedNumbers,
    totalPrice,
    isOpen,
    onClose,
    rifaTitle = "Sorteio",
    rifaCover,
}: BuyModalProps) {
    const {
        step,
        setStep,
        buyerInfo,
        setBuyerInfo,
        paymentMethod,
        setPaymentMethod,
        loading,
        error,
        pixData,
        copied,
        secondsLeft,
        handleUserDataSubmit,
        handleProcessPayment,
        copyToClipboard,
    } = useBuyModal({
        rifaId,
        selectedNumbers,
        expirySeconds: PAYMENT_EXPIRY_SECONDS,
    })

    const formattedTotal = new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL"
    }).format(totalPrice)

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="max-w-[880px] p-0 overflow-hidden rounded-3xl gap-0">
                <div className="flex flex-col lg:flex-row min-h-[520px]">

                    {/* ── LEFT PANEL ────────────────────────────────────────── */}
                    <div className="flex-1 p-6 md:p-8 flex flex-col">

                        {/* Step Indicator */}
                        {step < 4 && (
                            <StepIndicator
                                currentStep={step}
                                labels={STEP_LABELS}
                            />
                        )}

                        {/* Step 1: Buyer Data */}
                        {step === 1 && (
                            <StepUserData
                                buyerInfo={buyerInfo}
                                onChange={setBuyerInfo}
                                onSubmit={handleUserDataSubmit}
                                selectedNumbersCount={selectedNumbers.length}
                                error={error}
                            />
                        )}

                        {/* Step 2: Payment Method */}
                        {step === 2 && (
                            <StepPaymentMethod
                                paymentMethod={paymentMethod}
                                onSelect={setPaymentMethod}
                                onBack={() => setStep(1)}
                                onProceed={handleProcessPayment}
                                formattedTotal={formattedTotal}
                                loading={loading}
                                error={error}
                            />
                        )}

                        {/* Step 3: Payment Details (PIX) */}
                        {step === 3 && (
                            <StepPaymentDetails
                                pixData={pixData}
                                secondsLeft={secondsLeft}
                                onCopy={copyToClipboard}
                                copied={copied}
                                onSimulateSuccess={() => setStep(4)}
                            />
                        )}

                        {/* Step 4: Success */}
                        {step === 4 && (
                            <StepSuccess
                                selectedNumbers={selectedNumbers}
                                onClose={onClose}
                            />
                        )}
                    </div>

                    {/* ── RIGHT PANEL: Order Summary ─────────────────────── */}
                    {step < 4 && (
                        <SummaryPanel
                            rifaTitle={rifaTitle}
                            rifaCover={rifaCover}
                            selectedNumbers={selectedNumbers}
                            totalPrice={totalPrice}
                        />
                    )}
                </div>
            </DialogContent>
        </Dialog>
    )
}
