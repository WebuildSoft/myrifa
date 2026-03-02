import NextAuth from "next-auth"
import { authConfig } from "./auth.config"
import { NextResponse } from "next/server"

const { auth } = NextAuth(authConfig)

export default auth((req) => {
    const { nextUrl } = req
    const isLoggedIn = !!req.auth
    const isAdminRoute = nextUrl.pathname.startsWith("/sistema-x7k2")
    const isLoginPage = nextUrl.pathname === "/sistema-x7k2/login"

    // Stealth Admin Protection: If unauthorized, returns 404 instead of 401/302
    if (isAdminRoute && !isLoginPage) {
        const role = (req.auth?.user as any)?.role
        const isAdmin = ["SUPER_ADMIN", "ADMIN"].includes(role)

        if (!isLoggedIn || !isAdmin) {
            console.log(`[Middleware] Stealth blocking access to ${nextUrl.pathname} (User: ${req.auth?.user?.email || 'none'}, Role: ${role || 'none'})`)
            // Return 404 for total obscurity
            return new NextResponse(null, { status: 404 })
        }
    }

    // Ensure we are passing along the exact pathname securely down to the layouts
    const requestHeaders = new Headers(req.headers)
    requestHeaders.set('x-pathname', nextUrl.pathname)

    return NextResponse.next({
        request: {
            headers: requestHeaders,
        }
    })
})

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|.*\\.png$|.*\\.css$|.*\\.js$).*)'],
};
