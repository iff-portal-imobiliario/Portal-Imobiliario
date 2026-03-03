import { User } from '../../domain/entities/User';
import { IUserRepository } from '../../domain/repositories/IUserRepository';
import { CreateUserInputDTO, CreateUserOutputDTO } from '../dtos/CreateUserDTO';

export class CreateUser {
    constructor(private userRepository: IUserRepository) {}

    public async execute(input: CreateUserInputDTO): Promise<CreateUserOutputDTO> {
        // Check if user with the same email already exists
        const existingUser = await this.userRepository.findByEmail(input.email);
        if (existingUser) {
            throw new Error('User with this email already exists');
        }

        // Create new user entity
        const user = new User("", input.name, input.email, input.password, input.role);

        // Save user to repository
        await this.userRepository.save(user);

        // Return output DTO
        return {
            id: user.getId(),
            name: user.getName(),
            email: user.getEmail(),
            role: user.getRole(),
        };
    }
}
