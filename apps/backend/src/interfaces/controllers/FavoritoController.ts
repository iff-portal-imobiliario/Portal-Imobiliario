import { Request, Response } from 'express';
import { AddFavorito } from '../../application/use_cases/AddFavorito';
import { RemoveFavorito } from '../../application/use_cases/RemoveFavorito';
import { ListFavoritos } from '../../application/use_cases/ListFavoritos';

export class FavoritoController {
    constructor(
        private addFavorito: AddFavorito,
        private removeFavorito: RemoveFavorito,
        private listFavoritos: ListFavoritos
    ) {}

    public async add(req: Request, res: Response): Promise<Response> {
        try {
            const { userId, anuncioId } = req.body;
            await this.addFavorito.execute(userId, anuncioId);
            return res.status(201).json({ message: 'Favorito added successfully' });
        } catch (error) {
            if (error instanceof Error) {
                if (error.message.includes('not found')) {
                    return res.status(404).json({ message: error.message });
                }
                if (error.message.includes('already in favorites')) {
                    return res.status(409).json({ message: error.message });
                }
            }
            return res.status(500).json({ message: 'Internal server error.' });
        }
    }

    public async remove(req: Request, res: Response): Promise<Response> {
        try {
            const userId = req.params.userId as string;
            const anuncioId = req.params.anuncioId as string;
            await this.removeFavorito.execute(userId, anuncioId);
            return res.status(204).send();
        } catch (error) {
            if (error instanceof Error && error.message.includes('not in favorites')) {
                return res.status(404).json({ message: error.message });
            }
            return res.status(500).json({ message: 'Internal server error.' });
        }
    }

    public async list(req: Request, res: Response): Promise<Response> {
        try {
            const userId = req.params.userId as string;
            const favoritos = await this.listFavoritos.execute(userId);
            return res.status(200).json(favoritos);
        } catch (error) {
            return res.status(500).json({ message: 'Internal server error.' });
        }
    }
}
