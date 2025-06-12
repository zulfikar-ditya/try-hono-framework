import { PrismaClient } from "@prisma/client";

export * from "./user.repository";
export * from "./access-token.repository";

export const prisma = new PrismaClient();
