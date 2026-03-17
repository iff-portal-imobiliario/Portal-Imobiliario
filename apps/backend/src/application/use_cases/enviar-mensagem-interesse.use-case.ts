import { randomUUID } from "crypto";
import { MensagemInteresse } from "../../domain/entities/mensagem";
import { AnuncioRepository } from "../../domain/repositories/anuncio-repository";
import { MensagemRepository } from "../../domain/repositories/mensagem-repository";

export class EnviarMensagemInteresseUseCase {
  constructor(
    private readonly anuncioRepository: AnuncioRepository,
    private readonly mensagemRepository: MensagemRepository
  ) {}

  async execute(anuncioId: string, clienteId: string, texto: string): Promise<MensagemInteresse> {
    const anuncio = await this.anuncioRepository.findById(anuncioId);
    if (!anuncio) {
      throw new Error("Anuncio nao encontrado");
    }

    return this.mensagemRepository.create({
      id: randomUUID(),
      anuncioId,
      clienteId,
      corretorId: anuncio.corretorId,
      texto
    });
  }
}
