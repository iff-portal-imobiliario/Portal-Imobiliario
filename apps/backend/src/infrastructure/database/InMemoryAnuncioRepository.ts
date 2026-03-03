import { Anuncio } from '../../domain/entities/Anuncio';
import { IAnuncioRepository, FilterAnuncio } from '../../domain/repositories/IAnuncioRepository';

export class InMemoryAnuncioRepository implements IAnuncioRepository {
    private anuncios: Anuncio[] = [];

    async findById(id: string): Promise<Anuncio | null> {
        return this.anuncios.find(a => a.getId() === id) || null;
    }

    async findAll(filters?: FilterAnuncio): Promise<Anuncio[]> {
        let result = [...this.anuncios];

        if (filters) {
            if (filters.precoMin !== undefined) {
                result = result.filter(a => a.getPreco() >= filters.precoMin!);
            }
            if (filters.precoMax !== undefined) {
                result = result.filter(a => a.getPreco() <= filters.precoMax!);
            }
            if (filters.bairro) {
                result = result.filter(a =>
                    a.getBairro().toLowerCase().includes(filters.bairro!.toLowerCase())
                );
            }
            if (filters.quartos !== undefined) {
                result = result.filter(a => a.getQuartos() === filters.quartos);
            }
            if (filters.tipo) {
                result = result.filter(a => a.getTipo() === filters.tipo);
            }
        }

        return result;
    }

    async findByCorretorId(corretorId: string): Promise<Anuncio[]> {
        return this.anuncios.filter(a => a.getCorretorId() === corretorId);
    }

    async save(anuncio: Anuncio): Promise<void> {
        this.anuncios.push(anuncio);
    }

    async update(anuncio: Anuncio): Promise<void> {
        const index = this.anuncios.findIndex(a => a.getId() === anuncio.getId());
        if (index !== -1) {
            this.anuncios[index] = anuncio;
        }
    }

    async delete(id: string): Promise<void> {
        this.anuncios = this.anuncios.filter(a => a.getId() !== id);
    }
}
