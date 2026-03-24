import { UserRole } from "../../domain/entities/User";

export type RegisterUserInput = {
  name: string;
  email: string;
  password: string;
  role: UserRole;
};
