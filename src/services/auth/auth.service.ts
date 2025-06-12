import { Prisma } from "@prisma/client";
import { prisma, UserRepository } from "@repositories/index";
import { HTTPException } from "hono/http-exception";

export class AuthService {
	async login(
		email: string,
		password: string,
	): Promise<{
		token: string;
		user: {
			id: string;
			email: string;
			name: string;
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

				if (user.password !== password) {
					throw new HTTPException(422, {
						message: "Invalid email or password",
						cause: {
							password: ["Invalid email or password"],
						},
					});
				}

				return user;
			},
		);

		return {
			token: "generated_token",
			user: {
				id: data.id,
				email: data.email,
				name: data.name,
			},
		};
	}
}
