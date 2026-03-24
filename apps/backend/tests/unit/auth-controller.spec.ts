import { describe, expect, it, vi } from "vitest";
import { AuthController } from "../../src/interfaces/controllers/auth-controller";

const createResponse = () => {
  const res = {
    status: vi.fn().mockReturnThis(),
    json: vi.fn().mockReturnThis()
  };

  return res;
};

describe("AuthController", () => {
  it("deve rejeitar role invalida no cadastro", async () => {
    const controller = new AuthController(
      { execute: vi.fn() } as never,
      { execute: vi.fn() } as never,
      { execute: vi.fn() } as never
    );

    const req = {
      body: {
        name: "Teste",
        email: "teste@mail.com",
        password: "123456",
        role: "ROLE_X"
      }
    };

    await expect(controller.register(req as never, createResponse() as never)).rejects.toThrow(
      "Role invalida"
    );
  });

  it("deve falhar ao buscar /me sem usuario autenticado", async () => {
    const controller = new AuthController(
      { execute: vi.fn() } as never,
      { execute: vi.fn() } as never,
      { execute: vi.fn() } as never
    );

    await expect(controller.me({} as never, createResponse() as never)).rejects.toThrow(
      "Nao autenticado"
    );
  });
});
