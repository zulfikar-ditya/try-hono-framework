import app from "./app";
import { config } from "./configs";

console.log(`Starting server on port ${config.APP_PORT}`);

export default {
  port: config.APP_PORT,
  fetch: app.fetch,
};
