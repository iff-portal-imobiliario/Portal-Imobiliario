import { IUserRepository } from '../../domain/repositories/IUserRepository';

export class ListUsers {
    constructor(private userRepository: IUserRepository) {}

    public async execute() {
        const users = await this.userRepository.findAll();
        return users.map(user => ({
            id: user.getId(),
            name: user.getName(),
            email: user.getEmail(),
            role: user.getRole(),
        }));
    }
}
