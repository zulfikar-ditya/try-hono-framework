import { prisma } from "@repositories/index";
import { HashUtils } from "@utils/index";

export async function seedUsers() {
	const users = [
		{
			email: "admin@example.com",
			name: "Admin User",
			password: "Password123!",
		},
		{
			email: "john.doe@example.com",
			name: "John Doe",
			password: "Password123!",
		},
		{
			email: "jane.smith@example.com",
			name: "Jane Smith",
			password: "Password123!",
		},
	];

	for (const user of users) {
		const hashedPassword = await HashUtils.generateHash(user.password);

		await prisma.user.upsert({
			where: { email: user.email },
			update: {},
			create: {
				email: user.email,
				name: user.name,
				password: hashedPassword,
			},
		});
	}

	console.log("Users seeded successfully");
}
