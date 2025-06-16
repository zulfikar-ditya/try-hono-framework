import { config, isProduction } from "@configs/app.config";
import { emailQueue } from "src/app/queues/emailQueue";

export const sendEmailVerification = async (
	email: string,
	token: string,
): Promise<void> => {
	const title = isProduction
		? "[TESTING] Email Verification"
		: "Email Verification";

	const url = `${config.APP_CLIENT_URL}/verify-email?token=${token}`;

	const emailData = {
		to: email,
		subject: title,
		text: `Please verify your email by clicking on the following link: ${url}`,
		html: `<p>Please verify your email by clicking on the following link:</p><a href="${url}">Verify Email</a>`,
	};

	await emailQueue.add(emailData);
};
