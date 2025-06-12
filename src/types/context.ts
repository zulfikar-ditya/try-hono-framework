import { AuthService } from "@services/auth/auth.service";

declare module "hono" {
	interface ContextVariableMap {
		authService: AuthService;
	}
}
