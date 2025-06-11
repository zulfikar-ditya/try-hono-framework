import { Context } from "hono";
import { ContentfulStatusCode } from "hono/utils/http-status";

export const errorResponse = (
	c: Context,
	message: string = "An error occurred",
	code: ContentfulStatusCode = 500,
) => {
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
	errors: { field: string; message: string[] }[],
	code: ContentfulStatusCode = 422,
) => {
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
