import { Anuncio } from "../../../domain/entities/Anuncio";
import { AnuncioFilters, AnuncioRepository } from "../../../domain/repositories/anuncio-repository";

export class InMemoryAnuncioRepository implements AnuncioRepository {
  private readonly anuncios: Anuncio[] = [];

  async create(anuncio: Anuncio): Promise<Anuncio> {
    this.anuncios.push(anuncio);
    return anuncio;
  }

  async findById(id: string): Promise<Anuncio | null> {
    return this.anuncios.find((anuncio) => anuncio.id === id) ?? null;
  }

  async findByFilters(filters: AnuncioFilters): Promise<Anuncio[]> {
    return this.anuncios.filter((anuncio) => {
      if (filters.precoMin !== undefined && anuncio.preco < filters.precoMin) return false;
      if (filters.precoMax !== undefined && anuncio.preco > filters.precoMax) return false;
      if (filters.bairro !== undefined && !anuncio.bairro.toLowerCase().includes(filters.bairro.toLowerCase())) return false;
      if (filters.quartos !== undefined && anuncio.quartos !== filters.quartos) return false;
      return true;
    });
  }

  async update(id: string, partial: Partial<Anuncio>): Promise<Anuncio | null> {
    const index = this.anuncios.findIndex((a) => a.id === id);
    if (index === -1) return null;
    this.anuncios[index] = { ...this.anuncios[index], ...partial };
    return this.anuncios[index];
  }

  async delete(id: string): Promise<void> {
    const index = this.anuncios.findIndex((a) => a.id === id);
    if (index !== -1) this.anuncios.splice(index, 1);
  }
}
