import { Router } from 'express';
import { UserController } from '../../interfaces/controllers/UserController';

export function createUserRoutes(controller: UserController): Router {
    const router = Router();

    router.post('/', (req, res) => controller.create(req, res));
    router.get('/', (req, res) => controller.list(req, res));

    return router;
}
