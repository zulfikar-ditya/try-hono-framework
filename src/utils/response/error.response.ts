import { Context } from "hono";
import { ContentfulStatusCode } from "hono/utils/http-status";
import { LoggerUtils } from "../logger/logger.utils";

export const errorResponse = (
	c: Context,
	message: string = "An error occurred",
	code: ContentfulStatusCode = 500,
) => {
	const requestContext = {
		method: c.req.method,
		url: c.req.url,
		statusCode: code,
	};

	LoggerUtils.error(`Error Response: ${message}`, undefined, requestContext);

	return c.json(
		{
			status: false,
			message,
			data: null,
		},
		code,
	);
};

export const validationErrorResponse = (
	c: Context,
	message: string = "Validation error",
	errors: {
		[key: string]: string[];
	},
	code: ContentfulStatusCode = 422,
) => {
	const requestContext = {
		method: c.req.method,
		url: c.req.url,
		statusCode: code,
		validationErrors: errors,
	};

	return c.json(
		{
			status: false,
			message,
			errors,
			data: null,
		},
		code,
	);
};
