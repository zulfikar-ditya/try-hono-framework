import Bull from "bull";
import { redisConfig } from "@configs/redis.config";
import { EmailData, emailService } from "@services/mails/emailService";
import { LoggerUtils } from "@utils/index";

export const emailQueue = new Bull("email queue", {
	redis: redisConfig,
	defaultJobOptions: {
		removeOnComplete: 10,
		removeOnFail: 5,
		attempts: 3,
		backoff: {
			type: "exponential",
			delay: 2000,
		},
	},
});

emailQueue
	.process(async (job) => {
		const emailData: EmailData = job.data;
		LoggerUtils.info(`Processing email job for ${emailData.to}`);

		try {
			await emailService.sendEmail(emailData);
			LoggerUtils.info(`Email sent to ${emailData.to} successfully`);
		} catch (error) {
			LoggerUtils.error(`Failed to send email to ${emailData.to}:`, error);
			throw error;
		}
	})
	.then(() => {
		LoggerUtils.info("Email queue processor started successfully");
	})
	.catch((error) => {
		LoggerUtils.error("Failed to start email queue processor:", error);
	});

emailQueue.on("completed", (job) => {
	LoggerUtils.info(`Email job ${job.id} completed successfully`);
});

emailQueue.on("failed", (job, err) => {
	LoggerUtils.error(`Email job ${job.id} failed with error:`, err);
});
