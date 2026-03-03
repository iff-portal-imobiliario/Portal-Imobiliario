import { User } from '../../domain/entities/User';
import { IUserRepository } from '../../domain/repositories/IUserRepository';

export class InMemoryUserRepository implements IUserRepository {
    private users: User[] = [];

    async findById(id: string): Promise<User | null> {
        return this.users.find(user => user.getId() === id) || null;
    }

    async findByEmail(email: string): Promise<User | null> {
        return this.users.find(user => user.getEmail() === email) || null;
    }

    async findAll(): Promise<User[]> {
        return [...this.users];
    }

    async save(user: User): Promise<void> {
        this.users.push(user);
    }

    async delete(id: string): Promise<void> {
        this.users = this.users.filter(user => user.getId() !== id);
    }
}
