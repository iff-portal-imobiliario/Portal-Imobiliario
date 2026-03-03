import { Request, Response } from 'express';
import { CreateUser } from '../../application/use_cases/CreateUser';
import { ListUsers } from '../../application/use_cases/ListUsers';

export class UserController {
    constructor(
        private createUser: CreateUser,
        private listUsers: ListUsers
    ) {}

    public async create(req: Request, res: Response): Promise<Response> {
        try {
            const inputDTO = req.body;
            const outputDTO = await this.createUser.execute(inputDTO);
            return res.status(201).json(outputDTO);
        } catch (error) {
            if (error instanceof Error && error.message.includes('already exists')) {
                return res.status(409).json({ message: error.message });
            }
            return res.status(500).json({ message: 'Internal server error.' });
        }
    }

    public async list(req: Request, res: Response): Promise<Response> {
        try {
            const users = await this.listUsers.execute();
            return res.status(200).json(users);
        } catch (error) {
            return res.status(500).json({ message: 'Internal server error.' });
        }
    }
}
