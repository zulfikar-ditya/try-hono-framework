import { PrismaClient } from "@prisma/client";

export * from "./access-token.repository";
export * from "./user.repository";
export * from "./email-verification.repository";

export const prisma = new PrismaClient();
