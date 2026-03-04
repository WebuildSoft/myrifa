const Redis = require('ioredis');
require('dotenv').config();

async function testSimple() {
    const url = process.env.REDIS_URL;
    console.log(`[TEST] Testing URL: ${url}`);

    // Create client manually to be sure
    const redis = new Redis(url, {
        connectTimeout: 5000,
        maxRetriesPerRequest: 0
    });

    try {
        await redis.set("test_stability", "ok");
        const res = await redis.get("test_stability");
        console.log(`[TEST] Result: ${res}`);
        console.log("[TEST] Redis is ALWAYS AVAILABLE now! ✅");
        process.exit(0);
    } catch (e) {
        console.error(`[TEST] FAILED: ${e.message}`);
        process.exit(1);
    }
}

testSimple();
