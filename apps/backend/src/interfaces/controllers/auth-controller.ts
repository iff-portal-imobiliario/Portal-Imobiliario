import { Request, Response } from "express";
import { LoginUserUseCase } from "../../application/use_cases/login-user.use-case";
import { RegisterUserUseCase } from "../../application/use_cases/register-user.use-case";
import { GetMeUseCase } from "../../application/use_cases/get-me.use-case";
import { UserRole } from "../../domain/entities/User";

const validRoles: UserRole[] = ["ROLE_CLIENTE", "ROLE_CORRETOR", "ROLE_ADMIN"];

export class AuthController {
  constructor(
    private readonly registerUserUseCase: RegisterUserUseCase,
    private readonly loginUserUseCase: LoginUserUseCase,
    private readonly getMeUseCase: GetMeUseCase
  ) {}

  async register(req: Request, res: Response): Promise<Response> {
    const { name, email, password, role } = req.body as {
      name: string;
      email: string;
      password: string;
      role: UserRole;
    };

    if (!validRoles.includes(role)) {
      throw new Error("Role invalida");
    }

    const user = await this.registerUserUseCase.execute({ name, email, password, role });
    return res.status(201).json(user);
  }

  async login(req: Request, res: Response): Promise<Response> {
    const { email, password } = req.body as { email: string; password: string };
    const token = await this.loginUserUseCase.execute({ email, password });
    return res.status(200).json(token);
  }

  async me(req: Request, res: Response): Promise<Response> {
    const authUser = (req as Request & { authUser?: { sub: string; role: UserRole } }).authUser;
    if (!authUser) {
      throw new Error("Nao autenticado");
    }

    const user = await this.getMeUseCase.execute(authUser.sub);
    return res.status(200).json(user);
  }
}
