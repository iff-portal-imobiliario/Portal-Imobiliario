import { Router } from 'express';
import { MensagemController } from '../../interfaces/controllers/MensagemController';

export function createMensagemRoutes(controller: MensagemController): Router {
    const router = Router();

    router.post('/', (req, res) => controller.send(req, res));
    router.get('/corretor/:corretorId', (req, res) => controller.listByCorretor(req, res));
    router.get('/cliente/:clienteId', (req, res) => controller.listByCliente(req, res));

    return router;
}
