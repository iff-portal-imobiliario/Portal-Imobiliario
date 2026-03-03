import { Request, Response } from 'express';
import { SendMensagem } from '../../application/use_cases/SendMensagem';
import { ListMensagens } from '../../application/use_cases/ListMensagens';

export class MensagemController {
    constructor(
        private sendMensagem: SendMensagem,
        private listMensagens: ListMensagens
    ) {}

    public async send(req: Request, res: Response): Promise<Response> {
        try {
            const inputDTO = req.body;
            const outputDTO = await this.sendMensagem.execute(inputDTO);
            return res.status(201).json(outputDTO);
        } catch (error) {
            if (error instanceof Error && error.message.includes('not found')) {
                return res.status(404).json({ message: error.message });
            }
            return res.status(500).json({ message: 'Internal server error.' });
        }
    }

    public async listByCorretor(req: Request, res: Response): Promise<Response> {
        try {
            const corretorId = req.params.corretorId as string;
            const mensagens = await this.listMensagens.executeByCorretor(corretorId);
            return res.status(200).json(mensagens);
        } catch (error) {
            return res.status(500).json({ message: 'Internal server error.' });
        }
    }

    public async listByCliente(req: Request, res: Response): Promise<Response> {
        try {
            const clienteId = req.params.clienteId as string;
            const mensagens = await this.listMensagens.executeByCliente(clienteId);
            return res.status(200).json(mensagens);
        } catch (error) {
            return res.status(500).json({ message: 'Internal server error.' });
        }
    }
}
