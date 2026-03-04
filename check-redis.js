const Redis = require('ioredis');
require('dotenv').config();

const redisUrl = process.env.REDIS_URL || "redis://localhost:6379";

async function checkRedis() {
    const redis = new Redis(redisUrl, {
        tls: redisUrl.startsWith('rediss://') ? { rejectUnauthorized: false } : undefined,
    });

    try {
        console.log("--- REDIS DIAGNOSTIC ---");

        const onlineCount = await redis.zcount("online_users", "-inf", "+inf");
        console.log("Online Users Count (Total):", onlineCount);

        const recentViews = await redis.lrange("recent_views", 0, -1);
        console.log("Recent Views (Count):", recentViews.length);
        if (recentViews.length > 0) {
            console.log("Latest View Sample:", recentViews[0]);
        }

        const totalRevenue = await redis.get("dashboard:total_revenue");
        console.log("Total Revenue (Cache):", totalRevenue);

        const recentSales = await redis.lrange("dashboard:recent_sales", 0, -1);
        console.log("Recent Sales (Count):", recentSales.length);

        const cooldown = await redis.get("wa_alert_cooldown");
        console.log("WhatsApp Cooldown Active:", !!cooldown);

        process.exit(0);
    } catch (error) {
        console.error("Redis Diagnostic Error:", error);
        process.exit(1);
    }
}

checkRedis();
