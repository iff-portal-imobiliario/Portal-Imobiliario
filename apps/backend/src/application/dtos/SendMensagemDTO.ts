export interface SendMensagemInputDTO {
    conteudo: string;
    clienteId: string;
    anuncioId: string;
}

export interface SendMensagemOutputDTO {
    id: string;
    conteudo: string;
    clienteId: string;
    corretorId: string;
    anuncioId: string;
    createdAt: Date;
}
