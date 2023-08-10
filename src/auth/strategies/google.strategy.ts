import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifiedCallback, Profile } from 'passport-google-oauth20';
import { SocialType } from '../types';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor() {
    super({
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_SECRET,
      callbackURL: process.env.CALLBACK_GOOGLE_URL,
      scope: ['email', 'profile'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: Profile,
    done: VerifiedCallback,
  ): Promise<any> {
    const user: SocialType = {
      username: profile._json.name,
      email: profile._json.email,
      avatar: profile.photos[0].value,
    };
    done(null, user);
  }
}
