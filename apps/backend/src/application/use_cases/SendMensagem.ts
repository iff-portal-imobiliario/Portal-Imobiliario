import { Mensagem } from '../../domain/entities/Mensagem';
import { IMensagemRepository } from '../../domain/repositories/IMensagemRepository';
import { IAnuncioRepository } from '../../domain/repositories/IAnuncioRepository';
import { SendMensagemInputDTO, SendMensagemOutputDTO } from '../dtos/SendMensagemDTO';

export class SendMensagem {
    constructor(
        private mensagemRepository: IMensagemRepository,
        private anuncioRepository: IAnuncioRepository
    ) {}

    public async execute(input: SendMensagemInputDTO): Promise<SendMensagemOutputDTO> {
        // Find anuncio to get the corretor
        const anuncio = await this.anuncioRepository.findById(input.anuncioId);
        if (!anuncio) {
            throw new Error('Anuncio not found');
        }

        const corretorId = anuncio.getCorretorId();

        // Create mensagem entity
        const mensagem = new Mensagem(
            "",
            input.conteudo,
            input.clienteId,
            corretorId,
            input.anuncioId
        );

        // Save to repository
        await this.mensagemRepository.save(mensagem);

        return {
            id: mensagem.getId(),
            conteudo: mensagem.getConteudo(),
            clienteId: mensagem.getClienteId(),
            corretorId: mensagem.getCorretorId(),
            anuncioId: mensagem.getAnuncioId(),
            createdAt: mensagem.getCreatedAt(),
        };
    }
}
