import { Prisma } from "@prisma/client";
import { EmailVerificationRepository } from "@repositories/email-verification.repository";
import {
	AccessTokenRepository,
	prisma,
	UserRepository,
} from "@repositories/index";
import { DateUtils, EncryptionUtils, HashUtils } from "@utils/index";
import { HTTPException } from "hono/http-exception";
import { sendEmailVerification } from "src/app/emails";

export class AuthService {
	async login(
		email: string,
		password: string,
	): Promise<{
		token: string;
		user: {
			id: string;
			email: string;
			name: string | null;
		};
	}> {
		const data = await prisma.$transaction(
			async (tx: Prisma.TransactionClient) => {
				const user = await UserRepository(tx).findByEmail(email);
				if (!user) {
					throw new HTTPException(422, {
						message: "Invalid email or password",
						cause: {
							email: ["Invalid email or password"],
						},
					});
				}

				const isPasswordValid = await HashUtils.compareHash(
					password,
					user.password,
				);
				if (isPasswordValid === false) {
					throw new HTTPException(422, {
						message: "Invalid email or password",
						cause: {
							password: ["Invalid email or password"],
						},
					});
				}

				const accessToken = await AccessTokenRepository(tx).createToken(
					user.id,
					false,
				);

				const HashToken = EncryptionUtils.encrypt(accessToken.token);

				return {
					id: user.id,
					email: user.email,
					name: user.name,
					accessToken: HashToken,
				};
			},
		);

		return {
			token: data.accessToken,
			user: {
				id: data.id,
				email: data.email,
				name: data.name,
			},
		};
	}

	async signUp(
		email: string,
		password: string,
		name?: string | null,
	): Promise<void> {
		await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
			const user = await UserRepository(tx).create({
				email,
				password,
				name,
			});

			const EmailVerification = await EmailVerificationRepository(
				tx,
			).createVerification(user.id);
			const HashToken = EncryptionUtils.encrypt(EmailVerification.token);

			sendEmailVerification(email, HashToken);
		});
	}

	async verifyEmail(token: string): Promise<void> {
		const decryptedToken = EncryptionUtils.decrypt(token);
		const emailVerification =
			await EmailVerificationRepository(prisma).findByToken(decryptedToken);

		if (!emailVerification) {
			throw new HTTPException(422, {
				message: "Email verification not found",
				cause: {
					token: ["Invalid or expired token"],
				},
			});
		}

		if (
			emailVerification.expiresAt &&
			DateUtils.isBefore(
				DateUtils.parse(emailVerification.expiresAt.toDateString()),
				DateUtils.now(),
			)
		) {
			throw new HTTPException(422, {
				message: "Email verification token has expired",
				cause: {
					token: ["Token has expired"],
				},
			});
		}

		await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
			await EmailVerificationRepository(tx).deleteVerification(
				emailVerification.id,
			);
			await UserRepository(tx).markEmailAsVerified(emailVerification.userId);
		});
	}

	async resendEmailVerification(email: string): Promise<void> {
		const user = await UserRepository(prisma).user.findUnique({
			where: { email },
			select: {
				id: true,
				email: true,
				name: true,
				emailVerifiedAt: true,
			},
		});
		if (!user) {
			return;
		}

		if (user.emailVerifiedAt !== null) {
			throw new HTTPException(422, {
				message: "Email is already verified",
				cause: {
					email: ["Email is already verified"],
				},
			});
		}

		const newEmailVerification = await EmailVerificationRepository(
			prisma,
		).createVerification(user.id);
		const HashToken = EncryptionUtils.encrypt(newEmailVerification.token);

		sendEmailVerification(email, HashToken);
	}
}
