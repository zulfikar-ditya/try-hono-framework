type ConfigType = {
	APP_NAME: string;
	APP_VERSION: string;
	APP_DESCRIPTION: string;
	APP_PORT: number;
	APP_SECRET: string;
	APP_ENV: string;
	APP_HOST: string;
};

type CorsConfigType = {
	origin: string;
	methods: string[];
	allowedHeaders: string[];
	exposedHeaders: string[];
	maxAge: number;
	credentials: boolean;
};

export const config: ConfigType = {
	APP_NAME: process.env.APP_NAME || "Hono Api Service",
	APP_VERSION: process.env.APP_VERSION || "1.0.0",
	APP_DESCRIPTION: process.env.APP_DESCRIPTION || "A Hono API service",
	APP_PORT: process.env.APP_PORT ? parseInt(process.env.APP_PORT, 10) : 3000,
	APP_SECRET: process.env.APP_SECRET || "default_secret",
	APP_ENV: process.env.APP_ENV || "development",
	APP_HOST: process.env.APP_HOST || "localhost",
};

export const corsConfig: CorsConfigType = {
	origin: process.env.CORS_ORIGIN || "*",
	methods: process.env.CORS_METHODS
		? process.env.CORS_METHODS.split(",").map((method) => method.trim())
		: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE"],
	allowedHeaders: process.env.CORS_ALLOWED_HEADERS
		? process.env.CORS_ALLOWED_HEADERS.split(",").map((header) => header.trim())
		: ["Content-Type", "Authorization"],
	exposedHeaders: process.env.CORS_EXPOSED_HEADERS
		? process.env.CORS_EXPOSED_HEADERS.split(",").map((header) => header.trim())
		: [],
	maxAge: process.env.CORS_MAX_AGE
		? parseInt(process.env.CORS_MAX_AGE, 10)
		: 86400, // Default to 24 hours
	credentials: process.env.CORS_CREDENTIALS === "true",
};

export const isProduction = config.APP_ENV === "production";
