import { Router } from 'express';
import { FavoritoController } from '../../interfaces/controllers/FavoritoController';

export function createFavoritoRoutes(controller: FavoritoController): Router {
    const router = Router();

    router.post('/', (req, res) => controller.add(req, res));
    router.get('/:userId', (req, res) => controller.list(req, res));
    router.delete('/:userId/:anuncioId', (req, res) => controller.remove(req, res));

    return router;
}
