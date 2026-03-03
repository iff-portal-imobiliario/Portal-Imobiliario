import { IFavoritoRepository } from '../../domain/repositories/IFavoritoRepository';
import { IAnuncioRepository } from '../../domain/repositories/IAnuncioRepository';

export class AddFavorito {
    constructor(
        private favoritoRepository: IFavoritoRepository,
        private anuncioRepository: IAnuncioRepository
    ) {}

    public async execute(userId: string, anuncioId: string): Promise<void> {
        // Verify anuncio exists
        const anuncio = await this.anuncioRepository.findById(anuncioId);
        if (!anuncio) {
            throw new Error('Anuncio not found');
        }

        // Check if already favorited
        const exists = await this.favoritoRepository.exists(userId, anuncioId);
        if (exists) {
            throw new Error('Anuncio already in favorites');
        }

        await this.favoritoRepository.add(userId, anuncioId);
    }
}
