import { Favorito, FavoritoRepository } from "../../../../domain/repositories/favorito-repository";

export class InMemoryFavoritoRepository implements FavoritoRepository {
  private readonly favoritos: Favorito[] = [];

  async exists(usuarioId: string, anuncioId: string): Promise<boolean> {
    return this.favoritos.some((f) => f.usuarioId === usuarioId && f.anuncioId === anuncioId);
  }

  async add(favorito: Favorito): Promise<void> {
    this.favoritos.push(favorito);
  }

  async listByUsuario(usuarioId: string): Promise<Favorito[]> {
    return this.favoritos.filter((f) => f.usuarioId === usuarioId);
  }
}
