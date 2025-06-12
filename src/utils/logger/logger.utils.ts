import { DateUtils } from "../date/date.utils";
import { config } from "@configs/index";

export class LoggerUtils {
	private static isDevelopment = config.APP_ENV === "development";

	static error(
		message: string,
		error?: Error | unknown,
		context?: object,
	): void {
		const timestamp = DateUtils.now().format("YYYY-MM-DD HH:mm:ss");
		const separator = "=".repeat(80);

		console.error(`\n${separator}`);
		console.error(`[ERROR] ${timestamp}`);
		console.error(`Message: ${message}`);

		if (context) {
			console.error(`Context:`, JSON.stringify(context, null, 2));
		}

		if (error) {
			if (error instanceof Error) {
				console.error(`Error Name: ${error.name}`);
				console.error(`Error Message: ${error.message}`);

				if (this.isDevelopment && error.stack) {
					console.error(`Stack Trace:\n${error.stack}`);
				}
			} else {
				console.error(`Error Details:`, error);
			}
		}

		console.error(separator);
	}

	static warn(message: string, context?: object): void {
		const timestamp = DateUtils.now().format("YYYY-MM-DD HH:mm:ss");
		console.warn(`[WARN] ${timestamp} - ${message}`);

		if (context) {
			console.warn(`Context:`, JSON.stringify(context, null, 2));
		}
	}

	static info(message: string, context?: object): void {
		const timestamp = DateUtils.now().format("YYYY-MM-DD HH:mm:ss");
		console.log(`[INFO] ${timestamp} - ${message}`);

		if (context) {
			console.log(`Context:`, JSON.stringify(context, null, 2));
		}
	}

	static debug(message: string, context?: object): void {
		if (this.isDevelopment) {
			const timestamp = DateUtils.now().format("YYYY-MM-DD HH:mm:ss");
			console.debug(`[DEBUG] ${timestamp} - ${message}`);

			if (context) {
				console.debug(`Context:`, JSON.stringify(context, null, 2));
			}
		}
	}
}
