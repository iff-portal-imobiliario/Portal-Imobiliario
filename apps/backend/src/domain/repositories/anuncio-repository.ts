import { Anuncio } from "../entities/anuncio";

export type AnuncioFilters = {
  precoMin?: number;
  precoMax?: number;
  bairro?: string;
  quartos?: number;
};

export interface AnuncioRepository {
  create(anuncio: Anuncio): Promise<Anuncio>;
  findById(id: string): Promise<Anuncio | null>;
  findByFilters(filters: AnuncioFilters): Promise<Anuncio[]>;
}
