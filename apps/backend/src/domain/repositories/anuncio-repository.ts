import { Anuncio } from "../entities/Anuncio";

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
  update(id: string, anuncio: Partial<Anuncio>): Promise<Anuncio | null>;
  delete(id: string): Promise<void>;
}
