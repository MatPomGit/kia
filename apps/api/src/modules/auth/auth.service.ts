import { Injectable, UnauthorizedException } from "@nestjs/common";
import { createHmac, scryptSync, timingSafeEqual } from "node:crypto";
import { PrismaService } from "../database/prisma.service";

export interface SessionPayload {
  sub: string;
  exp: number;
}

@Injectable()
export class AuthService {
  private readonly login = this.requireEnv("INSTRUCTOR_LOGIN");
  private readonly passwordHash = this.requireEnv("INSTRUCTOR_PASSWORD_HASH");
  private readonly passwordSalt = this.requireEnv("INSTRUCTOR_PASSWORD_SALT");
  private readonly tokenSecret = this.requireEnv("AUTH_TOKEN_SECRET");

  constructor(private readonly prisma: PrismaService) {}

  authenticate(login: string, password: string): string {
    const computedHash = scryptSync(password, this.passwordSalt, 64).toString("hex");
    const loginMatches = this.safeEqual(login, this.login);
    const passwordMatches = this.safeEqual(computedHash, this.passwordHash);

    if (!loginMatches || !passwordMatches) {
      throw new UnauthorizedException("Nieprawidłowy login lub hasło.");
    }

    return this.signToken({ sub: login, exp: Math.floor(Date.now() / 1000) + 3600 });
  }

  verifyToken(token: string): SessionPayload {
    const [payloadPart, signature] = token.split(".");
    if (!payloadPart || !signature) throw new UnauthorizedException();

    const expected = this.signature(payloadPart);
    if (!this.safeEqual(signature, expected)) throw new UnauthorizedException();

    const payload = JSON.parse(Buffer.from(payloadPart, "base64url").toString("utf8")) as SessionPayload;
    if (!payload.exp || payload.exp <= Math.floor(Date.now() / 1000)) throw new UnauthorizedException();
    return payload;
  }

  getSessionFromAuthorization(authorization?: string): SessionPayload {
    const token = authorization?.startsWith("Bearer ") ? authorization.slice(7) : undefined;
    if (!token) throw new UnauthorizedException();
    return this.verifyToken(token);
  }

  async getCurrentUser(authorization?: string) {
    const session = this.getSessionFromAuthorization(authorization);
    const user = await this.prisma.user.findUnique({
      where: { email: session.sub },
      select: { id: true, email: true, role: true, createdAt: true }
    });

    return user ?? { login: session.sub };
  }

  private signToken(payload: SessionPayload): string {
    const encoded = Buffer.from(JSON.stringify(payload)).toString("base64url");
    return `${encoded}.${this.signature(encoded)}`;
  }

  private signature(value: string): string {
    return createHmac("sha256", this.tokenSecret).update(value).digest("base64url");
  }

  private safeEqual(left: string, right: string): boolean {
    const leftBuffer = Buffer.from(left);
    const rightBuffer = Buffer.from(right);
    return leftBuffer.length === rightBuffer.length && timingSafeEqual(leftBuffer, rightBuffer);
  }

  private requireEnv(name: string): string {
    const value = process.env[name];
    if (!value) throw new Error(`Brak wymaganej zmiennej środowiskowej: ${name}`);
    return value;
  }
}
