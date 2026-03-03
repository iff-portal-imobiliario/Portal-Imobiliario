import { Mensagem } from '../entities/Mensagem';

export interface IMensagemRepository {
    findById(id: string): Promise<Mensagem | null>;
    findByCorretorId(corretorId: string): Promise<Mensagem[]>;
    findByClienteId(clienteId: string): Promise<Mensagem[]>;
    findByAnuncioId(anuncioId: string): Promise<Mensagem[]>;
    save(mensagem: Mensagem): Promise<void>;
    delete(id: string): Promise<void>;
}
