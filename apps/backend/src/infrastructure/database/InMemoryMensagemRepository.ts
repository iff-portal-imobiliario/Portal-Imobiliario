import { Mensagem } from '../../domain/entities/Mensagem';
import { IMensagemRepository } from '../../domain/repositories/IMensagemRepository';

export class InMemoryMensagemRepository implements IMensagemRepository {
    private mensagens: Mensagem[] = [];

    async findById(id: string): Promise<Mensagem | null> {
        return this.mensagens.find(m => m.getId() === id) || null;
    }

    async findByCorretorId(corretorId: string): Promise<Mensagem[]> {
        return this.mensagens.filter(m => m.getCorretorId() === corretorId);
    }

    async findByClienteId(clienteId: string): Promise<Mensagem[]> {
        return this.mensagens.filter(m => m.getClienteId() === clienteId);
    }

    async findByAnuncioId(anuncioId: string): Promise<Mensagem[]> {
        return this.mensagens.filter(m => m.getAnuncioId() === anuncioId);
    }

    async save(mensagem: Mensagem): Promise<void> {
        this.mensagens.push(mensagem);
    }

    async delete(id: string): Promise<void> {
        this.mensagens = this.mensagens.filter(m => m.getId() !== id);
    }
}
