import { ZodError, ZodIssue, ZodIssueCode } from "zod";

class ValidationUtils {
	static transformValidationErrors(zodError: ZodError): {
		message: string;
		errors: {
			[key: string]: string[];
		};
	} {
		const errors: { [key: string]: string[] } = {};

		zodError.issues.forEach((issue) => {
			const path = issue.path.join(".");
			const fieldName = path || "root";

			if (!errors[fieldName]) {
				errors[fieldName] = [];
			}

			const customMessage = this.getCustomErrorMessage(fieldName, issue);
			errors[fieldName].push(customMessage);
		});

		return {
			message: "Validation failed",
			errors,
		};
	}

	private static getCustomErrorMessage(
		fieldName: string,
		issue: ZodIssue,
	): string {
		const displayName = fieldName.charAt(0).toUpperCase() + fieldName.slice(1);

		switch (issue.code) {
			case ZodIssueCode.invalid_type:
				if (issue.expected === "string" && issue.received === "undefined") {
					return `Required: The field ${displayName} should not be empty`;
				}
				return `Invalid type: The field ${displayName} must be a ${issue.expected}`;

			case ZodIssueCode.invalid_string:
				if (issue.validation === "email") {
					return `Email: The field ${displayName} must be a valid email address`;
				}
				if (issue.validation === "url") {
					return `URL: The field ${displayName} must be a valid URL`;
				}
				return `Invalid format: The field ${displayName} has invalid format`;

			case ZodIssueCode.too_small:
				if (issue.type === "string") {
					return `Min length: The field ${displayName} should be at least ${issue.minimum} characters long`;
				}
				if (issue.type === "number") {
					return `Min value: The field ${displayName} should be greater than or equal to ${issue.minimum}`;
				}
				if (issue.type === "array") {
					return `Min items: The field ${displayName} should have at least ${issue.minimum} items`;
				}
				return `Too small: The field ${displayName} is too small`;

			case ZodIssueCode.too_big:
				if (issue.type === "string") {
					return `Max length: The field ${displayName} should be at most ${issue.maximum} characters long`;
				}
				if (issue.type === "number") {
					return `Max value: The field ${displayName} should be less than or equal to ${issue.maximum}`;
				}
				if (issue.type === "array") {
					return `Max items: The field ${displayName} should have at most ${issue.maximum} items`;
				}
				return `Too big: The field ${displayName} is too big`;

			case ZodIssueCode.invalid_enum_value:
				return `Invalid option: The field ${displayName} must be one of: ${issue.options.join(", ")}`;

			case ZodIssueCode.custom:
				return (
					issue.message || `Custom error: The field ${displayName} is invalid`
				);

			default:
				// Handle the deprecated 'nonempty' case and other generic cases
				if (
					issue.message?.includes("empty") ||
					issue.message?.includes("Required")
				) {
					return `Required: The field ${displayName} should not be empty`;
				}
				return issue.message || `Invalid: The field ${displayName} is invalid`;
		}
	}
}

export { ValidationUtils };
