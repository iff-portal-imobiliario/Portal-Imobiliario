import { Anuncio } from '../entities/Anuncio';

export interface FilterAnuncio {
    precoMin?: number;
    precoMax?: number;
    bairro?: string;
    quartos?: number;
    tipo?: 'ALUGUEL' | 'VENDA';
}

export interface IAnuncioRepository {
    findById(id: string): Promise<Anuncio | null>;
    findAll(filters?: FilterAnuncio): Promise<Anuncio[]>;
    findByCorretorId(corretorId: string): Promise<Anuncio[]>;
    save(anuncio: Anuncio): Promise<void>;
    update(anuncio: Anuncio): Promise<void>;
    delete(id: string): Promise<void>;
}
