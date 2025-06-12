import { Prisma } from "@prisma/client";
import {
	AccessTokenRepository,
	prisma,
	UserRepository,
} from "@repositories/index";
import { EncryptionUtils, HashUtils } from "@utils/index";
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
}
