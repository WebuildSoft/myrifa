import Redis from 'ioredis'

const globalForRedis = global as unknown as { redis: Redis }

const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379'

// Log de diagnóstico mascarado para o container
const maskedUrl = redisUrl.replace(/:[^:@]+@/, ':****@')
console.log(`[REDIS] Initializing connection to: ${maskedUrl}`)

// Debug: listar chaves de ambiente disponíveis (apenas nomes para segurança)
const redisEnvKeys = Object.keys(process.env).filter(k => k.startsWith('REDIS')).join(', ')
console.log(`[REDIS] Environment keys available: ${redisEnvKeys || 'None found'}`)

export const redis =
    globalForRedis.redis ||
    new Redis(redisUrl, {
        connectTimeout: 20000, // 20s para o handshake SSL inicial
        commandTimeout: 15000,
        maxRetriesPerRequest: null, // Evita o erro "Reached the max retries per request limit"
        retryStrategy(times) {
            const delay = Math.min(times * 200, 5000); // Tenta reconectar a cada max de 5s
            return delay;
        },
        enableReadyCheck: true,
        keepAlive: 10000,
        tls: redisUrl.startsWith('rediss://') ? { rejectUnauthorized: false } : undefined,
    })

redis.on('connect', () => console.log('[REDIS] Connected to server.'))
redis.on('ready', () => console.log('[REDIS] Client is ready to relay commands.'))
redis.on('reconnecting', (ms: number) => console.log(`[REDIS] Reconnecting in ${ms}ms...`))

// Throttle error logging to avoid console spam during reconnect loops
let lastErrorTime = 0
redis.on('error', (err) => {
    const now = Date.now()
    if (now - lastErrorTime > 10000) { // Log at most once every 10 seconds
        console.error('[REDIS] Connection Error:', err.message || err)
        lastErrorTime = now
    }
})

if (process.env.NODE_ENV !== 'production') globalForRedis.redis = redis
