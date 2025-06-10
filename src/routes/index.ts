import { healthController } from "@controllers/health.controller";
import { Hono } from "hono";

const routes = new Hono();

routes.get("/", (c) => {
  return c.json({
    status: "ok",
    message: "Welcome to the Hono API Service",
    timestamp: new Date().toISOString(),
    env: process.env.APP_ENV || "development",
  });
});
routes.get("/health", healthController.getHealth);

export default routes;
