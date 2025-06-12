import { PrismaClient } from "@prisma/client";

export * from "./user.repository";

export const prisma = new PrismaClient();
