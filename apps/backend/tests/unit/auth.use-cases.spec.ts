import { describe, expect, it } from "vitest";
import { InMemoryUserRepository } from "../../src/infrastructure/database/repositories/in-memory-user-repository";
import { PasswordHasher } from "../../src/infrastructure/security/password-hasher";
import { TokenService } from "../../src/infrastructure/security/token-service";
import { RegisterUserUseCase } from "../../src/application/use_cases/register-user.use-case";
import { LoginUserUseCase } from "../../src/application/use_cases/login-user.use-case";
import { GetMeUseCase } from "../../src/application/use_cases/get-me.use-case";

describe("Auth use cases and security", () => {
  it("deve registrar usuario, autenticar e carregar perfil", async () => {
    const userRepository = new InMemoryUserRepository();
    const passwordHasher = new PasswordHasher();
    const tokenService = new TokenService("test-secret");

    const registerUserUseCase = new RegisterUserUseCase(userRepository, passwordHasher);
    const loginUserUseCase = new LoginUserUseCase(userRepository, passwordHasher, tokenService);
    const getMeUseCase = new GetMeUseCase(userRepository);

    const user = await registerUserUseCase.execute({
      name: "Maria",
      email: "maria@mail.com",
      password: "123456",
      role: "ROLE_CLIENTE"
    });

    expect("passwordHash" in user).toBe(false);

    const login = await loginUserUseCase.execute({
      email: "maria@mail.com",
      password: "123456"
    });

    const payload = tokenService.verify(login.accessToken);
    expect(payload).not.toBeNull();

    const me = await getMeUseCase.execute(user.id);
    expect(me.email).toBe("maria@mail.com");
  });

  it("deve validar erros de auth", async () => {
    const userRepository = new InMemoryUserRepository();
    const passwordHasher = new PasswordHasher();
    const tokenService = new TokenService("test-secret");

    const registerUserUseCase = new RegisterUserUseCase(userRepository, passwordHasher);
    const loginUserUseCase = new LoginUserUseCase(userRepository, passwordHasher, tokenService);
    const getMeUseCase = new GetMeUseCase(userRepository);

    await registerUserUseCase.execute({
      name: "Joao",
      email: "joao@mail.com",
      password: "123456",
      role: "ROLE_CORRETOR"
    });

    await expect(
      registerUserUseCase.execute({
        name: "Joao 2",
        email: "joao@mail.com",
        password: "123456",
        role: "ROLE_CORRETOR"
      })
    ).rejects.toThrow("Email ja cadastrado");

    await expect(
      registerUserUseCase.execute({
        name: "Curta",
        email: "curta@mail.com",
        password: "123",
        role: "ROLE_CLIENTE"
      })
    ).rejects.toThrow("Senha deve ter ao menos 6 caracteres");

    await expect(
      loginUserUseCase.execute({
        email: "naoexiste@mail.com",
        password: "123456"
      })
    ).rejects.toThrow("Credenciais invalidas");

    await expect(
      loginUserUseCase.execute({
        email: "joao@mail.com",
        password: "senha-errada"
      })
    ).rejects.toThrow("Credenciais invalidas");

    await expect(getMeUseCase.execute("inexistente")).rejects.toThrow("Usuario nao encontrado");
  });

  it("deve cobrir hash e validacoes de token", () => {
    const passwordHasher = new PasswordHasher();
    const tokenService = new TokenService("secret");

    const hashed = passwordHasher.hash("123456");
    expect(passwordHasher.verify("123456", hashed)).toBe(true);
    expect(passwordHasher.verify("654321", hashed)).toBe(false);
    expect(passwordHasher.verify("123456", "hash-invalido")).toBe(false);

    const validToken = tokenService.sign({ sub: "user-1", role: "ROLE_ADMIN" });
    expect(tokenService.verify(validToken)).toEqual({ sub: "user-1", role: "ROLE_ADMIN" });

    expect(tokenService.verify("sem-ponto")).toBeNull();
    expect(tokenService.verify("aaa.bbb")).toBeNull();

    const payloadWithoutRole = Buffer.from(JSON.stringify({ sub: "x" })).toString("base64url");
    const signatureWithoutRole = require("crypto")
      .createHmac("sha256", "secret")
      .update(payloadWithoutRole)
      .digest("base64url");
    expect(tokenService.verify(`${payloadWithoutRole}.${signatureWithoutRole}`)).toBeNull();

    const invalidJsonPayload = Buffer.from("not-json").toString("base64url");
    const invalidJsonSignature = require("crypto")
      .createHmac("sha256", "secret")
      .update(invalidJsonPayload)
      .digest("base64url");
    expect(tokenService.verify(`${invalidJsonPayload}.${invalidJsonSignature}`)).toBeNull();
  });
});
