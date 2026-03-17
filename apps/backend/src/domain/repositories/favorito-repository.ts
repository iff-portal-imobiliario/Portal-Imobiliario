export type Favorito = {
  usuarioId: string;
  anuncioId: string;
};

export interface FavoritoRepository {
  exists(usuarioId: string, anuncioId: string): Promise<boolean>;
  add(favorito: Favorito): Promise<void>;
  listByUsuario(usuarioId: string): Promise<Favorito[]>;
}
