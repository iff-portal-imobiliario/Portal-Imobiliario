import { IFavoritoRepository } from '../../domain/repositories/IFavoritoRepository';

interface Favorito {
    userId: string;
    anuncioId: string;
}

export class InMemoryFavoritoRepository implements IFavoritoRepository {
    private favoritos: Favorito[] = [];

    async add(userId: string, anuncioId: string): Promise<void> {
        this.favoritos.push({ userId, anuncioId });
    }

    async remove(userId: string, anuncioId: string): Promise<void> {
        this.favoritos = this.favoritos.filter(
            f => !(f.userId === userId && f.anuncioId === anuncioId)
        );
    }

    async findByUserId(userId: string): Promise<string[]> {
        return this.favoritos
            .filter(f => f.userId === userId)
            .map(f => f.anuncioId);
    }

    async exists(userId: string, anuncioId: string): Promise<boolean> {
        return this.favoritos.some(
            f => f.userId === userId && f.anuncioId === anuncioId
        );
    }
}
