export type UserRole = 'CORRETOR' | 'CLIENTE' | 'ADMIN';

export class User {
    private id: string;
    public name: string;
    public email: string;
    public password: string;
    public role: UserRole;

    constructor(id: string, name: string, email: string, password: string, role: UserRole) {
        this.id = id || "new-id-" + Date.now();
        this.name = name;
        this.email = email;
        this.password = password;
        this.role = role;
    }

    public getId(): string {
        return this.id;
    }

    public getName(): string {
        return this.name;
    }

    public getEmail(): string {
        return this.email;
    }

    public getPassword(): string {
        return this.password;
    }

    public getRole(): UserRole {
        return this.role;
    }

    public isCorretor(): boolean {
        return this.role === 'CORRETOR';
    }

    public isCliente(): boolean {
        return this.role === 'CLIENTE';
    }

    public isAdmin(): boolean {
        return this.role === 'ADMIN';
    }
}
