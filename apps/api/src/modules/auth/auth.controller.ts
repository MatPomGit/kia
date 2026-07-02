import { Body, Controller, Get, Headers, Post } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { LoginDto } from "./dto/login.dto";

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("auth/login")
  login(@Body() credentials: LoginDto) {
    return { token: this.authService.authenticate(credentials.login, credentials.password) };
  }

  @Get("auth/verify")
  verify(@Headers("authorization") authorization?: string) {
    const session = this.authService.getSessionFromAuthorization(authorization);
    return { authenticated: true, login: session.sub };
  }

  @Get("me")
  me(@Headers("authorization") authorization?: string) {
    return this.authService.getCurrentUser(authorization);
  }
}
