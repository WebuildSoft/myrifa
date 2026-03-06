
import { getEvolutionStatus, getEvolutionStats, sendWhatsAppMessage } from "../lib/evolution"
import { prisma } from "../lib/prisma"

async function debug() {
    console.log("Checking Evolution API Status...")
    const status = await getEvolutionStatus()
    console.log("Status:", status)

    const stats = await getEvolutionStats()
    console.log("Stats:", stats)

    const rifas = await prisma.rifa.findMany({
        where: { notifyOrganizer: true },
        select: { id: true, title: true, organizerWhatsapp: true }
    })
    console.log("Rifas with notifications:", rifas)

    if (rifas.length > 0) {
        const testTarget = rifas[0].organizerWhatsapp
        console.log(`Sending test message to ${testTarget}...`)
        const result = await sendWhatsAppMessage(testTarget!, "Teste de Notificação MyRifa 🚀")
        console.log("Send Result:", result)
    }
}

debug().catch(console.error)
