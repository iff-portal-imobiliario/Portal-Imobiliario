import { IAnuncioRepository, FilterAnuncio } from '../../domain/repositories/IAnuncioRepository';

export class ListAnuncios {
    constructor(private anuncioRepository: IAnuncioRepository) {}

    public async execute(filters?: FilterAnuncio) {
        const anuncios = await this.anuncioRepository.findAll(filters);
        return anuncios.map(anuncio => ({
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
        }));
    }
}
