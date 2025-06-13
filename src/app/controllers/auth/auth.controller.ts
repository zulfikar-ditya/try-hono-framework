import { UserInformation } from "@appTypes/repositories";
import { AuthService } from "@services/index";
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

			const authService: AuthService = c.get("authService");
			const result = await authService.login(
				validation.data.email,
				validation.data.password,
			);

			return successResponse(c, result, "Sign in successful", 200);
		} catch (error) {
			if (error instanceof SyntaxError) {
				return errorResponse(c, "Invalid JSON format", 400);
			}
			throw error;
		}
	},

	profile: (c: Context) => {
		const user: UserInformation = c.get("user");
		if (!user) {
			return errorResponse(c, "User not found", 404);
		}

		return successResponse(c, user, "User profile retrieved successfully", 200);
	},
};
