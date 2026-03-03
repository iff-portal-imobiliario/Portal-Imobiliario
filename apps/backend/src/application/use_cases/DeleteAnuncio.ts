import { IAnuncioRepository } from '../../domain/repositories/IAnuncioRepository';

export class DeleteAnuncio {
    constructor(private anuncioRepository: IAnuncioRepository) {}

    public async execute(id: string, corretorId: string): Promise<void> {
        const anuncio = await this.anuncioRepository.findById(id);
        if (!anuncio) {
            throw new Error('Anuncio not found');
        }

        if (anuncio.getCorretorId() !== corretorId) {
            throw new Error('Only the owner can delete this anuncio');
        }

        await this.anuncioRepository.delete(id);
    }
}
