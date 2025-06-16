import { UserInformation } from "@appTypes/repositories";
import { AuthService } from "@services/index";
import { StrongPassword } from "@utils/default/strong-password";
import {
	errorResponse,
	successResponse,
	validationErrorResponse,
	ValidationUtils,
} from "@utils/index";
import { Context } from "hono";
import { z } from "zod";

const signInSchema = z.object({
	email: z.string().email().nonempty(),
	password: z.string().nonempty(),
});

const signUpSchema = z
	.object({
		name: z.string().max(255).nonempty(),
		email: z.string().email().max(255).nonempty(),
		password: z.string().min(8).max(255).nonempty(),
		password_confirmation: z.string().min(8).max(255).nonempty(),
	})
	.superRefine((data, ctx) => {
		if (data.password !== data.password_confirmation) {
			ctx.addIssue({
				code: z.ZodIssueCode.custom,
				path: ["password"],
				message: "Password and password confirmation do not match",
			});
		}

		const isStrongPassword = StrongPassword.test(data.password);
		if (!isStrongPassword) {
			ctx.addIssue({
				code: z.ZodIssueCode.custom,
				path: ["password"],
				message:
					"Password must contain at least one uppercase letter, one lowercase letter, and one number",
			});
		}
	});

const VerifyEmailSchema = z.object({
	token: z.string().nonempty(),
});

const ResendEmailVerificationSchema = z.object({
	email: z.string().email().nonempty(),
});

export const AuthController = {
	signIn: async (c: Context) => {
		try {
			const body = await c.req.json();

			const validation = signInSchema.safeParse(body);
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

	signUp: async (c: Context) => {
		try {
			const body = await c.req.json();

			const validation = signUpSchema.safeParse(body);
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
			await authService.signUp(validation.data.email, validation.data.password);
			return successResponse(
				c,
				null,
				"Sign up successful, please verify your email address",
				201,
			);
		} catch (error) {
			if (error instanceof SyntaxError) {
				return errorResponse(c, "Invalid JSON format", 400);
			}
			throw error;
		}
	},

	verifyEmail: async (c: Context) => {
		try {
			const body = await c.req.json();

			const validation = VerifyEmailSchema.safeParse(body);
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
			await authService.verifyEmail(validation.data.token);
			return successResponse(c, null, "Email verified successfully", 200);
		} catch (error) {
			if (error instanceof SyntaxError) {
				return errorResponse(c, "Invalid JSON format", 400);
			}
			throw error;
		}
	},

	resendEmailVerification: async (c: Context) => {
		try {
			const body = await c.req.json();

			const validation = ResendEmailVerificationSchema.safeParse(body);
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
			await authService.resendEmailVerification(validation.data.email);
			return successResponse(
				c,
				null,
				"Email verification resent successfully",
				200,
			);
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
