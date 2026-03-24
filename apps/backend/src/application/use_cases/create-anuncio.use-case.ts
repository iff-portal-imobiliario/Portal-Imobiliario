import { randomUUID } from "crypto";
import { CreateAnuncioInput } from "../dtos/create-anuncio.dto";
import { Anuncio } from "../../domain/entities/Anuncio";
import { AnuncioRepository } from "../../domain/repositories/anuncio-repository";

export class CreateAnuncioUseCase {
  constructor(private readonly anuncioRepository: AnuncioRepository) {}

  async execute(input: CreateAnuncioInput): Promise<Anuncio> {
    // Permite fotos ser undefined ou array vazio
    const fotosArray = Array.isArray(input.fotos) ? input.fotos : [];
    const fotos = fotosArray.map((url) => ({ url }));

    const anuncio: Anuncio = {
      id: randomUUID(),
      titulo: input.titulo,
      descricao: input.descricao,
      preco: input.preco,
      bairro: input.bairro,
      quartos: input.quartos,
      corretorId: input.corretorId,
      fotos
    };

    return this.anuncioRepository.create(anuncio);
  }
}
