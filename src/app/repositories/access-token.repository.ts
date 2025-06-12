import { Prisma } from "@prisma/client";
import { prisma } from ".";
import { accessTokenLifetime, StrUtils } from "@utils/index";

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
	};
}
