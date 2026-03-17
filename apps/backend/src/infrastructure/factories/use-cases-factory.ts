import { CreateAnuncioUseCase } from "../../application/use_cases/create-anuncio.use-case";
import { EnviarMensagemInteresseUseCase } from "../../application/use_cases/enviar-mensagem-interesse.use-case";
import { FavoritarAnuncioUseCase } from "../../application/use_cases/favoritar-anuncio.use-case";
import { SearchAnunciosUseCase } from "../../application/use_cases/search-anuncios.use-case";
import { InMemoryAnuncioRepository } from "../database/repositories/in-memory-anuncio-repository";
import { InMemoryFavoritoRepository } from "../database/repositories/in-memory-favorito-repository";
import { InMemoryMensagemRepository } from "../database/repositories/in-memory-mensagem-repository";

export const makeUseCases = () => {
  const anuncioRepository = new InMemoryAnuncioRepository();
  const favoritoRepository = new InMemoryFavoritoRepository();
  const mensagemRepository = new InMemoryMensagemRepository();

  return {
    anuncioRepository,
    favoritoRepository,
    mensagemRepository,
    createAnuncioUseCase: new CreateAnuncioUseCase(anuncioRepository),
    searchAnunciosUseCase: new SearchAnunciosUseCase(anuncioRepository),
    favoritarAnuncioUseCase: new FavoritarAnuncioUseCase(anuncioRepository, favoritoRepository),
    enviarMensagemInteresseUseCase: new EnviarMensagemInteresseUseCase(anuncioRepository, mensagemRepository)
  };
};
