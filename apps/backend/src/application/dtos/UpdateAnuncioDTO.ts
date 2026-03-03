import { TipoAnuncio } from '../../domain/entities/Anuncio';

export interface UpdateAnuncioInputDTO {
    id: string;
    titulo?: string;
    descricao?: string;
    preco?: number;
    bairro?: string;
    quartos?: number;
    fotos?: string[];
    tipo?: TipoAnuncio;
    corretorId: string; // para validar que é o dono
}

export interface UpdateAnuncioOutputDTO {
    id: string;
    titulo: string;
    descricao: string;
    preco: number;
    bairro: string;
    quartos: number;
    fotos: string[];
    tipo: TipoAnuncio;
    corretorId: string;
    createdAt: Date;
}
