import NextAuth from "next-auth"
import { authConfig } from "./auth.config"
import { NextResponse } from "next/server"

const { auth } = NextAuth(authConfig)

export default auth((req) => {
    const { nextUrl } = req
    const isLoggedIn = !!req.auth
    const isAdminRoute = nextUrl.pathname.startsWith("/sistema-x7k2")
    const isLoginPage = nextUrl.pathname === "/sistema-x7k2/login"

    // Redirections and authorization are now primarily handled by the 'authorized' 
    // callback in auth.config.ts to ensure consistent behavior across the app.

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
