/**
 * Lightweight in-memory rate limiter using a sliding window per IP.
 * Works in both Node.js and Edge runtimes.
 * No external dependencies required.
 */

interface RateLimitEntry {
    count: number
    windowStart: number
}

// Shared store — persists across requests within the same process
const store = new Map<string, RateLimitEntry>()

// Cleanup old entries every 5 minutes to prevent memory leaks
if (typeof setInterval !== "undefined") {
    setInterval(() => {
        const now = Date.now()
        store.forEach((entry, key) => {
            if (now - entry.windowStart > 60_000 * 5) {
                store.delete(key)
            }
        })
    }, 5 * 60 * 1000)
}

export interface RateLimitConfig {
    /** Max number of requests allowed within the window */
    limit: number
    /** Window length in milliseconds */
    windowMs: number
}

export interface RateLimitResult {
    success: boolean
    /** Remaining requests in this window */
    remaining: number
    /** Milliseconds until the window resets */
    resetIn: number
}

/**
 * Check rate limit for an identifier (usually an IP address).
 * Returns a result object — the caller is responsible for returning the 429 response.
 */
export function rateLimit(identifier: string, config: RateLimitConfig): RateLimitResult {
    const { limit, windowMs } = config
    const now = Date.now()

    const existing = store.get(identifier)

    // New window or expired window
    if (!existing || now - existing.windowStart >= windowMs) {
        store.set(identifier, { count: 1, windowStart: now })
        return { success: true, remaining: limit - 1, resetIn: windowMs }
    }

    // Within current window
    if (existing.count >= limit) {
        const resetIn = windowMs - (now - existing.windowStart)
        return { success: false, remaining: 0, resetIn }
    }

    existing.count++
    const resetIn = windowMs - (now - existing.windowStart)
    return { success: true, remaining: limit - existing.count, resetIn }
}

/**
 * Extract the real IP from a Next.js request.
 * Handles Cloudflare, Vercel, Netlify, and direct connections.
 */
export function getIP(request: Request): string {
    const forwardedFor = request.headers.get("x-forwarded-for")
    if (forwardedFor) {
        return forwardedFor.split(",")[0].trim()
    }
    return request.headers.get("x-real-ip") ||
        request.headers.get("cf-connecting-ip") ||
        "unknown"
}

/**
 * Build a standard 429 Too Many Requests response.
 */
export function rateLimitResponse(resetIn: number) {
    return Response.json(
        { error: "Muitas requisições. Tente novamente em alguns instantes." },
        {
            status: 429,
            headers: {
                "Retry-After": String(Math.ceil(resetIn / 1000)),
                "X-RateLimit-Reset": String(Date.now() + resetIn),
            },
        }
    )
}
