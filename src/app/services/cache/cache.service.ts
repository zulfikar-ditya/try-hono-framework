import { RedisUtils } from "@utils/redis/redis.utils";
import { LoggerUtils } from "@utils/logger/logger.utils";

export class CacheService {
	private static defaultTTL = 3600; // 1 hour

	static async get<T>(key: string): Promise<T | null> {
		try {
			return await RedisUtils.getObject<T>(key);
		} catch (error) {
			LoggerUtils.error("Cache GET Error", error, { key });
			return null;
		}
	}

	static async set(
		key: string,
		//eslint-disable-next-line
		value: any,
		ttl: number = this.defaultTTL,
	): Promise<boolean> {
		try {
			// eslint-disable-next-line @typescript-eslint/no-unsafe-argument
			const result = await RedisUtils.setObject(key, value, ttl);
			return result !== null;
		} catch (error) {
			LoggerUtils.error("Cache SET Error", error, { key });
			return false;
		}
	}

	static async delete(key: string): Promise<boolean> {
		try {
			const result = await RedisUtils.del(key);
			return result > 0;
		} catch (error) {
			LoggerUtils.error("Cache DELETE Error", error, { key });
			return false;
		}
	}

	static async exists(key: string): Promise<boolean> {
		try {
			return await RedisUtils.exists(key);
		} catch (error) {
			LoggerUtils.error("Cache EXISTS Error", error, { key });
			return false;
		}
	}

	static async remember<T>(
		key: string,
		callback: () => Promise<T>,
		ttl: number = this.defaultTTL,
	): Promise<T> {
		// Try to get from cache first
		const cached = await this.get<T>(key);
		if (cached !== null) {
			return cached;
		}

		// If not in cache, execute callback and cache the result
		const result = await callback();
		await this.set(key, result, ttl);
		return result;
	}

	static async flush(): Promise<boolean> {
		try {
			const result = await RedisUtils.flushAll();
			return result !== null;
		} catch (error) {
			LoggerUtils.error("Cache FLUSH Error", error);
			return false;
		}
	}

	// Helper methods for common cache patterns
	static userProfileKey(userId: string): string {
		return `user:profile:${userId}`;
	}

	static accessTokenKey(token: string): string {
		return `auth:token:${token}`;
	}

	static sessionKey(sessionId: string): string {
		return `session:${sessionId}`;
	}
}
