import { CreateAnuncioUseCase } from "../../application/use_cases/create-anuncio.use-case";
import { EnviarMensagemInteresseUseCase } from "../../application/use_cases/enviar-mensagem-interesse.use-case";
import { FavoritarAnuncioUseCase } from "../../application/use_cases/favoritar-anuncio.use-case";
import { GetMeUseCase } from "../../application/use_cases/get-me.use-case";
import { LoginUserUseCase } from "../../application/use_cases/login-user.use-case";
import { RegisterUserUseCase } from "../../application/use_cases/register-user.use-case";
import { SearchAnunciosUseCase } from "../../application/use_cases/search-anuncios.use-case";
import { InMemoryAnuncioRepository } from "../database/repositories/in-memory-anuncio-repository";
import { InMemoryFavoritoRepository } from "../database/repositories/in-memory-favorito-repository";
import { InMemoryMensagemRepository } from "../database/repositories/in-memory-mensagem-repository";
import { InMemoryUserRepository } from "../database/repositories/in-memory-user-repository";
import { PasswordHasher } from "../security/password-hasher";
import { TokenService } from "../security/token-service";

export const makeUseCases = () => {
  const anuncioRepository = new InMemoryAnuncioRepository();
  const favoritoRepository = new InMemoryFavoritoRepository();
  const mensagemRepository = new InMemoryMensagemRepository();
  const userRepository = new InMemoryUserRepository();
  const passwordHasher = new PasswordHasher();
  const tokenService = new TokenService(process.env.AUTH_SECRET ?? "dev-secret");

  return {
    anuncioRepository,
    favoritoRepository,
    mensagemRepository,
    userRepository,
    tokenService,
    createAnuncioUseCase: new CreateAnuncioUseCase(anuncioRepository),
    searchAnunciosUseCase: new SearchAnunciosUseCase(anuncioRepository),
    favoritarAnuncioUseCase: new FavoritarAnuncioUseCase(anuncioRepository, favoritoRepository),
    enviarMensagemInteresseUseCase: new EnviarMensagemInteresseUseCase(anuncioRepository, mensagemRepository),
    registerUserUseCase: new RegisterUserUseCase(userRepository, passwordHasher),
    loginUserUseCase: new LoginUserUseCase(userRepository, passwordHasher, tokenService),
    getMeUseCase: new GetMeUseCase(userRepository)
  };
};
