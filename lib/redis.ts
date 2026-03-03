import Redis from 'ioredis'

const globalForRedis = global as unknown as { redis: Redis }

const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379'

// Log de diagnóstico mascarado para o container
const maskedUrl = redisUrl.replace(/:[^:@]+@/, ':****@')
console.log(`[REDIS] Prep connection to: ${maskedUrl} (Status: ${globalForRedis.redis ? 'reusing' : 'new'})`)

export const redis =
    globalForRedis.redis ||
    new Redis(redisUrl, {
        connectTimeout: 15000,
        commandTimeout: 10000,
        maxRetriesPerRequest: 3,
        enableReadyCheck: false,
        tls: redisUrl.startsWith('rediss://') ? { rejectUnauthorized: false } : undefined,
    })

// Silencia erros de conexão para evitar que a app quebre nos logs quando o Redis estiver off
redis.on('error', (err) => {
    // Apenas logamos discretamente se não estiver em produção para não poluir
    if (process.env.NODE_ENV !== 'production') {
        console.warn('[REDIS] Offline:', err.message)
    }
})

if (process.env.NODE_ENV !== 'production') globalForRedis.redis = redis
