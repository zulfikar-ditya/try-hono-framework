import { seedUsers } from "./seeds/user.seed";

async function seed() {
	await seedUsers();
}

seed()
	.then(() => {
		console.log("Database seeded successfully");
		process.exit(0);
	})
	.catch((error) => {
		console.error("Error seeding database:", error);
		process.exit(1);
	});
