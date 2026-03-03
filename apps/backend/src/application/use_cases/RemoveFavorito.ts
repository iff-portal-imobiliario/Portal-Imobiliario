import { IFavoritoRepository } from '../../domain/repositories/IFavoritoRepository';

export class RemoveFavorito {
    constructor(private favoritoRepository: IFavoritoRepository) {}

    public async execute(userId: string, anuncioId: string): Promise<void> {
        const exists = await this.favoritoRepository.exists(userId, anuncioId);
        if (!exists) {
            throw new Error('Anuncio not in favorites');
        }

        await this.favoritoRepository.remove(userId, anuncioId);
    }
}
