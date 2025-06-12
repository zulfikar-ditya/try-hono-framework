import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { corsConfig } from "@configs/index";
import routes from "@routes/index";
import { HTTPException } from "hono/http-exception";

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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
app.onError((err, c) => {
	if (err instanceof HTTPException) {
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

	return c.json(
		{
			status: false,
			message: "Internal server error",
			errors: [],
			trace: err instanceof Error ? err.stack : undefined,
			data: null,
		},
		500,
	);
});

app.route("/", routes);

export default app;
