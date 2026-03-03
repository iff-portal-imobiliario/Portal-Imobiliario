import { TipoAnuncio } from '../../domain/entities/Anuncio';

export interface CreateAnuncioInputDTO {
    titulo: string;
    descricao: string;
    preco: number;
    bairro: string;
    quartos: number;
    fotos: string[];
    tipo: TipoAnuncio;
    corretorId: string;
}

export interface CreateAnuncioOutputDTO {
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
