import { LoginUserInput } from "../dtos/login-user.dto";
import { UserRepository } from "../../domain/repositories/user-repository";
import { PasswordHasher } from "../../infrastructure/security/password-hasher";
import { TokenService } from "../../infrastructure/security/token-service";

export class LoginUserUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly passwordHasher: PasswordHasher,
    private readonly tokenService: TokenService
  ) {}

  async execute(input: LoginUserInput): Promise<{ accessToken: string }> {
    const user = await this.userRepository.findByEmail(input.email);
    if (!user) {
      throw new Error("Credenciais invalidas");
    }

    const isValidPassword = this.passwordHasher.verify(input.password, user.passwordHash);
    if (!isValidPassword) {
      throw new Error("Credenciais invalidas");
    }

    return {
      accessToken: this.tokenService.sign({ sub: user.id, role: user.role })
    };
  }
}
