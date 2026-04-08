import { Router } from "express";
import { makeUseCases } from "../factories/use-cases-factory";
import { AnuncioController } from "../../interfaces/controllers/anuncio-controller";

export const routes = Router();
export const useCases = makeUseCases();
const anuncioController = new AnuncioController(
  useCases.createAnuncioUseCase,
  useCases.searchAnunciosUseCase
);

const getErrorMessage = (error: unknown): string => {
  if (error instanceof Error) return error.message;
  return "Erro interno";
};

routes.get("/health", (_req, res) => {
  res.status(200).json({ status: "ok" });
});

routes.post("/anuncios", async (req, res) => {
  try {
    return await anuncioController.create(req, res);
  } catch (error) {
    return res.status(400).json({ message: getErrorMessage(error) });
  }
});

routes.get("/anuncios", async (req, res) => {
  try {
    return await anuncioController.search(req, res);
  } catch (error) {
    return res.status(400).json({ message: getErrorMessage(error) });
  }
});

routes.get("/anuncios/:anuncioId", async (req, res) => {
  try {
    const { anuncioId } = req.params;
    const anuncio = await useCases.anuncioRepository.findById(anuncioId);
    if (!anuncio) {
      return res.status(404).json({ message: "Anuncio nao encontrado" });
    }
    return res.status(200).json(anuncio);
  } catch (error) {
    return res.status(400).json({ message: getErrorMessage(error) });
  }
});

routes.put("/anuncios/:anuncioId", async (req, res) => {
  try {
    const { anuncioId } = req.params;
    const updated = await useCases.anuncioRepository.update(anuncioId, req.body);
    if (!updated) {
       return res.status(404).json({ message: "Anúncio não encontrado" });
    }
    return res.status(200).json(updated);
  } catch (error) {
    return res.status(400).json({ message: getErrorMessage(error) });
  }
});

routes.delete("/anuncios/:anuncioId", async (req, res) => {
  try {
    const { anuncioId } = req.params;
    await useCases.anuncioRepository.delete(anuncioId);
    return res.status(204).send();
  } catch (error) {
    return res.status(400).json({ message: getErrorMessage(error) });
  }
});

routes.post("/anuncios/:anuncioId/favoritos", async (req, res) => {
  try {
    const { anuncioId } = req.params;
    const { usuarioId } = req.body as { usuarioId: string };
    await useCases.favoritarAnuncioUseCase.execute(usuarioId, anuncioId);
    return res.status(204).send();
  } catch (error) {
    return res.status(400).json({ message: getErrorMessage(error) });
  }
});

routes.post("/anuncios/:anuncioId/mensagens", async (req, res) => {
  try {
    const { anuncioId } = req.params;
    const { clienteId, texto } = req.body as { clienteId: string; texto: string };
    const mensagem = await useCases.enviarMensagemInteresseUseCase.execute(anuncioId, clienteId, texto);
    return res.status(201).json(mensagem);
  } catch (error) {
    return res.status(400).json({ message: getErrorMessage(error) });
  }
});

