import { Router } from "express";
import { makeUseCases } from "../factories/use-cases-factory";
import { AnuncioController } from "../../interfaces/controllers/anuncio-controller";
import { AuthController } from "../../interfaces/controllers/auth-controller";
import { requireAuth, requireRole } from "../middlewares/auth-middleware";
import { UserRole } from "../../domain/entities/User";

export const routes = Router();
const useCases = makeUseCases();
const anuncioController = new AnuncioController(
  useCases.createAnuncioUseCase,
  useCases.searchAnunciosUseCase
);
const authController = new AuthController(
  useCases.registerUserUseCase,
  useCases.loginUserUseCase,
  useCases.getMeUseCase
);

const authRequired = requireAuth(useCases.tokenService);
type RequestWithAuth = {
  authUser: {
    sub: string;
    role: UserRole;
  };
};

const getErrorMessage = (error: unknown): string => String((error as { message?: string }).message);

routes.get("/health", (_req, res) => {
  res.status(200).json({ status: "ok" });
});

routes.post("/auth/register", async (req, res) => {
  try {
    return await authController.register(req, res);
  } catch (error) {
    return res.status(400).json({ message: getErrorMessage(error) });
  }
});

routes.post("/auth/login", async (req, res) => {
  try {
    return await authController.login(req, res);
  } catch (error) {
    return res.status(401).json({ message: getErrorMessage(error) });
  }
});

routes.get("/auth/me", authRequired, async (req, res) => {
  try {
    return await authController.me(req, res);
  } catch (error) {
    return res.status(400).json({ message: getErrorMessage(error) });
  }
});

routes.post("/anuncios", authRequired, requireRole(["ROLE_CORRETOR", "ROLE_ADMIN"]), async (req, res) => {
  try {
    const authUser = (req as typeof req & RequestWithAuth).authUser;
    req.body.role = authUser.role;
    req.body.corretorId = authUser.sub;
    return await anuncioController.create(req, res);
  } catch (error) {
    return res.status(400).json({ message: getErrorMessage(error) });
  }
});

routes.get("/anuncios", async (req, res) => {
  return anuncioController.search(req, res);
});

routes.post("/anuncios/:anuncioId/favoritos", authRequired, requireRole(["ROLE_CLIENTE", "ROLE_ADMIN"]), async (req, res) => {
  try {
    const anuncioId = String(req.params.anuncioId);
    const usuarioId = (req as typeof req & RequestWithAuth).authUser.sub;
    await useCases.favoritarAnuncioUseCase.execute(usuarioId, anuncioId);
    return res.status(204).send();
  } catch (error) {
    return res.status(400).json({ message: getErrorMessage(error) });
  }
});

routes.post("/anuncios/:anuncioId/mensagens", authRequired, requireRole(["ROLE_CLIENTE", "ROLE_ADMIN"]), async (req, res) => {
  try {
    const anuncioId = String(req.params.anuncioId);
    const { texto } = req.body as { texto: string };
    const clienteId = (req as typeof req & RequestWithAuth).authUser.sub;
    const mensagem = await useCases.enviarMensagemInteresseUseCase.execute(anuncioId, clienteId, texto);
    return res.status(201).json(mensagem);
  } catch (error) {
    return res.status(400).json({ message: getErrorMessage(error) });
  }
});
