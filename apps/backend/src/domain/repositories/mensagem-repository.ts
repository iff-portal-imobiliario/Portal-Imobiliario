import { MensagemInteresse } from "../entities/mensagem";

export interface MensagemRepository {
  create(mensagem: MensagemInteresse): Promise<MensagemInteresse>;
  listByCorretor(corretorId: string): Promise<MensagemInteresse[]>;
}
