import { AuthService } from "src/app/services/auth/auth.service";

declare module "hono" {
	interface ContextVariableMap {
		authService: AuthService;
	}
}
