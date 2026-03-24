import { randomUUID } from "crypto";
import { RegisterUserInput } from "../dtos/register-user.dto";
import { User } from "../../domain/entities/User";
import { UserRepository } from "../../domain/repositories/user-repository";
import { PasswordHasher } from "../../infrastructure/security/password-hasher";

export class RegisterUserUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly passwordHasher: PasswordHasher
  ) {}

  async execute(input: RegisterUserInput): Promise<Omit<User, "passwordHash">> {
    if (input.password.length < 6) {
      throw new Error("Senha deve ter ao menos 6 caracteres");
    }

    const existingUser = await this.userRepository.findByEmail(input.email);
    if (existingUser) {
      throw new Error("Email ja cadastrado");
    }

    const user = await this.userRepository.create({
      id: randomUUID(),
      name: input.name,
      email: input.email,
      passwordHash: this.passwordHasher.hash(input.password),
      role: input.role
    });

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role
    };
  }
}
