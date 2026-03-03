import Redis from 'ioredis'

const globalForRedis = global as unknown as { redis: Redis }

const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379'

// Log de diagnóstico mascarado para o container
const maskedUrl = redisUrl.replace(/:[^:@]+@/, ':****@')
console.log(`[REDIS] Initializing connection to: ${maskedUrl}`)

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

// Silencia erros de conexão para evitar que a app quebre nos logs quando o Redis estiver off
redis.on('error', (err) => {
    console.error('[REDIS] Connection Error Details:', err.message)
})

if (process.env.NODE_ENV !== 'production') globalForRedis.redis = redis
