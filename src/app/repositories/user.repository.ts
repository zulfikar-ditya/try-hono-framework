import { Prisma } from "@prisma/client";
import { prisma } from ".";
import { UserInformation } from "@appTypes/repositories";

export function UserRepository(tx?: Prisma.TransactionClient) {
	const db = tx || prisma;

	return {
		user: db.user,

		findByEmail: async (
			email: string,
		): Promise<{
			id: string;
			email: string;
			name: string | null;
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

		findByUserId: async (userId: string): Promise<UserInformation | null> => {
			return await db.user.findUnique({
				where: { id: userId },
				select: {
					id: true,
					email: true,
					name: true,
					createdAt: true,
					updatedAt: true,
				},
			});
		},
	};
}
