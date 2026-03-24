import { createHmac } from "crypto";
import { UserRole } from "../../domain/entities/User";

type AuthTokenPayload = {
  sub: string;
  role: UserRole;
};

export class TokenService {
  constructor(private readonly secret: string) {}

  sign(payload: AuthTokenPayload): string {
    const encodedPayload = Buffer.from(JSON.stringify(payload)).toString("base64url");
    const signature = createHmac("sha256", this.secret).update(encodedPayload).digest("base64url");
    return `${encodedPayload}.${signature}`;
  }

  verify(token: string): AuthTokenPayload | null {
    const [encodedPayload, signature] = token.split(".");
    if (!encodedPayload || !signature) {
      return null;
    }

    const expectedSignature = createHmac("sha256", this.secret)
      .update(encodedPayload)
      .digest("base64url");

    if (signature !== expectedSignature) {
      return null;
    }

    try {
      const payload = JSON.parse(Buffer.from(encodedPayload, "base64url").toString("utf-8")) as {
        sub?: string;
        role?: UserRole;
      };

      if (!payload.sub || !payload.role) {
        return null;
      }

      return { sub: payload.sub, role: payload.role };
    } catch {
      return null;
    }
  }
}
