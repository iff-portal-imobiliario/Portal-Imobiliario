export type UserRole = "ROLE_CLIENTE" | "ROLE_CORRETOR" | "ROLE_ADMIN";

export type User = {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  role: UserRole;
};
