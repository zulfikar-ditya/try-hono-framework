import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { corsConfig, isProduction } from "@configs/index";
import routes from "@routes/index";
import { HTTPException } from "hono/http-exception";
import { DateUtils, LoggerUtils } from "@utils/index";
import { AuthService } from "@services/index";
import { ContentfulStatusCode } from "hono/utils/http-status";

const app: Hono = new Hono();

app.use("*", logger());
app.use(
	"*",
	cors({
		origin: corsConfig.origin,
		allowMethods: corsConfig.methods,
		allowHeaders: corsConfig.allowedHeaders,
		exposeHeaders: corsConfig.exposedHeaders,
		maxAge: corsConfig.maxAge,
		credentials: corsConfig.credentials,
	}),
);

// Bind services to context===========================================
app.use("*", async (c, next) => {
	c.set("authService", new AuthService());
	await next();
});

// Error handling=====================================================
app.onError((err, c) => {
	if (err instanceof HTTPException && err.status === 422) {
		return c.json(
			{
				status: false,
				message: err.message,
				errors: err.cause || [],
				data: null,
			},
			422,
		);
	}

	const requestContext = {
		method: c.req.method,
		url: c.req.url,
		userAgent: c.req.header("user-agent"),
		ip:
			c.req.header("x-forwarded-for") || c.req.header("x-real-ip") || "unknown",
		timestamp: DateUtils.now().toISOString(),
	};

	LoggerUtils.error("Internal Server Error", err, requestContext);

	return c.json(
		{
			status: false,
			message: "Internal server error",
			errors: [],
			trace: err instanceof Error && !isProduction ? err.stack : undefined,
			data: null,
		},
		500,
	);
});

app.route("/", routes);

export default app;
