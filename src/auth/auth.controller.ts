import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Redirect,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthSignupDto, AuthLoginDto } from './dto';
import { ResponseType, SocialType, Tokens } from './types';
import { FacebookGuard, RtGuard, GoogleGuard } from 'src/common/guards';
import {
  GetCurrentUser,
  GetCurrentUserId,
  Public,
} from 'src/common/decorators';
import { Request, Response } from 'express';
import { ConfigService } from '@nestjs/config';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService, private config: ConfigService) {
    this.authService = authService;
  }

  @Public()
  @Get('google')
  @HttpCode(HttpStatus.OK)
  @UseGuards(GoogleGuard)
  google(): HttpStatus {
    return HttpStatus.OK;
  }

  @Public()
  @Get('google/callback')
  @HttpCode(HttpStatus.OK)
  @UseGuards(GoogleGuard)
  loginGoogleCallback(@Req() req: Request, @Res() res: Response) {
    const { username, email, avatar } = req.user as SocialType;

    const CLIENT_URL = this.config.get<string>('CLIENT_URL');
    return res.redirect(
      `${CLIENT_URL}/google-oauth-success-redirect/${encodeURIComponent(
        username,
      )}/${encodeURIComponent(email)}/${encodeURIComponent(avatar)}`,
    );
  }

  @Public()
  @Get('facebook')
  @HttpCode(HttpStatus.OK)
  @UseGuards(FacebookGuard)
  facebook(): HttpStatus {
    return HttpStatus.OK;
  }

  @Public()
  @Get('facebook/callback')
  @HttpCode(HttpStatus.OK)
  @UseGuards(FacebookGuard)
  loginFacebookCallback(): HttpStatus {
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
  ): Promise<Tokens> {
    return this.authService.refreshToken(userId, refreshToken);
  }
}
