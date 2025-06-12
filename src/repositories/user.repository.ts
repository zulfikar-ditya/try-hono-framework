import { Prisma } from "@prisma/client";
import { prisma } from ".";

export function UserRepository(tx?: Prisma.TransactionClient) {
	const db = tx || prisma;

	return {
		user: db.user,

		findByEmail: async (
			email: string,
		): Promise<{
			id: string;
			email: string;
			name: string;
			password: string;
		} | null> => {
			return await db.user.findUnique({
				where: { email },
				select: {
					id: true,
					email: true,
					name: true,
					password: true,
				},
			});
		},
	};
}
