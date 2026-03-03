import { IAnuncioRepository } from '../../domain/repositories/IAnuncioRepository';

export class FindAnuncioById {
    constructor(private anuncioRepository: IAnuncioRepository) {}

    public async execute(id: string) {
        const anuncio = await this.anuncioRepository.findById(id);
        if (!anuncio) {
            throw new Error('Anuncio not found');
        }

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
