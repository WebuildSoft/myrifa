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
        async jwt({ token, user }) {
            // No login inicial, o "user" virá preenchido.
            if (user && user.id) {
                token.id = user.id
                // Registra/Renova a autorização da Sessão Híbrida no Redis (TTL de 30 dias)
                await redis.set(`session:${user.id}`, "valid", "EX", 30 * 24 * 60 * 60).catch(() => { })
            }

            // Para requisições subsequentes, valida a integridade da Sessão remotamente.
            if (token.id) {
                try {
                    const isValid = await redis.get(`session:${token.id}`)
                    if (!isValid) {
                        // A chave não existe mais (foi deletada via Kick/Ban por admin ou expirou)
                        token.revoked = true
                    }
                } catch (error) {
                    // Fallback de segurança: se o Redis cair, permite a navegação baseado apenas no JWT.
                    console.error("Redis connection failed on JWT callback:", error)
                }
            }

            return token
        },
        async session({ session, token }: any) {
            // Se o JWT foi sinalizado como revogado pela nossa checagem no Redis, destruimos a sessão pública.
            if (token.revoked) {
                return {} as any
            }
            // Repassa o ID para o front-end
            if (token.id && session.user) {
                session.user.id = token.id as string
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
