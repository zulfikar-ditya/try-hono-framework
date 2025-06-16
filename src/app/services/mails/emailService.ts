import { mailConfig } from "@configs/mail.config";
import nodemailer from "nodemailer";

export interface EmailData {
	to: string;
	subject: string;
	text?: string;
	html?: string;
	from?: string;
}

class EmailService {
	private transporter: nodemailer.Transporter;

	constructor() {
		this.transporter = nodemailer.createTransport(mailConfig);
	}

	async sendEmail(emailData: EmailData): Promise<void> {
		const mailOptions = {
			from: emailData.from || mailConfig.from,
			to: emailData.to,
			subject: emailData.subject,
			text: emailData.text,
			html: emailData.html,
		};

		await this.transporter.sendMail(mailOptions);
	}

	async sendEmailWithTemplate(
		emailData: EmailData,
		template: string,
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		context: Record<string, any>,
	): Promise<void> {
		// Here you would typically use a template engine to render the email content
		// For simplicity, we will just replace placeholders in the template string
		let htmlContent = template;
		for (const [key, value] of Object.entries(context)) {
			htmlContent = htmlContent.replace(new RegExp(`{{${key}}}`, "g"), value);
		}

		const mailOptions = {
			from: emailData.from || mailConfig.from,
			to: emailData.to,
			subject: emailData.subject,
			html: htmlContent,
		};

		await this.transporter.sendMail(mailOptions);
	}
}

export const emailService = new EmailService();
