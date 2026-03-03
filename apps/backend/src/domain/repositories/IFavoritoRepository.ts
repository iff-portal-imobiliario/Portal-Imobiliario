export interface IFavoritoRepository {
    add(userId: string, anuncioId: string): Promise<void>;
    remove(userId: string, anuncioId: string): Promise<void>;
    findByUserId(userId: string): Promise<string[]>;
    exists(userId: string, anuncioId: string): Promise<boolean>;
}
