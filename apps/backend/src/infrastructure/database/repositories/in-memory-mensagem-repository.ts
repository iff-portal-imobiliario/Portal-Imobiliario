import { MensagemInteresse } from "../../../../domain/entities/mensagem";
import { MensagemRepository } from "../../../../domain/repositories/mensagem-repository";

export class InMemoryMensagemRepository implements MensagemRepository {
  private readonly mensagens: MensagemInteresse[] = [];

  async create(mensagem: MensagemInteresse): Promise<MensagemInteresse> {
    this.mensagens.push(mensagem);
    return mensagem;
  }

  async listByCorretor(corretorId: string): Promise<MensagemInteresse[]> {
    return this.mensagens.filter((m) => m.corretorId === corretorId);
  }
}
