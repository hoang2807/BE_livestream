import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthSignupDto, AuthLoginDto } from './dto';
import * as bcrypt from 'bcrypt';
import { SignupType, Tokens } from './types';
import { JwtService } from '@nestjs/jwt';
import { LoginType } from './types/auth/login.type';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService, private jwtService: JwtService) {}

  async signup(dto: AuthSignupDto): Promise<SignupType> {
    const emailExists = await this.prisma.user.findUnique({
      where: {
        email: dto.email,
      },
    });

    if (emailExists) throw new ForbiddenException('Email exists');

    const usernameExists = await this.prisma.user.findUnique({
      where: {
        username: dto.username,
      },
    });

    if (usernameExists) throw new ForbiddenException('Username exists');

    const hash = await this.hashData(dto.password);
    const newUser = await this.prisma.user.create({
      data: {
        username: dto.username,
        full_name: dto.full_name,
        email: dto.email,
        phone_number: dto.phone_number,
        hash,
      },
    });

    const tokens = await this.getTokens(newUser.id, newUser.email);
    await this.updateRtHash(newUser.id, tokens.refresh_token);

    const data = {
      username: dto.username,
      fullname: dto.full_name,
      email: dto.email,
      phone_number: dto.phone_number,
      access_token: tokens.access_token,
      exp_access_token: tokens.exp_access_token,
      refresh_token: tokens.refresh_token,
      exp_refresh_token: tokens.exp_refresh_token,
    };
    return data;
  }

  async login(dto: AuthLoginDto): Promise<LoginType> {
    const user = await this.prisma.user.findUnique({
      where: {
        email: dto.email,
      },
    });

    if (!user) throw new ForbiddenException('Username or password invalid');

    const passwordMatches = await bcrypt.compare(dto.password, user.hash);

    if (!passwordMatches)
      throw new ForbiddenException('Username or password invalid');

    const tokens = await this.getTokens(user.id, user.email);
    await this.updateRtHash(user.id, tokens.refresh_token);

    const data = {
      username: user.username,
      fullname: user.full_name,
      email: user.email,
      phone_number: user.phone_number,
      access_token: tokens.access_token,
      exp_access_token: tokens.exp_access_token,
      refresh_token: tokens.refresh_token,
      exp_refresh_token: tokens.exp_refresh_token,
    };

    return data;
  }

  async logout(userId: number) {
    await this.prisma.user.updateMany({
      where: {
        id: userId,
        hashedRT: {
          not: null,
        },
      },
      data: {
        hashedRT: null,
      },
    });
    return true;
  }

  async refreshToken(userId: number, rt: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!user || !user.hashedRT) throw new ForbiddenException('Access Denied');

    const rhMatches = bcrypt.compare(rt, user.hashedRT);

    if (!rhMatches) throw new ForbiddenException('Access Denied');

    const tokens = await this.getTokens(user.id, user.email);
    await this.updateRtHash(user.id, tokens.refresh_token);
    return tokens;
  }

  hashData(data: string) {
    return bcrypt.hash(data, 10);
  }

  async getTokens(userId: number, email: string): Promise<Tokens> {
    const [at, rt] = await Promise.all([
      this.jwtService.signAsync(
        {
          sub: userId,
          email,
        },
        {
          secret: 'at-secret',
          expiresIn: 60 * 15,
        },
      ),
      this.jwtService.signAsync(
        {
          sub: userId,
          email,
        },
        {
          secret: 'rt-secret',
          expiresIn: 60 * 60 * 24 * 7,
        },
      ),
    ]);

    return {
      access_token: at,
      exp_access_token: new Date().getTime() + 15 * 60 * 1000,
      refresh_token: rt,
      exp_refresh_token: new Date().getTime() + 7 * 24 * 60 * 60 * 1000,
    };
  }

  async updateRtHash(userId: number, rt: string) {
    const hash = await this.hashData(rt);
    await this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        hashedRT: hash,
      },
    });
  }
}
