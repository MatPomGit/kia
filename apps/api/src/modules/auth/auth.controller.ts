import { Body, Controller, Get, Headers, Post, UnauthorizedException } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { LoginDto } from "./dto/login.dto";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("login")
  login(@Body() credentials: LoginDto) {
    return { token: this.authService.authenticate(credentials.login, credentials.password) };
  }

  @Get("verify")
  verify(@Headers("authorization") authorization?: string) {
    const token = authorization?.startsWith("Bearer ") ? authorization.slice(7) : undefined;
    if (!token) throw new UnauthorizedException();
    const session = this.authService.verifyToken(token);
    return { authenticated: true, login: session.sub };
  }
}
