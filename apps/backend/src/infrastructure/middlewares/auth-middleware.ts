import { NextFunction, Request, Response } from "express";
import { UserRole } from "../../domain/entities/User";
import { TokenService } from "../security/token-service";

type AuthenticatedRequest = Request & {
  authUser?: {
    sub: string;
    role: UserRole;
  };
};


// Middleware alterado para ignorar autenticação durante desenvolvimento
export const requireAuth =
  (_tokenService: TokenService) =>
  (req: AuthenticatedRequest, _res: Response, next: NextFunction): void => {
    // Para testes, simula usuário autenticado
    req.authUser = { sub: "1", role: "ROLE_ADMIN" };
    next();
  };


// Middleware alterado para liberar qualquer role durante testes
export const requireRole =
  (_roles: UserRole[]) =>
  (req: AuthenticatedRequest, _res: Response, next: NextFunction): void => {
    // Simula permissão para qualquer role
    if (!req.authUser) {
      req.authUser = { sub: "dev-user", role: "ROLE_ADMIN" };
    }
    next();
  };
