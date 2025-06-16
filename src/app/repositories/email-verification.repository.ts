import { StrUtils, verificationTokenLifetime } from "@utils/index";
import { prisma } from ".";
import { Prisma } from "@prisma/client";

export function EmailVerificationRepository(tx?: Prisma.TransactionClient) {
	const db = tx || prisma;

	return {
		emailVerification: db.emailVerification,

		createVerification: async (userId: string) => {
			return await db.emailVerification.create({
				data: {
					userId,
					token: StrUtils.random(100),
					expiresAt: verificationTokenLifetime,
				},
			});
		},

		findByToken: async (
			token: string,
		): Promise<{
			id: string;
			userId: string;
			token: string;
			expiresAt: Date | null;
		} | null> => {
			return await db.emailVerification.findFirst({
				where: {
					token,
				},
				select: {
					id: true,
					userId: true,
					token: true,
					expiresAt: true,
				},
			});
		},

		deleteVerification: async (id: string) => {
			return await db.emailVerification.delete({
				where: { id },
			});
		},
	};
}
