import { Prisma } from "@prisma/client";
import { prisma } from ".";
import { accessTokenLifetime, DateUtils, StrUtils } from "@utils/index";

export function AccessTokenRepository(tx?: Prisma.TransactionClient) {
	const db = tx || prisma;

	return {
		accessToken: db.accessToken,

		createToken: async (userId: string, remember: boolean = false) => {
			return await db.accessToken.create({
				data: {
					userId,
					token: StrUtils.random(100),
					expiresAt: remember ? accessTokenLifetime : null,
				},
			});
		},

		findByToken: async (
			token: string,
		): Promise<{
			id: string;
			userId: string;
			expiresAt: Date | null;
		} | null> => {
			return await db.accessToken.findFirst({
				where: {
					token,
				},
				select: {
					id: true,
					userId: true,
					expiresAt: true,
				},
			});
		},

		updateLastUsed: async (token: string) => {
			return await db.accessToken.updateMany({
				where: {
					token,
				},
				data: {
					lastUsedAt: DateUtils.now().toDate(),
				},
			});
		},
	};
}
