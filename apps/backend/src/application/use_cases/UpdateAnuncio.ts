import { IAnuncioRepository } from '../../domain/repositories/IAnuncioRepository';
import { IUserRepository } from '../../domain/repositories/IUserRepository';
import { UpdateAnuncioInputDTO, UpdateAnuncioOutputDTO } from '../dtos/UpdateAnuncioDTO';

export class UpdateAnuncio {
    constructor(
        private anuncioRepository: IAnuncioRepository,
        private userRepository: IUserRepository
    ) {}

    public async execute(input: UpdateAnuncioInputDTO): Promise<UpdateAnuncioOutputDTO> {
        // Find existing anuncio
        const anuncio = await this.anuncioRepository.findById(input.id);
        if (!anuncio) {
            throw new Error('Anuncio not found');
        }

        // Verify ownership
        if (anuncio.getCorretorId() !== input.corretorId) {
            throw new Error('Only the owner can update this anuncio');
        }

        // Update fields
        if (input.titulo !== undefined) anuncio.titulo = input.titulo;
        if (input.descricao !== undefined) anuncio.descricao = input.descricao;
        if (input.preco !== undefined) anuncio.preco = input.preco;
        if (input.bairro !== undefined) anuncio.bairro = input.bairro;
        if (input.quartos !== undefined) anuncio.quartos = input.quartos;
        if (input.fotos !== undefined) anuncio.fotos = input.fotos;
        if (input.tipo !== undefined) anuncio.tipo = input.tipo;

        // Save updated anuncio
        await this.anuncioRepository.update(anuncio);

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
