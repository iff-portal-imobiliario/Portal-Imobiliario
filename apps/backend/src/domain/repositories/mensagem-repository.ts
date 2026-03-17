import { MensagemInteresse } from "../entities/Mensagem";

export interface MensagemRepository {
  create(mensagem: MensagemInteresse): Promise<MensagemInteresse>;
  listByCorretor(corretorId: string): Promise<MensagemInteresse[]>;
}
