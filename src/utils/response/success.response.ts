import { Context } from "hono";
import { ContentfulStatusCode } from "hono/utils/http-status";

export const successResponse = (
	c: Context,
	data: object | null = null,
	message: string = "Success",
	code: ContentfulStatusCode = 200,
) => {
	return c.json(
		{
			status: true,
			message,
			data,
		},
		code,
	);
};

export const successResponseWithPagination = (
	c: Context,
	data: object | null,
	total: number,
	page: number,
	limit: number,
	message: string = "Success",
) => {
	return c.json({
		status: true,
		message,
		data,
		pagination: {
			total,
			page,
			limit,
			totalPages: Math.ceil(total / limit),
		},
	});
};
