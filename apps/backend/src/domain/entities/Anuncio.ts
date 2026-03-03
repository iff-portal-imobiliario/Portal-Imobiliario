export type TipoAnuncio = 'ALUGUEL' | 'VENDA';

export class Anuncio {
    private id: string;
    public titulo: string;
    public descricao: string;
    public preco: number;
    public bairro: string;
    public quartos: number;
    public fotos: string[];
    public tipo: TipoAnuncio;
    public corretorId: string;
    public createdAt: Date;

    constructor(
        id: string,
        titulo: string,
        descricao: string,
        preco: number,
        bairro: string,
        quartos: number,
        fotos: string[],
        tipo: TipoAnuncio,
        corretorId: string
    ) {
        this.id = id || "anuncio-" + Date.now();
        this.titulo = titulo;
        this.descricao = descricao;
        this.preco = preco;
        this.bairro = bairro;
        this.quartos = quartos;
        this.fotos = fotos;
        this.tipo = tipo;
        this.corretorId = corretorId;
        this.createdAt = new Date();
    }

    public getId(): string {
        return this.id;
    }

    public getTitulo(): string {
        return this.titulo;
    }

    public getDescricao(): string {
        return this.descricao;
    }

    public getPreco(): number {
        return this.preco;
    }

    public getBairro(): string {
        return this.bairro;
    }

    public getQuartos(): number {
        return this.quartos;
    }

    public getFotos(): string[] {
        return this.fotos;
    }

    public getTipo(): TipoAnuncio {
        return this.tipo;
    }

    public getCorretorId(): string {
        return this.corretorId;
    }

    public getCreatedAt(): Date {
        return this.createdAt;
    }

    public addFoto(url: string): void {
        this.fotos.push(url);
    }

    public removeFoto(url: string): void {
        this.fotos = this.fotos.filter(f => f !== url);
    }
}
