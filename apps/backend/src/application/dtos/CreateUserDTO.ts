import { UserRole } from '../../domain/entities/User';

export interface CreateUserInputDTO {
    name: string;
    email: string;
    password: string;
    role: UserRole;
}

export interface CreateUserOutputDTO {
    id: string;
    name: string;
    email: string;
    role: UserRole;
}
