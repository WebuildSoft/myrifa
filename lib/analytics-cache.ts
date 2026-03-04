import { redis } from "./redis";

export interface CachedSale {
    id: string;
    amount: number;
    paidAt: string;
    buyer: { name: string };
    rifa: { title: string };
}

/**
 * Pushes a new sale to the Redis cache for the live dashboard.
 * Increments total revenue and updates the recent sales list.
 */
export async function pushSaleToCache(sale: CachedSale) {
    try {
        const pipeline = redis.pipeline();

        // 1. Increment total revenue
        pipeline.incrbyfloat("dashboard:total_revenue", sale.amount);

        // 2. Push to recent sales list
        const saleJson = JSON.stringify(sale);
        pipeline.lpush("dashboard:recent_sales", saleJson);

        // 3. Keep only the last 10 sales
        pipeline.ltrim("dashboard:recent_sales", 0, 9);

        await pipeline.exec();
    } catch (error) {
        console.error("[REDIS_ANALYTICS_CACHE] Error pushing sale:", error);
    }
}
