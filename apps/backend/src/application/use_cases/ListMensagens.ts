import { IMensagemRepository } from '../../domain/repositories/IMensagemRepository';

export class ListMensagens {
    constructor(private mensagemRepository: IMensagemRepository) {}

    public async executeByCorretor(corretorId: string) {
        const mensagens = await this.mensagemRepository.findByCorretorId(corretorId);
        return mensagens.map(m => ({
            id: m.getId(),
            conteudo: m.getConteudo(),
            clienteId: m.getClienteId(),
            corretorId: m.getCorretorId(),
            anuncioId: m.getAnuncioId(),
            createdAt: m.getCreatedAt(),
        }));
    }

    public async executeByCliente(clienteId: string) {
        const mensagens = await this.mensagemRepository.findByClienteId(clienteId);
        return mensagens.map(m => ({
            id: m.getId(),
            conteudo: m.getConteudo(),
            clienteId: m.getClienteId(),
            corretorId: m.getCorretorId(),
            anuncioId: m.getAnuncioId(),
            createdAt: m.getCreatedAt(),
        }));
    }
}
