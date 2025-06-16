import { Hono } from "hono";
import { emailQueue } from "../app/queues/emailQueue";
import { EmailData } from "../app/services/mails/emailService";
import { LoggerUtils } from "@utils/index";

const email = new Hono();

email.post("/send", async (c) => {
	try {
		const body = await c.req.json();
		const { to, subject, text, html } = body;

		if (!to || !subject) {
			return c.json({ error: "Missing required fields: to, subject" }, 400);
		}

		const emailData: EmailData = { to, subject, text, html };
		const job = await emailQueue.add("send-email", emailData);

		return c.json({
			message: "Email queued successfully",
			jobId: job.id,
		});
	} catch (error) {
		LoggerUtils.error("Error queuing email:", error);
		return c.json({ error: "Failed to queue email" }, 500);
	}
});

email.get("/status/:jobId", async (c) => {
	try {
		const jobId = c.req.param("jobId");
		const job = await emailQueue.getJob(jobId);

		if (!job) {
			return c.json({ error: "Job not found" }, 404);
		}

		return c.json({
			id: job.id,
			data: job.data,
			progress: job.progress(),
			state: await job.getState(),
			createdAt: job.timestamp,
			processedAt: job.processedOn,
			finishedAt: job.finishedOn,
			failedReason: job.failedReason,
		});
	} catch (error) {
		LoggerUtils.error("Error getting job status:", error);
		return c.json({ error: "Failed to get job status" }, 500);
	}
});

email.get("/stats", async (c) => {
	try {
		const waiting = await emailQueue.getWaiting();
		const active = await emailQueue.getActive();
		const completed = await emailQueue.getCompleted();
		const failed = await emailQueue.getFailed();

		return c.json({
			waiting: waiting.length,
			active: active.length,
			completed: completed.length,
			failed: failed.length,
		});
	} catch (error) {
		LoggerUtils.error("Error getting queue stats:", error);
		return c.json({ error: "Failed to get queue stats" }, 500);
	}
});

export default email;
