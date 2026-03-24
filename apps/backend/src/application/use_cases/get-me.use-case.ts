import { User } from "../../domain/entities/User";
import { UserRepository } from "../../domain/repositories/user-repository";

export class GetMeUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(userId: string): Promise<Omit<User, "passwordHash">> {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new Error("Usuario nao encontrado");
    }

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role
    };
  }
}
