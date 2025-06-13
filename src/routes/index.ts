import { AuthController } from "@controllers/auth/auth.controller";
import { healthController } from "@controllers/health.controller";
import { authMiddleware } from "@middlewares/auth.middleware";
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

routes.post("auth/signin", AuthController.singIn);

routes.get("profile", authMiddleware, AuthController.profile);

export default routes;
