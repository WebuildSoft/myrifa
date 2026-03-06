import type { NextAuthConfig } from "next-auth"

export const authConfig = {
    pages: {
        signIn: "/login",
    },
    callbacks: {
        authorized({ auth, request: { nextUrl } }) {
            const isLoggedIn = !!auth?.user?.id
            const isAdmin = ["SUPER_ADMIN", "ADMIN"].includes((auth?.user as any)?.role)

            const isAdminRoute = nextUrl.pathname.startsWith("/sistema-x7k2")
            const isLoginPage = nextUrl.pathname === "/sistema-x7k2/login"

            const protectedPaths = [
                "/dashboard",
                "/rifas/nova",
                "/conta",
                "/planos"
            ]

            const isProtected = protectedPaths.some(path => nextUrl.pathname.startsWith(path)) ||
                nextUrl.pathname.match(/^\/rifas\/.*\/editar$/) ||
                nextUrl.pathname.match(/^\/rifas\/.*\/compradores$/) ||
                nextUrl.pathname.match(/^\/rifas\/.*\/sorteio$/)

            // Admin Route Logic
            if (isAdminRoute && !isLoginPage) {
                // Root admin path specifically should probably go to dashboard if admin, or login if not
                if (nextUrl.pathname === "/sistema-x7k2") {
                    if (isLoggedIn && isAdmin) return Response.redirect(new URL("/sistema-x7k2/dashboard", nextUrl))
                    return Response.redirect(new URL("/sistema-x7k2/login", nextUrl))
                }

                if (!isLoggedIn || !isAdmin) {
                    return Response.redirect(new URL("/sistema-x7k2/login", nextUrl))
                }
                return true
            }

            // Normal User Logic
            if (isProtected) {
                if (isLoggedIn) return true
                return false // Auth.js automatically handles redirection to signIn page
            } else if (isLoggedIn && (nextUrl.pathname === "/login" || nextUrl.pathname === "/register")) {
                const dashboardUrl = new URL("/dashboard", nextUrl)
                return Response.redirect(dashboardUrl)
            }
            return true
        },
        jwt: async ({ token, user }) => {
            if (user) {
                token.role = (user as any).role
            }
            return token
        },
        session: async ({ session, token }) => {
            if (token?.sub && session.user) {
                session.user.id = token.sub
                session.user.role = token.role as string
            }
            return session
        },
    },
    providers: [], // Add providers array here, empty for now to satisfy type, populated in auth.ts
} satisfies NextAuthConfig
