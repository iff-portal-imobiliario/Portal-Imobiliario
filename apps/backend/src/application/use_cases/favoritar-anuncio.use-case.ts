import { FavoritoRepository } from "../../domain/repositories/favorito-repository";
import { AnuncioRepository } from "../../domain/repositories/anuncio-repository";

export class FavoritarAnuncioUseCase {
  constructor(
    private readonly anuncioRepository: AnuncioRepository,
    private readonly favoritoRepository: FavoritoRepository
  ) {}

  async execute(usuarioId: string, anuncioId: string): Promise<void> {
    const anuncio = await this.anuncioRepository.findById(anuncioId);
    if (!anuncio) {
      throw new Error("Anuncio nao encontrado");
    }

    const alreadyFavorited = await this.favoritoRepository.exists(usuarioId, anuncioId);
    if (alreadyFavorited) {
      throw new Error("Anuncio ja favoritado");
    }

    await this.favoritoRepository.add({ usuarioId, anuncioId });
  }
}
