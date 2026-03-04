import { redis } from './lib/redis';

async function testConnection() {
    console.log("[TEST] Attempting to connect to Redis...");
    try {
        // Set a key to test write
        await redis.set("test_availability", "ok", "EX", 10);
        const val = await redis.get("test_availability");
        console.log(`[TEST] Connection Success! Value: ${val}`);

        // Check some metrics
        const info = await redis.info('stats');
        console.log("[TEST] Redis Stats retrieved.");

        process.exit(0);
    } catch (e) {
        console.error("[TEST] Redis Still Failing:", e.message || e);
        process.exit(1);
    }
}

testConnection();
