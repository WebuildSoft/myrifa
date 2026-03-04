import Redis from 'ioredis'

const globalForRedis = global as unknown as { redis: Redis }

const rawUrl = process.env.REDIS_URL || ""
const isLiteral = rawUrl.startsWith('$') || rawUrl === "undefined" || rawUrl === "null"

// Detect if we are in Next.js build phase
const isBuildPhase = process.env.NEXT_PHASE === 'phase-production-build' ||
    (process.env.NODE_ENV === 'production' && !process.env.REDIS_URL)

// Detailed (but safe) diagnostics
const redisKeys = Object.keys(process.env).filter(k => k.startsWith('REDIS'))
const envStatus = redisKeys.map(k => `${k}(len:${process.env[k]?.length || 0})`).join(', ')
console.log(`[REDIS] Phase: ${isBuildPhase ? 'BUILD' : 'RUNTIME'} | Env: ${envStatus || 'None'}`)

// Use fallback if missing or literal string
const redisUrl = (!rawUrl || isLiteral) ? "redis://localhost:6379" : rawUrl
const maskedUrl = redisUrl.replace(/:[^:@]+@/, ':****@')

if (rawUrl && isLiteral) {
    console.warn(`[REDIS] WARNING: REDIS_URL seems to be a literal string "${rawUrl}". Falling back to localhost.`)
}

if (!isBuildPhase) {
    console.log(`[REDIS] Initializing connection to: ${maskedUrl}`)
}

export const redis =
    globalForRedis.redis ||
    new Redis(redisUrl, {
        lazyConnect: true, // Crucial: don't connect immediately on instantiation
        connectTimeout: 20000,
        commandTimeout: 15000,
        maxRetriesPerRequest: null,
        retryStrategy(times) {
            // No need to retry aggressively during build
            if (isBuildPhase) return null
            const delay = Math.min(times * 200, 5000)
            return delay
        },
        enableReadyCheck: true,
        keepAlive: 10000,
        tls: redisUrl.startsWith('rediss://') ? { rejectUnauthorized: false } : undefined,
    })

// Manual connect only if NOT in build phase
if (!isBuildPhase && !globalForRedis.redis) {
    redis.connect().catch(() => {
        // Silent catch: errors handled by the 'error' listener below
    })
}

redis.on('connect', () => console.log('[REDIS] Connected to server.'))
redis.on('ready', () => console.log('[REDIS] Client is ready to relay commands.'))
redis.on('reconnecting', (ms: number) => !isBuildPhase && console.log(`[REDIS] Reconnecting in ${ms}ms...`))

// Throttle error logging
let lastErrorTime = 0
redis.on('error', (err) => {
    if (isBuildPhase) return // Ignore errors during build
    const now = Date.now()
    if (now - lastErrorTime > 10000) {
        console.error('[REDIS] Connection Error:', err.message || err)
        lastErrorTime = now
    }
})


/**
 * Helper to race a promise against a timeout
 */
export async function withTimeout<T>(promise: Promise<T>, ms: number, fallback: T): Promise<T> {
    try {
        return await Promise.race([
            promise,
            new Promise<T>((_, reject) => setTimeout(() => reject(new Error("Timeout")), ms))
        ]);
    } catch (e) {
        return fallback;
    }
}

if (process.env.NODE_ENV !== 'production') globalForRedis.redis = redis
