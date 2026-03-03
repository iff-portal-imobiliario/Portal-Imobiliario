import { Request, Response } from 'express';
import { CreateAnuncio } from '../../application/use_cases/CreateAnuncio';
import { UpdateAnuncio } from '../../application/use_cases/UpdateAnuncio';
import { DeleteAnuncio } from '../../application/use_cases/DeleteAnuncio';
import { ListAnuncios } from '../../application/use_cases/ListAnuncios';
import { FindAnuncioById } from '../../application/use_cases/FindAnuncioById';

export class AnuncioController {
    constructor(
        private createAnuncio: CreateAnuncio,
        private updateAnuncio: UpdateAnuncio,
        private deleteAnuncio: DeleteAnuncio,
        private listAnuncios: ListAnuncios,
        private findAnuncioById: FindAnuncioById
    ) {}

    public async create(req: Request, res: Response): Promise<Response> {
        try {
            const inputDTO = req.body;
            const outputDTO = await this.createAnuncio.execute(inputDTO);
            return res.status(201).json(outputDTO);
        } catch (error) {
            if (error instanceof Error) {
                if (error.message.includes('not found')) {
                    return res.status(404).json({ message: error.message });
                }
                if (error.message.includes('Only corretores')) {
                    return res.status(403).json({ message: error.message });
                }
            }
            return res.status(500).json({ message: 'Internal server error.' });
        }
    }

    public async update(req: Request, res: Response): Promise<Response> {
        try {
            const { id } = req.params;
            const inputDTO = { ...req.body, id };
            const outputDTO = await this.updateAnuncio.execute(inputDTO);
            return res.status(200).json(outputDTO);
        } catch (error) {
            if (error instanceof Error) {
                if (error.message.includes('not found')) {
                    return res.status(404).json({ message: error.message });
                }
                if (error.message.includes('Only the owner')) {
                    return res.status(403).json({ message: error.message });
                }
            }
            return res.status(500).json({ message: 'Internal server error.' });
        }
    }

    public async delete(req: Request, res: Response): Promise<Response> {
        try {
            const id = req.params.id as string;
            const { corretorId } = req.body;
            await this.deleteAnuncio.execute(id, corretorId);
            return res.status(204).send();
        } catch (error) {
            if (error instanceof Error) {
                if (error.message.includes('not found')) {
                    return res.status(404).json({ message: error.message });
                }
                if (error.message.includes('Only the owner')) {
                    return res.status(403).json({ message: error.message });
                }
            }
            return res.status(500).json({ message: 'Internal server error.' });
        }
    }

    public async list(req: Request, res: Response): Promise<Response> {
        try {
            const filters = {
                precoMin: req.query.precoMin ? Number(req.query.precoMin) : undefined,
                precoMax: req.query.precoMax ? Number(req.query.precoMax) : undefined,
                bairro: req.query.bairro as string | undefined,
                quartos: req.query.quartos ? Number(req.query.quartos) : undefined,
                tipo: req.query.tipo as 'ALUGUEL' | 'VENDA' | undefined,
            };
            const anuncios = await this.listAnuncios.execute(filters);
            return res.status(200).json(anuncios);
        } catch (error) {
            return res.status(500).json({ message: 'Internal server error.' });
        }
    }

    public async findById(req: Request, res: Response): Promise<Response> {
        try {
            const id = req.params.id as string;
            const anuncio = await this.findAnuncioById.execute(id);
            return res.status(200).json(anuncio);
        } catch (error) {
            if (error instanceof Error && error.message.includes('not found')) {
                return res.status(404).json({ message: error.message });
            }
            return res.status(500).json({ message: 'Internal server error.' });
        }
    }
}
