import * as bcrypt from "bcryptjs";

export class HashUtils {
	static async generateHash(value: string): Promise<string> {
		const saltRounds = 10;
		return await bcrypt.hash(value, saltRounds);
	}

	static async compareHash(value: string, hash: string): Promise<boolean> {
		return await bcrypt.compare(value, hash);
	}

	static async isHashValid(hash: string): Promise<boolean> {
		try {
			const isValid = (await bcrypt.getRounds(hash)) > 0;
			return isValid;
		} catch {
			return false;
		}
	}
}
