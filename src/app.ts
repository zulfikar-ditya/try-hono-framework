import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { corsConfig } from "@configs/index";
import routes from "@routes/index";

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

app.route("/", routes);

export default app;
