import Redis from 'ioredis'

const globalForRedis = global as unknown as { redis: Redis }

export const redis =
    globalForRedis.redis ||
    new Redis(process.env.REDIS_URL || 'redis://localhost:6379', {
        maxRetriesPerRequest: null,
        enableReadyCheck: false,
    })

// Silencia erros de conexão para evitar que a app quebre nos logs quando o Redis estiver off
redis.on('error', (err) => {
    // Apenas logamos discretamente se não estiver em produção para não poluir
    if (process.env.NODE_ENV !== 'production') {
        console.warn('[REDIS] Offline:', err.message)
    }
})

if (process.env.NODE_ENV !== 'production') globalForRedis.redis = redis
