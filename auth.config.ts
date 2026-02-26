import type { NextAuthConfig } from "next-auth"

export const authConfig = {
    pages: {
        signIn: "/login",
    },
    callbacks: {
        authorized({ auth, request: { nextUrl } }) {
            const isLoggedIn = !!auth?.user
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

            if (isProtected) {
                if (isLoggedIn) return true
                return false // Redirect to /login
            } else if (isLoggedIn && (nextUrl.pathname === "/login" || nextUrl.pathname === "/register")) {
                return Response.redirect(new URL("/dashboard", nextUrl))
            }
            return true
        },
    },
    providers: [], // Add providers array here, empty for now to satisfy type, populated in auth.ts
} satisfies NextAuthConfig
