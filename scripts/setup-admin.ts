import { PrismaClient } from "@prisma/client"
import bcrypt from "bcrypt"

const prisma = new PrismaClient()

async function main() {
    const email = process.argv[2] || "admin@example.com"
    const password = "AdminPassword123!"

    console.log(`Checking for user: ${email}...`)

    const existingUser = await prisma.user.findUnique({
        where: { email }
    })

    if (existingUser) {
        console.log(`User found. Promoting to SUPER_ADMIN and ensuring not blocked...`)
        await prisma.user.update({
            where: { email },
            data: {
                role: "SUPER_ADMIN",
                isBlocked: false
            }
        })
        console.log(`User ${email} is now a SUPER_ADMIN.`)
    } else {
        console.log(`User not found. Creating new SUPER_ADMIN...`)
        const hashedPassword = await bcrypt.hash(password, 10)
        await prisma.user.create({
            data: {
                email,
                name: "Admin Principal",
                password: hashedPassword,
                role: "SUPER_ADMIN",
                isBlocked: false
            }
        })
        console.log(`Created new SUPER_ADMIN:`)
        console.log(`Email: ${email}`)
        console.log(`Password: ${password}`)
    }
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect())
