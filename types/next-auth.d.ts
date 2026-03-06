import { DefaultSession } from "next-auth"
import { AdminRole } from "@prisma/client"

declare module "next-auth" {
    interface Session {
        user: {
            id: string
            role: string
            plan: string
        } & DefaultSession["user"]
    }

    interface User {
        role?: string
        plan?: string
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        role?: string
        plan?: string
    }
}
