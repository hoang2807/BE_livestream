import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {
    this.authService = authService;
  }
  @Post('/signup')
  signup(@Body() dto: AuthDto) {
    this.authService.signup(dto);
  }

  @Post('/login')
  login() {
    this.authService.login();
  }

  @Post('/logout')
  logout() {
    this.authService.logout();
  }

  @Post('/refresh')
  refreshToken() {
    this.authService.refreshToken;
  }
}
