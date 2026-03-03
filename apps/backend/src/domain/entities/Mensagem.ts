export class Mensagem {
    private id: string;
    public conteudo: string;
    public clienteId: string;
    public corretorId: string;
    public anuncioId: string;
    public createdAt: Date;

    constructor(
        id: string,
        conteudo: string,
        clienteId: string,
        corretorId: string,
        anuncioId: string
    ) {
        this.id = id || "msg-" + Date.now();
        this.conteudo = conteudo;
        this.clienteId = clienteId;
        this.corretorId = corretorId;
        this.anuncioId = anuncioId;
        this.createdAt = new Date();
    }

    public getId(): string {
        return this.id;
    }

    public getConteudo(): string {
        return this.conteudo;
    }

    public getClienteId(): string {
        return this.clienteId;
    }

    public getCorretorId(): string {
        return this.corretorId;
    }

    public getAnuncioId(): string {
        return this.anuncioId;
    }

    public getCreatedAt(): Date {
        return this.createdAt;
    }
}
