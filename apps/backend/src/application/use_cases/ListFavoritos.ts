import { IFavoritoRepository } from '../../domain/repositories/IFavoritoRepository';
import { IAnuncioRepository } from '../../domain/repositories/IAnuncioRepository';

export class ListFavoritos {
    constructor(
        private favoritoRepository: IFavoritoRepository,
        private anuncioRepository: IAnuncioRepository
    ) {}

    public async execute(userId: string) {
        const anuncioIds = await this.favoritoRepository.findByUserId(userId);

        const anuncios = [];
        for (const anuncioId of anuncioIds) {
            const anuncio = await this.anuncioRepository.findById(anuncioId);
            if (anuncio) {
                anuncios.push({
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
                });
            }
        }

        return anuncios;
    }
}
