import crypto from "crypto"

export interface DrawTicket {
    number: number
    buyerId: string
    buyer?: {
        name: string
        whatsapp?: string | null
    } | null
}

export class DrawService {
    /**
     * Cryptographically secure selection of a winning ticket.
     */
    static selectWinner(tickets: DrawTicket[]) {
        if (tickets.length === 0) {
            return { error: "Não há bilhetes elegíveis para o sorteio." }
        }

        const maxIndex = tickets.length - 1

        // Use cryptographically secure random values
        const randomBuffer = crypto.randomBytes(4)
        const randomNumber = randomBuffer.readUInt32LE(0)

        // Use modulo to pick the index
        const winningIndex = randomNumber % (maxIndex + 1)

        return {
            success: true,
            winningTicket: tickets[winningIndex]
        }
    }

    /**
     * Log draw event for audit purposes (internal placeholder)
     */
    static async logDrawAttempt(rifaId: string, prizeId: string, result: unknown) {
        console.log(`[AUDIT] Draw attempted for Rifa: ${rifaId}, Prize: ${prizeId}. Result:`, result)
        // In a real scenario, this would write to a dedicated audit_logs table
    }
}
