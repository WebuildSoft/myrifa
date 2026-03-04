import NextAuth from "next-auth"
import { authConfig } from "./auth.config"
import Credentials from "next-auth/providers/credentials"
import Google from "next-auth/providers/google"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "@/lib/prisma"
import { redis } from "@/lib/redis"
import bcrypt from "bcrypt"

export const { handlers, auth, signIn, signOut } = NextAuth({
    ...authConfig,
    basePath: "/api/auth",
    trustHost: true,
    secret: process.env.AUTH_SECRET || "minhaApiKeyProtetoraTemporariaAteSetares",
    debug: process.env.NODE_ENV === "development",
    adapter: PrismaAdapter(prisma),
    session: { strategy: "jwt" },
    callbacks: {
        ...authConfig.callbacks,
        async jwt({ token, user }) {
            // No login inicial, o "user" virá preenchido.
            if (user) {
                token.role = (user as any).role
                token.id = user.id

                // Registra/Renova a autorização da Sessão no Redis
                // Se o Redis falhar no login, o fallback em navegacao posterior vai permitir o acesso via JWT comum.
                await redis.set(`session:${user.id}`, "valid", "EX", 30 * 24 * 60 * 60).catch(() => { })
            }

            // Valida integridade da Sessão no Redis.
            const userId = token.id || token.sub
            if (userId) {
                try {
                    // SÓ verificamos revogação se o Redis estiver conectado e pronto.
                    if (redis.status === 'ready') {
                        const isValid = await redis.get(`session:${userId}`)
                        if (isValid === null) {
                            token.revoked = true // FOI DELETADO via (Kick/Ban)
                        }
                    }
                } catch (error) {
                    // Fallback de segurança: permite login se Redis cair.
                    console.error("Redis connection failed on JWT callback. Using JWT fallback.", error)
                }
            }

            return token
        },
        async session({ session, token }: any) {
            // Se o token foi revogado no Redis, retornamos null para o NextAuth tratar como deslogado
            if (token.revoked) return null as any

            if (session.user) {
                session.user.id = (token.id || token.sub) as string
                session.user.role = token.role as string
            }
            return session
        }
    },
    providers: [
        Google({
            clientId: process.env.GOOGLE_CLIENT_ID || "",
            clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
        }),
        Credentials({
            name: "credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials, req) {
                if (!credentials?.email || !credentials?.password) return null

                const email = credentials.email as string
                // @ts-ignore - Get IP from headers if available
                const ip = req.headers?.["x-forwarded-for"] || "unknown"

                // Check for lockout (5 failures in last 1 hour)
                const hourAgo = new Date(Date.now() - 60 * 60 * 1000)
                const recentFailures = await prisma.loginAttempt.count({
                    where: {
                        email,
                        success: false,
                        createdAt: { gte: hourAgo }
                    }
                })

                if (recentFailures >= 5) {
                    console.log(`[Auth] Account locked for ${email} due to ${recentFailures} failures.`)
                    throw new Error("Muitas tentativas falhas. Tente novamente em 1 hora.")
                }

                const user = await prisma.user.findUnique({
                    where: { email }
                })

                if (!user || !user.password) {
                    await prisma.loginAttempt.create({
                        data: { email, ip, success: false }
                    })
                    return null
                }

                if (user.isBlocked) {
                    console.log(`[Auth] Blocked user attempt: ${email}`)
                    throw new Error("Sua conta foi suspensa. Entre em contato com o suporte.")
                }

                const passwordsMatch = await bcrypt.compare(
                    credentials.password as string,
                    user.password
                )

                if (passwordsMatch) {
                    await prisma.loginAttempt.create({
                        data: { email, ip, success: true }
                    })
                    return user
                }

                await prisma.loginAttempt.create({
                    data: { email, ip, success: false }
                })
                return null
            }
        })
    ],
})
