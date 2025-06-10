import { config } from "@configs/index";
import { Context } from "hono";

export const healthController = {
  getHealth: (c: Context) => {
    return c.json({
      status: "ok",
      message: "Service is healthy",
      timestamp: new Date().toISOString(),
      env: config.APP_ENV,
    });
  },
};
