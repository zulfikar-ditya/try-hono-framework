type ConfigType = {
	APP_NAME: string;
	APP_VERSION: string;
	APP_DESCRIPTION: string;
	APP_PORT: number;
	APP_SECRET: string;
	APP_ENV: string;
	APP_HOST: string;
	APP_TIMEZONE: string;
	APP_CLIENT_URL: string;
	SERVER_TIMEZONE: string;
};

export const config: ConfigType = {
	APP_NAME: process.env.APP_NAME || "Hono Api Service",
	APP_VERSION: process.env.APP_VERSION || "1.0.0",
	APP_DESCRIPTION: process.env.APP_DESCRIPTION || "A Hono API service",
	APP_PORT: process.env.APP_PORT ? parseInt(process.env.APP_PORT, 10) : 3000,
	APP_SECRET: process.env.APP_SECRET || "default_secret",
	APP_ENV: process.env.APP_ENV || "development",
	APP_HOST: process.env.APP_HOST || "localhost",
	APP_TIMEZONE: process.env.APP_TIMEZONE || "UTC",
	APP_CLIENT_URL: process.env.APP_CLIENT_URL || "http://localhost:3000",
	SERVER_TIMEZONE: process.env.SERVER_TIMEZONE || "UTC",
};

export const isProduction = config.APP_ENV === "production";
