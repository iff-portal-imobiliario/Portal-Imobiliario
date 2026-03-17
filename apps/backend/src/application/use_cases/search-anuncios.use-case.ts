import { SearchAnunciosInput } from "../dtos/search-anuncios.dto";
import { Anuncio } from "../../domain/entities/Anuncio";
import { AnuncioRepository } from "../../domain/repositories/anuncio-repository";

export class SearchAnunciosUseCase {
  constructor(private readonly anuncioRepository: AnuncioRepository) {}

  async execute(input: SearchAnunciosInput): Promise<Anuncio[]> {
    return this.anuncioRepository.findByFilters({
      precoMin: input.precoMin,
      precoMax: input.precoMax,
      bairro: input.bairro,
      quartos: input.quartos
    });
  }
}
