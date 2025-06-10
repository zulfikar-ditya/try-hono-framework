To install dependencies:

```sh
bun install
```

To run:

```sh
bun run dev
```

open http://localhost:3000

```bash
src/
  index.ts              # Main app entry point
  app.ts               # App configuration and setup
  config/
    database.ts        # Database configuration
    env.ts            # Environment variables
  routes/
    index.ts          # Route registration
    auth.ts           # Authentication routes
    users.ts          # User-related routes
    health.ts         # Health check routes
  controllers/
    authController.ts
    userController.ts
    healthController.ts
  middleware/
    auth.ts           # Authentication middleware
    cors.ts           # CORS middleware
    logger.ts         # Logging middleware
  services/
    userService.ts    # Business logic
    authService.ts
  types/
    index.ts          # Type definitions
  utils/
    validation.ts     # Input validation helpers
    response.ts       # Response helpers
```
