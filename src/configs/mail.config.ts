interface MailConfig {
	host: string;
	port: number;
	secure: boolean;
	auth: {
		user: string;
		pass: string;
	};
	from: string;
}

export const mailConfig: MailConfig = {
	host: process.env.SMTP_HOST || "smtp.gmail.com",
	port: parseInt(process.env.SMTP_PORT || "587", 10),
	secure: process.env.SMTP_SECURE === "true",
	auth: {
		user: process.env.SMTP_USER || "",
		pass: process.env.SMTP_PASS || "",
	},
	from: process.env.SMTP_FROM || "<noreply@example.com>",
};
