import { randomBytes, scryptSync, timingSafeEqual } from "crypto";

export class PasswordHasher {
  hash(password: string): string {
    const salt = randomBytes(16).toString("hex");
    const digest = scryptSync(password, salt, 64).toString("hex");
    return `${salt}:${digest}`;
  }

  verify(password: string, storedHash: string): boolean {
    const [salt, digest] = storedHash.split(":");
    if (!salt || !digest) {
      return false;
    }

    const digestBuffer = Buffer.from(digest, "hex");
    const candidateBuffer = scryptSync(password, salt, 64);
    return timingSafeEqual(digestBuffer, candidateBuffer);
  }
}
