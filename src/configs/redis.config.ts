import Redis, { RedisOptions } from "ioredis";

export const redisConfig: RedisOptions = {
	host: process.env.REDIS_HOST || "localhost",
	port: process.env.REDIS_PORT ? parseInt(process.env.REDIS_PORT, 10) : 6379,
	password: process.env.REDIS_PASSWORD || "",
	db: process.env.REDIS_DB ? parseInt(process.env.REDIS_DB, 10) : 0,
	retryStrategy: (times) => {
		const delay = Math.min(
			times * 100,
			process.env.REDIS_RETRY_STRATEGY
				? parseInt(process.env.REDIS_RETRY_STRATEGY, 10)
				: 3000,
		);
		return delay;
	},
	maxRetriesPerRequest: process.env.REDIS_MAX_RETRIES
		? parseInt(process.env.REDIS_MAX_RETRIES, 10)
		: 3,
};

export const redis = new Redis(redisConfig);
