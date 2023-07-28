import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthSignupDto, AuthLoginDto } from './dto';
import { ResponseType } from './types';
import { FacebookGuard, RtGuard, GoogleGuard } from 'src/common/guards';
import {
  GetCurrentUser,
  GetCurrentUserId,
  Public,
} from 'src/common/decorators';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {
    this.authService = authService;
  }

  @Public()
  @Get('google')
  @HttpCode(HttpStatus.OK)
  @UseGuards(GoogleGuard)
  google() {
    return HttpStatus.OK;
  }

  @Public()
  @Get('google/callback')
  @HttpCode(HttpStatus.OK)
  @UseGuards(GoogleGuard)
  loginGoogleCallback(@Req() req): Promise<ResponseType> {
    return this.authService.loginGoogle(req);
  }

  @Public()
  @Get('facebook')
  @HttpCode(HttpStatus.OK)
  @UseGuards(FacebookGuard)
  facebook() {
    return HttpStatus.OK;
  }

  @Public()
  @Get('facebook/callback')
  @HttpCode(HttpStatus.OK)
  @UseGuards(FacebookGuard)
  loginFacebookCallback() {
    return HttpStatus.OK;
  }

  @Public()
  @Post('signup')
  @HttpCode(HttpStatus.CREATED)
  signup(@Body() dto: AuthSignupDto): Promise<ResponseType> {
    return this.authService.signup(dto);
  }

  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  login(@Body() dto: AuthLoginDto): Promise<ResponseType> {
    return this.authService.login(dto);
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  logout(@GetCurrentUserId() userId: number) {
    return this.authService.logout(userId);
  }

  @Public()
  @UseGuards(RtGuard)
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  refreshToken(
    @GetCurrentUserId() userId: number,
    @GetCurrentUser('refreshToken') refreshToken: string,
  ) {
    return this.authService.refreshToken(userId, refreshToken);
  }
}
