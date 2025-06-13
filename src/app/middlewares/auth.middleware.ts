import { AccessTokenRepository } from "@repositories/access-token.repository";
import { prisma, UserRepository } from "@repositories/index";
import { DateUtils, EncryptionUtils } from "@utils/index";
import { Context, Next } from "hono";
import { createMiddleware } from "hono/factory";
import { HTTPException } from "hono/http-exception";

export const authMiddleware = createMiddleware(
	async (c: Context, next: Next) => {
		// Check for Authorization header
		const bearerToken = c.req.header("Authorization")?.replace("Bearer ", "");
		if (!bearerToken) {
			throw new HTTPException(401, {
				message: "Authorization header is missing or invalid",
			});
		}

		// Decrypt the token
		const decryptedToken = EncryptionUtils.decrypt(bearerToken);
		if (!decryptedToken) {
			throw new HTTPException(401, {
				message: "Invalid token",
			});
		}

		const accessTokenData = await prisma.$transaction(async (tx) => {
			// Find the access token in the database then update last used time
			const accessToken =
				await AccessTokenRepository(tx).findByToken(decryptedToken);
			if (!accessToken) {
				throw new HTTPException(401, {
					message: "Access token not found or expired",
				});
			}

			if (
				accessToken.expiresAt &&
				DateUtils.isBefore(
					DateUtils.parse(accessToken.expiresAt.toDateString()),
					DateUtils.now(),
				)
			) {
				throw new HTTPException(401, {
					message: "Access token has expired",
				});
			}

			await AccessTokenRepository(tx).updateLastUsed(decryptedToken);

			return accessToken;
		});

		// Store the access token in the context
		const user = await UserRepository().findByUserId(accessTokenData.userId);
		if (!user) {
			throw new HTTPException(401, {
				message: "User not found",
			});
		}

		c.set("user", user);

		await next();
	},
);
