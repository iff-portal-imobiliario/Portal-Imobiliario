import { randomUUID } from "crypto";
import { CreateAnuncioInput } from "../dtos/create-anuncio.dto";
import { Anuncio } from "../../domain/entities/Anuncio";
import { AnuncioRepository } from "../../domain/repositories/anuncio-repository";

export class CreateAnuncioUseCase {
  constructor(private readonly anuncioRepository: AnuncioRepository) {}

  async execute(input: CreateAnuncioInput): Promise<Anuncio> {
    if (input.role !== "ROLE_CORRETOR") {
      throw new Error("Somente corretor pode criar anuncio");
    }

    const anuncio: Anuncio = {
      id: randomUUID(),
      titulo: input.titulo,
      descricao: input.descricao,
      preco: input.preco,
      bairro: input.bairro,
      quartos: input.quartos,
      corretorId: input.corretorId,
      fotos: input.fotos.map((url) => ({ url }))
    };

    return this.anuncioRepository.create(anuncio);
  }
}
