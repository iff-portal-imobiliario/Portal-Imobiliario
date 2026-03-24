import request from "supertest";
import { describe, expect, it } from "vitest";
import { createApp } from "../../src/infrastructure/app";
import { TokenService } from "../../src/infrastructure/security/token-service";

const app = createApp();

const uniqueEmail = (prefix: string) => `${prefix}-${Date.now()}-${Math.random()}@mail.com`;

type UserRole = "ROLE_CLIENTE" | "ROLE_CORRETOR" | "ROLE_ADMIN";

const registerAndLogin = async (role: UserRole) => {
  const email = uniqueEmail(role.toLowerCase());
  const password = "123456";

  const registerResponse = await request(app).post("/auth/register").send({
    name: role,
    email,
    password,
    role
  });

  expect(registerResponse.status).toBe(201);

  const loginResponse = await request(app).post("/auth/login").send({
    email,
    password
  });

  expect(loginResponse.status).toBe(200);
  expect(loginResponse.body.accessToken).toBeTypeOf("string");

  return {
    user: registerResponse.body,
    token: loginResponse.body.accessToken as string
  };
};

describe("Auth and Authorization Routes", () => {
  it("deve responder health check", async () => {
    const response = await request(app).get("/health");

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ status: "ok" });
  });

  it("deve cadastrar usuario, bloquear duplicado, bloquear role invalida e senha curta", async () => {
    const email = uniqueEmail("cliente");

    const okResponse = await request(app).post("/auth/register").send({
      name: "Cliente",
      email,
      password: "123456",
      role: "ROLE_CLIENTE"
    });

    expect(okResponse.status).toBe(201);
    expect(okResponse.body).toMatchObject({
      name: "Cliente",
      email,
      role: "ROLE_CLIENTE"
    });
    expect(okResponse.body.passwordHash).toBeUndefined();

    const duplicateResponse = await request(app).post("/auth/register").send({
      name: "Cliente 2",
      email,
      password: "abcdef",
      role: "ROLE_CLIENTE"
    });

    expect(duplicateResponse.status).toBe(400);
    expect(duplicateResponse.body.message).toBe("Email ja cadastrado");

    const invalidRoleResponse = await request(app).post("/auth/register").send({
      name: "X",
      email: uniqueEmail("invalid-role"),
      password: "123456",
      role: "ROLE_NAO_EXISTE"
    });

    expect(invalidRoleResponse.status).toBe(400);
    expect(invalidRoleResponse.body.message).toBe("Role invalida");

    const shortPasswordResponse = await request(app).post("/auth/register").send({
      name: "X",
      email: uniqueEmail("short-pass"),
      password: "123",
      role: "ROLE_CLIENTE"
    });

    expect(shortPasswordResponse.status).toBe(400);
    expect(shortPasswordResponse.body.message).toBe("Senha deve ter ao menos 6 caracteres");
  });

  it("deve autenticar com login e negar credenciais invalidas", async () => {
    const email = uniqueEmail("login");

    await request(app).post("/auth/register").send({
      name: "Usuario",
      email,
      password: "123456",
      role: "ROLE_CLIENTE"
    });

    const okLogin = await request(app).post("/auth/login").send({
      email,
      password: "123456"
    });

    expect(okLogin.status).toBe(200);
    expect(okLogin.body.accessToken).toBeTypeOf("string");

    const wrongPassword = await request(app).post("/auth/login").send({
      email,
      password: "senha-errada"
    });

    expect(wrongPassword.status).toBe(401);
    expect(wrongPassword.body.message).toBe("Credenciais invalidas");

    const unknownUser = await request(app).post("/auth/login").send({
      email: uniqueEmail("unknown"),
      password: "123456"
    });

    expect(unknownUser.status).toBe(401);
    expect(unknownUser.body.message).toBe("Credenciais invalidas");
  });

  it("deve proteger rota /auth/me com token e retornar usuario autenticado", async () => {
    const { user, token } = await registerAndLogin("ROLE_CLIENTE");

    const missingHeader = await request(app).get("/auth/me");
    expect(missingHeader.status).toBe(401);
    expect(missingHeader.body.message).toBe("Nao autenticado");

    const invalidScheme = await request(app)
      .get("/auth/me")
      .set("Authorization", "Basic abc");
    expect(invalidScheme.status).toBe(401);
    expect(invalidScheme.body.message).toBe("Token invalido");

    const invalidToken = await request(app)
      .get("/auth/me")
      .set("Authorization", "Bearer token-invalido");
    expect(invalidToken.status).toBe(401);
    expect(invalidToken.body.message).toBe("Token invalido");

    const ok = await request(app)
      .get("/auth/me")
      .set("Authorization", `Bearer ${token}`);

    expect(ok.status).toBe(200);
    expect(ok.body).toMatchObject({
      id: user.id,
      email: user.email,
      role: "ROLE_CLIENTE"
    });
  });

  it("deve bloquear /auth/me para usuario inexistente mesmo com token valido", async () => {
    const tokenService = new TokenService("dev-secret");
    const token = tokenService.sign({ sub: "id-que-nao-existe", role: "ROLE_CLIENTE" });

    const response = await request(app)
      .get("/auth/me")
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Usuario nao encontrado");
  });

  it("deve permitir corretor criar anuncio e impedir cliente", async () => {
    const { token: clientToken } = await registerAndLogin("ROLE_CLIENTE");
    const { user: brokerUser, token: brokerToken } = await registerAndLogin("ROLE_CORRETOR");

    const forbidden = await request(app)
      .post("/anuncios")
      .set("Authorization", `Bearer ${clientToken}`)
      .send({
        titulo: "Apto",
        descricao: "Desc",
        preco: 100000,
        bairro: "Centro",
        quartos: 2,
        fotos: ["a.jpg"],
        corretorId: "falso",
        role: "ROLE_CLIENTE"
      });

    expect(forbidden.status).toBe(403);
    expect(forbidden.body.message).toBe("Sem permissao");

    const noAuth = await request(app).post("/anuncios").send({
      titulo: "Apto",
      descricao: "Desc",
      preco: 100000,
      bairro: "Centro",
      quartos: 2,
      fotos: ["a.jpg"]
    });

    expect(noAuth.status).toBe(401);
    expect(noAuth.body.message).toBe("Nao autenticado");

    const created = await request(app)
      .post("/anuncios")
      .set("Authorization", `Bearer ${brokerToken}`)
      .send({
        titulo: "Apto Correto",
        descricao: "Desc",
        preco: 150000,
        bairro: "Centro",
        quartos: 2,
        fotos: ["x.jpg"],
        corretorId: "forjado",
        role: "ROLE_CLIENTE"
      });

    expect(created.status).toBe(201);
    expect(created.body.corretorId).toBe(brokerUser.id);

    const malformed = await request(app)
      .post("/anuncios")
      .set("Authorization", `Bearer ${brokerToken}`)
      .send({
        titulo: "Apto Quebrado",
        descricao: "Sem fotos",
        preco: 150000,
        bairro: "Centro",
        quartos: 2
      });

    expect(malformed.status).toBe(400);

    const list = await request(app).get("/anuncios");
    expect(list.status).toBe(200);
    expect(Array.isArray(list.body)).toBe(true);

    const filtered = await request(app).get("/anuncios").query({
      precoMin: 140000,
      precoMax: 200000,
      bairro: "Centro",
      quartos: 2
    });

    expect(filtered.status).toBe(200);
    expect(filtered.body.length).toBeGreaterThanOrEqual(1);
  });

  it("deve permitir cliente favoritar e enviar mensagem, com bloqueios de permissao e duplicidade", async () => {
    const { token: adminToken } = await registerAndLogin("ROLE_ADMIN");
    const { token: clientToken, user: clientUser } = await registerAndLogin("ROLE_CLIENTE");
    const { token: brokerToken } = await registerAndLogin("ROLE_CORRETOR");

    const created = await request(app)
      .post("/anuncios")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        titulo: "Casa",
        descricao: "Com quintal",
        preco: 200000,
        bairro: "Jardim",
        quartos: 3,
        fotos: ["casa.jpg"]
      });

    expect(created.status).toBe(201);
    const anuncioId = created.body.id as string;

    const forbiddenFavorite = await request(app)
      .post(`/anuncios/${anuncioId}/favoritos`)
      .set("Authorization", `Bearer ${brokerToken}`)
      .send({});

    expect(forbiddenFavorite.status).toBe(403);

    const favorite = await request(app)
      .post(`/anuncios/${anuncioId}/favoritos`)
      .set("Authorization", `Bearer ${clientToken}`)
      .send({ usuarioId: "forjado" });

    expect(favorite.status).toBe(204);

    const duplicateFavorite = await request(app)
      .post(`/anuncios/${anuncioId}/favoritos`)
      .set("Authorization", `Bearer ${clientToken}`)
      .send({});

    expect(duplicateFavorite.status).toBe(400);
    expect(duplicateFavorite.body.message).toBe("Anuncio ja favoritado");

    const message = await request(app)
      .post(`/anuncios/${anuncioId}/mensagens`)
      .set("Authorization", `Bearer ${clientToken}`)
      .send({ texto: "Tenho interesse" });

    expect(message.status).toBe(201);
    expect(message.body.anuncioId).toBe(anuncioId);
    expect(message.body.clienteId).toBe(clientUser.id);

    const notFoundMessage = await request(app)
      .post("/anuncios/id-inexistente/mensagens")
      .set("Authorization", `Bearer ${clientToken}`)
      .send({ texto: "Oi" });

    expect(notFoundMessage.status).toBe(400);
    expect(notFoundMessage.body.message).toBe("Anuncio nao encontrado");
  });
});
