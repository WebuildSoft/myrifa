"use client"

import { useState, useEffect, useCallback } from "react"
import { supabase } from "@/lib/supabase"

export type NumberStatus = "AVAILABLE" | "RESERVED" | "PAID"

export type NumberData = {
    id: string
    number: number
    status: NumberStatus
}

interface UseNumberGridProps {
    rifaId: string
    initialNumbers: NumberData[]
    maxPerBuyer?: number | null
}

export function useNumberGrid({
    rifaId,
    initialNumbers,
    maxPerBuyer,
}: UseNumberGridProps) {
    const [gridNumbers, setGridNumbers] = useState<NumberData[]>(initialNumbers)
    const [selectedNumbers, setSelectedNumbers] = useState<number[]>([])

    // Sync with initial numbers if they change from props
    useEffect(() => {
        setGridNumbers(initialNumbers)
    }, [initialNumbers])

    // Real-time subscription
    useEffect(() => {
        const channel = supabase
            .channel(`rifa-numbers-${rifaId}`)
            .on(
                'postgres_changes',
                {
                    event: 'UPDATE',
                    schema: 'public',
                    table: 'RifaNumber',
                    filter: `rifaId=eq.${rifaId}`
                },
                (payload) => {
                    const updated = payload.new as { number: number, status: NumberStatus }
                    setGridNumbers(prev => prev.map(n =>
                        n.number === updated.number ? { ...n, status: updated.status } : n
                    ))

                    // Remove from selection if it's no longer available
                    if (updated.status !== 'AVAILABLE') {
                        setSelectedNumbers(prev => prev.filter(num => num !== updated.number))
                    }
                }
            )
            .subscribe()

        return () => {
            supabase.removeChannel(channel)
        }
    }, [rifaId])

    const toggleNumber = useCallback((num: number, status: NumberStatus) => {
        if (status !== "AVAILABLE") return

        setSelectedNumbers((prev) => {
            if (prev.includes(num)) {
                return prev.filter(n => n !== num)
            }
            if (maxPerBuyer && prev.length >= maxPerBuyer) {
                // Future improvement: trigger a toast notification here
                return prev
            }
            return [...prev, num]
        })
    }, [maxPerBuyer])

    const selectRandom = useCallback((amount: number) => {
        const available = gridNumbers
            .filter(n => n.status === "AVAILABLE" && !selectedNumbers.includes(n.number))
            .map(n => n.number)

        if (available.length === 0) return

        // Modern shuffle (Fisher-Yates)
        const shuffled = [...available]
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
        }

        const remainingCapacity = maxPerBuyer ? maxPerBuyer - selectedNumbers.length : amount
        const finalAmount = Math.min(amount, remainingCapacity)

        if (finalAmount <= 0) return

        const toSelect = shuffled.slice(0, finalAmount)
        setSelectedNumbers(prev => [...prev, ...toSelect])
    }, [gridNumbers, selectedNumbers, maxPerBuyer])

    return {
        gridNumbers,
        selectedNumbers,
        toggleNumber,
        selectRandom,
        setSelectedNumbers,
    }
}
