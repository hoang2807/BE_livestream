import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifiedCallback, Profile } from 'passport-google-oauth20';

@Injectable()
export class FacebookStrategy extends PassportStrategy(Strategy) {
  constructor(config: ConfigService) {
    super({
      clientID: config.get<string>('GOOGLE_CLIENT_ID'),
      clientSecret: config.get<string>('GOOGLE_SECRET'),
      callbackURL: 'http://localhost:4000/api/v1/auth/google/callback',
      scope: ['email', 'profile'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: Profile,
    done: VerifiedCallback,
  ): Promise<any> {
    const user = {
      accessToken,
      refreshToken,
      profile,
    };
    done(null, user);
  }
}
