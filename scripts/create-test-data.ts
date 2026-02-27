import { PrismaClient } from "@prisma/client"
import bcrypt from "bcrypt"

const prisma = new PrismaClient()

async function main() {
    const email = "teste@myrifa.com"
    const password = "teste123"
    const hashedPassword = await bcrypt.hash(password, 10)

    console.log("🚀 Iniciando criação de dados de teste...")

    // 1. Criar ou Atualizar Usuário
    const user = await prisma.user.upsert({
        where: { email },
        update: { password: hashedPassword },
        create: {
            email,
            password: hashedPassword,
            name: "Usuário de Teste MyRifa",
            plan: "PRO"
        }
    })

    console.log(`✅ Usuário criado: ${user.email}`)

    // 2. Criar Campanha de Teste
    const slug = "campanha-teste-premiacao"
    const totalNumbers = 100

    const rifa = await prisma.rifa.upsert({
        where: { slug },
        update: { status: "ACTIVE", totalNumbers },
        create: {
            slug,
            title: "Campanha de Teste - Rebranding",
            description: "Esta é uma campanha criada automaticamente para testar as novas funcionalidades de premiação e o novo branding SaaS.",
            rules: "1. Campanha exclusiva para testes.\n2. Premiação baseada em cotas pagas.\n3. Resultado oficial imediato.",
            totalNumbers,
            numberPrice: 1.00,
            minPercentToRaffle: 0, // Permite sortear com qualquer quantidade
            status: "ACTIVE",
            userId: user.id,
            category: "ARRECADACAO"
        }
    })

    console.log(`✅ Campanha criada: ${rifa.title} (/r/${rifa.slug})`)

    // 2.1 Criar Prêmios
    console.log("⏳ Criando prêmios...")
    await prisma.prize.deleteMany({ where: { rifaId: rifa.id } })
    await prisma.prize.createMany({
        data: [
            { title: "1º Prêmio - iPhone 15 Pro Max", position: 1, rifaId: rifa.id },
            { title: "2º Prêmio - PlayStation 5 Slim", position: 2, rifaId: rifa.id },
            { title: "3º Prêmio - R$ 1.000,00 no PIX", position: 3, rifaId: rifa.id },
        ]
    })
    console.log("⏳ Gerando cotas...")

    // Deleta cotas antigas se existirem para evitar conflito no teste
    await prisma.rifaNumber.deleteMany({ where: { rifaId: rifa.id } })

    const numbersData = Array.from({ length: totalNumbers }, (_, i) => ({
        number: i,
        rifaId: rifa.id,
        status: "AVAILABLE" as const
    }))

    await prisma.rifaNumber.createMany({
        data: numbersData
    })

    // 4. Criar Apoiador e Pagar algumas cotas para permitir o sorteio
    const buyer = await prisma.buyer.create({
        data: {
            name: "Apoiador Solidário Especial",
            whatsapp: "5511999999999",
            email: "apoiador@exemplo.com",
            rifaId: rifa.id
        }
    })

    // Marcar as 10 primeiras cotas como pagas pelo apoiador
    const numbersToPay = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]

    await prisma.rifaNumber.updateMany({
        where: {
            rifaId: rifa.id,
            number: { in: numbersToPay }
        },
        data: {
            status: "PAID",
            buyerId: buyer.id,
            paidAt: new Date()
        }
    })

    console.log(`✅ 10 cotas marcadas como PAGAS para: ${buyer.name}`)
    console.log("\n✨ Ambiente de teste pronto!")
    console.log("--------------------------------")
    console.log(`Email: ${email}`)
    console.log(`Senha: ${password}`)
    console.log(`Painel de Premiação: /sorteio/${rifa.id}`)
    console.log("--------------------------------")
}

main()
    .catch((e) => {
        console.error("❌ Erro ao criar dados:", e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
