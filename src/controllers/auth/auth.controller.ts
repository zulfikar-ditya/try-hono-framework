import {
	errorResponse,
	successResponse,
	validationErrorResponse,
} from "@utils/index";
import { Context } from "hono";
import { z } from "zod";

const loginSchema = z.object({
	email: z.string().email().nonempty(),
	password: z.string().nonempty(),
});

export const AuthController = {
	singIn: async (c: Context) => {
		const body = await c.req.json();

		const validation = await loginSchema.safeParse(body);
		if (!validation.success) {
			return c.json(
				{
					status: false,
					message: "Validation error",
					errors: validation.error.issues,
				},
				422,
			);
		}

		return successResponse(c, body, "Sign in successful", 200);
	},
};
