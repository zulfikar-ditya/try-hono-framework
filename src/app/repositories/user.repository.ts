import { Prisma } from "@prisma/client";
import { prisma } from ".";
import { UserInformation } from "@appTypes/repositories";
import { DateUtils, HashUtils } from "@utils/index";
import { HTTPException } from "hono/http-exception";

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

		create: async (
			data: Prisma.UserCreateInput,
		): Promise<{
			id: string;
			email: string;
			name: string | null;
			createdAt: Date;
			updatedAt: Date;
		}> => {
			const isPasswordHashed = await HashUtils.isHashValid(data.password);
			if (!isPasswordHashed) {
				data.password = await HashUtils.generateHash(data.password);
			}

			const isTheEmailExists = await db.user.findUnique({
				where: { email: data.email },
				select: { email: true },
			});
			if (isTheEmailExists) {
				throw new HTTPException(422, {
					message: "Email already exists",
					cause: {
						email: ["Email already exists"],
					},
				});
			}

			return await db.user.create({
				data,
				select: {
					id: true,
					email: true,
					name: true,
					createdAt: true,
					updatedAt: true,
				},
			});
		},

		markEmailAsVerified: async (
			userId: string,
		): Promise<{
			id: string;
			email: string;
			name: string | null;
			createdAt: Date;
			updatedAt: Date;
		}> => {
			return await db.user.update({
				where: { id: userId },
				data: {
					emailVerifiedAt: DateUtils.now().toDate(),
				},
				select: {
					id: true,
					email: true,
					name: true,
					createdAt: true,
					updatedAt: true,
				},
			});
		},

		findByEmailOrThrow: async (
			email: string,
		): Promise<{
			id: string;
			email: string;
			name: string | null;
			password: string;
		}> => {
			const user = await db.user.findUnique({
				where: { email },
				select: {
					id: true,
					email: true,
					name: true,
					password: true,
				},
			});

			if (!user) {
				throw new HTTPException(404, {
					message: "User not found",
					cause: {
						email: ["User not found"],
					},
				});
			}

			return user;
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
