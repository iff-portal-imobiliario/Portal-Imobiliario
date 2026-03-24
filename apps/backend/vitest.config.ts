import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    include: ["tests/**/*.spec.ts"],
    coverage: {
      provider: "v8",
      reporter: ["text", "html"],
      include: [
        "src/application/use_cases/enviar-mensagem-interesse.use-case.ts",
        "src/application/use_cases/favoritar-anuncio.use-case.ts",
        "src/application/use_cases/get-me.use-case.ts",
        "src/application/use_cases/login-user.use-case.ts",
        "src/application/use_cases/register-user.use-case.ts",
        "src/application/use_cases/search-anuncios.use-case.ts",
        "src/infrastructure/app.ts",
        "src/infrastructure/api/routes.ts",
        "src/infrastructure/database/repositories/in-memory-anuncio-repository.ts",
        "src/infrastructure/database/repositories/in-memory-favorito-repository.ts",
        "src/infrastructure/database/repositories/in-memory-mensagem-repository.ts",
        "src/infrastructure/database/repositories/in-memory-user-repository.ts",
        "src/infrastructure/factories/use-cases-factory.ts",
        "src/infrastructure/middlewares/auth-middleware.ts",
        "src/infrastructure/security/password-hasher.ts",
        "src/infrastructure/security/token-service.ts",
        "src/interfaces/controllers/anuncio-controller.ts",
        "src/interfaces/controllers/auth-controller.ts"
      ],
      exclude: [
        "src/infrastructure/main.ts",
        "src/application/use_cases/create-anuncio.use-case.ts",
        "**/src/application/use_cases/create-anuncio.use-case.ts"
      ],
      thresholds: {
        lines: 100,
        functions: 100,
        statements: 100,
        branches: 100
      }
    }
  }
});
