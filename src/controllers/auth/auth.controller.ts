import {
	errorResponse,
	successResponse,
	validationErrorResponse,
	ValidationUtils,
} from "@utils/index";
import { Context } from "hono";
import { z } from "zod";

const loginSchema = z.object({
	email: z.string().email().nonempty(),
	password: z.string().nonempty(),
});

export const AuthController = {
	singIn: async (c: Context) => {
		try {
			const body = await c.req.json();

			const validation = loginSchema.safeParse(body);
			if (!validation.success) {
				const transformedErrors = ValidationUtils.transformValidationErrors(
					validation.error,
				);
				return validationErrorResponse(
					c,
					transformedErrors.message,
					transformedErrors.errors,
				);
			}

			return successResponse(c, null, "Sign in successful", 200);
		} catch (error) {
			if (error instanceof SyntaxError) {
				return errorResponse(c, "Invalid JSON format", 400);
			}

			return errorResponse(c, "Internal server error", 500);
		}
	},
};
