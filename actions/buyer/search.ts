"use server"

import { prisma } from "@/lib/prisma"

export async function searchBuyerOrders(query: string) {
    if (!query) {
        return { error: "Por favor, informe seu e-mail ou WhatsApp." }
    }

    try {
        const isEmail = query.includes('@')
        let cleanQuery = query

        if (!isEmail) {
            cleanQuery = query.replace(/\D/g, '') // Keep only numbers
        }

        if (cleanQuery.length < 5) {
            return { error: "Digite um número de telefone ou e-mail válido." }
        }

        // Search for all transactions belonging to a buyer with this contact info
        const transactions = await prisma.transaction.findMany({
            where: {
                buyer: {
                    OR: [
                        { email: cleanQuery },
                        { whatsapp: cleanQuery },
                        { whatsapp: { endsWith: cleanQuery } }
                    ]
                }
            },
            orderBy: {
                createdAt: 'desc'
            },
            include: {
                rifa: {
                    select: {
                        slug: true,
                        title: true,
                        coverImage: true,
                        status: true,
                        drawDate: true,
                    }
                },
                // Fetch the numbers tied to this buyer and this specific rifa
                buyer: {
                    select: {
                        id: true,
                        numbers: {
                            select: {
                                number: true,
                                status: true
                            }
                        }
                    }
                }
            }
        })

        if (!transactions || transactions.length === 0) {
            return { error: "Nenhuma compra foi encontrada com este contato." }
        }

        // Clean up the response to map numbers correctly to the transaction
        const formattedTransactions = transactions.map(tx => ({
            id: tx.id,
            amount: Number(tx.amount),
            status: tx.status,
            createdAt: tx.createdAt,
            rifa: tx.rifa,
            // Only include numbers from the specific buyer registry related to this transaction
            numbers: tx.buyer.numbers
        }))

        return { success: true, transactions: formattedTransactions }

    } catch (error) {
        console.error("Error searching buyer orders:", error)
        return { error: "Ocorreu um erro ao buscar suas cotas. Tente novamente mais tarde." }
    }
}
