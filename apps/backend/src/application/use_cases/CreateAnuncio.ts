import { Anuncio } from '../../domain/entities/Anuncio';
import { IAnuncioRepository } from '../../domain/repositories/IAnuncioRepository';
import { IUserRepository } from '../../domain/repositories/IUserRepository';
import { CreateAnuncioInputDTO, CreateAnuncioOutputDTO } from '../dtos/CreateAnuncioDTO';

export class CreateAnuncio {
    constructor(
        private anuncioRepository: IAnuncioRepository,
        private userRepository: IUserRepository
    ) {}

    public async execute(input: CreateAnuncioInputDTO): Promise<CreateAnuncioOutputDTO> {
        // Verify corretor exists
        const corretor = await this.userRepository.findById(input.corretorId);
        if (!corretor) {
            throw new Error('Corretor not found');
        }
        if (!corretor.isCorretor() && !corretor.isAdmin()) {
            throw new Error('Only corretores can create anuncios');
        }

        // Create anuncio entity
        const anuncio = new Anuncio(
            "",
            input.titulo,
            input.descricao,
            input.preco,
            input.bairro,
            input.quartos,
            input.fotos,
            input.tipo,
            input.corretorId
        );

        // Save to repository
        await this.anuncioRepository.save(anuncio);

        // Return output DTO
        return {
            id: anuncio.getId(),
            titulo: anuncio.getTitulo(),
            descricao: anuncio.getDescricao(),
            preco: anuncio.getPreco(),
            bairro: anuncio.getBairro(),
            quartos: anuncio.getQuartos(),
            fotos: anuncio.getFotos(),
            tipo: anuncio.getTipo(),
            corretorId: anuncio.getCorretorId(),
            createdAt: anuncio.getCreatedAt(),
        };
    }
}
