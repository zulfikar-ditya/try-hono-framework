type RedisConfig = {
	host: string;
	port: number;
	password: string;
	db: number;
	ttl: number;
};

export const redisConfig: RedisConfig = {
	host: process.env.REDIS_HOST || "localhost",
	port: process.env.REDIS_PORT ? parseInt(process.env.REDIS_PORT, 10) : 6379,
	password: process.env.REDIS_PASSWORD || "",
	db: process.env.REDIS_DB ? parseInt(process.env.REDIS_DB, 10) : 0,
	ttl: process.env.REDIS_TTL ? parseInt(process.env.REDIS_TTL, 10) : 3600,
};
