import { seedUsers } from "./seeds/user.seed";

async function seed() {
	await seedUsers();
}

seed()
	.then(() => {
		// eslint-disable-next-line
		console.log("Database seeded successfully");
		process.exit(0);
	})
	.catch((error) => {
		// eslint-disable-next-line
		console.error("Error seeding database:", error);
		process.exit(1);
	});
