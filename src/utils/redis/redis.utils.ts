import { createClient, RedisClientType } from "redis";
import { redisConfig } from "@configs/redis.config";
import { LoggerUtils } from "@utils/logger/logger.utils";

export class RedisUtils {
	private static client: RedisClientType | null = null;
	private static isConnected = false;

	static async getClient(): Promise<RedisClientType> {
		if (!this.client) {
			this.client = createClient({
				socket: {
					host: redisConfig.host,
					port: redisConfig.port,
				},
				password: redisConfig.password || undefined,
				database: redisConfig.db,
			});

			this.client.on("error", (err) => {
				LoggerUtils.error("Redis Client Error", err);
				this.isConnected = false;
			});

			this.client.on("connect", () => {
				LoggerUtils.info("Redis Client Connected");
				this.isConnected = true;
			});

			this.client.on("disconnect", () => {
				LoggerUtils.warn("Redis Client Disconnected");
				this.isConnected = false;
			});
		}

		if (!this.isConnected) {
			await this.client.connect();
		}

		return this.client;
	}

	static async set(
		key: string,
		value: string,
		ttl?: number,
	): Promise<string | null> {
		try {
			const client = await this.getClient();
			const expiry = ttl || redisConfig.ttl;
			return await client.setEx(key, expiry, value);
		} catch (error) {
			LoggerUtils.error("Redis SET Error", error, { key, value });
			return null;
		}
	}

	static async get(key: string): Promise<string | null> {
		try {
			const client = await this.getClient();
			return await client.get(key);
		} catch (error) {
			LoggerUtils.error("Redis GET Error", error, { key });
			return null;
		}
	}

	static async del(key: string): Promise<number> {
		try {
			const client = await this.getClient();
			return await client.del(key);
		} catch (error) {
			LoggerUtils.error("Redis DEL Error", error, { key });
			return 0;
		}
	}

	static async exists(key: string): Promise<boolean> {
		try {
			const client = await this.getClient();
			const result = await client.exists(key);
			return result === 1;
		} catch (error) {
			LoggerUtils.error("Redis EXISTS Error", error, { key });
			return false;
		}
	}

	static async setObject(
		key: string,
		value: object,
		ttl?: number,
	): Promise<string | null> {
		return await this.set(key, JSON.stringify(value), ttl);
	}

	static async getObject<T>(key: string): Promise<T | null> {
		try {
			const value = await this.get(key);
			// eslint-disable-next-line @typescript-eslint/no-unsafe-return
			return value ? JSON.parse(value) : null;
		} catch (error) {
			LoggerUtils.error("Redis GET Object Error", error, { key });
			return null;
		}
	}

	static async flushAll(): Promise<string | null> {
		try {
			const client = await this.getClient();
			return await client.flushAll();
		} catch (error) {
			LoggerUtils.error("Redis FLUSH ALL Error", error);
			return null;
		}
	}

	static async disconnect(): Promise<void> {
		if (this.client && this.isConnected) {
			await this.client.disconnect();
			this.isConnected = false;
			LoggerUtils.info("Redis Client Disconnected");
		}
	}

	static isClientConnected(): boolean {
		return this.isConnected;
	}
}
