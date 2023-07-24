import {
  ForbiddenException,
  Injectable,
  UnprocessableEntityException,
  UnauthorizedException,
  HttpStatus,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthSignupDto, AuthLoginDto } from './dto';
import * as bcrypt from 'bcrypt';
import { Tokens, ResponseType, SignupType } from './types';
import { JwtService } from '@nestjs/jwt';
import { LoginType } from './types/auth/login.type';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService, private jwtService: JwtService) {}

  async signup(dto: AuthSignupDto): Promise<ResponseType> {
    const emailExists = await this.prisma.user.findUnique({
      where: {
        email: dto.email,
      },
    });

    if (emailExists)
      throw new UnprocessableEntityException('Email exists', {
        cause: new Error(),
        description: 'Email exists',
      });

    const usernameExists = await this.prisma.user.findUnique({
      where: {
        username: dto.username,
      },
    });

    if (usernameExists)
      throw new UnprocessableEntityException('Username exists', {
        cause: new Error(),
        description: 'Username exists',
      });

    const hash = await this.hashData(dto.password);
    const newUser = await this.prisma.user.create({
      data: {
        username: dto.username,
        full_name: dto.full_name,
        email: dto.email,
        phone_number: dto.phone_number,
        address: dto.address,
        hash,
      },
    });

    const tokens = await this.getTokens(newUser.id, newUser.email);
    await this.updateRtHash(newUser.id, tokens.refresh_token);

    const data: SignupType = {
      username: dto.username,
      fullname: dto.full_name,
      email: dto.email,
      phone_number: dto.phone_number,
      address: dto.address,
      access_token: tokens.access_token,
      exp_access_token: tokens.exp_access_token,
      refresh_token: tokens.refresh_token,
      exp_refresh_token: tokens.exp_refresh_token,
      createAt: new Date(newUser.createAt).toISOString(),
      updateAt: new Date(newUser.updateAt).toISOString(),
    };

    return {
      data,
      message: 'Signup success',
      statusCode: HttpStatus.CREATED,
    };
  }

  async login(dto: AuthLoginDto): Promise<ResponseType> {
    const user = await this.prisma.user.findUnique({
      where: {
        email: dto.email,
      },
    });

    if (!user)
      throw new UnauthorizedException('Username or password invalid', {
        cause: new Error(),
        description: 'Username or password invalid',
      });

    const passwordMatches = await bcrypt.compare(dto.password, user.hash);

    if (!passwordMatches)
      throw new UnauthorizedException('Username or password invalid', {
        cause: new Error(),
        description: 'Username or password invalid',
      });

    const tokens = await this.getTokens(user.id, user.email);
    await this.updateRtHash(user.id, tokens.refresh_token);

    const data: LoginType = {
      username: user.username,
      fullname: user.full_name,
      email: user.email,
      phone_number: user.phone_number,
      address: user.address,
      access_token: tokens.access_token,
      exp_access_token: tokens.exp_access_token,
      refresh_token: tokens.refresh_token,
      exp_refresh_token: tokens.exp_refresh_token,
      createAt: new Date(user.createAt).toISOString(),
      updateAt: new Date(user.updateAt).toISOString(),
    };

    return {
      data,
      message: 'Login success',
      statusCode: HttpStatus.OK,
    };
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
          expiresIn: 60 * 60 * 24 * 3,
        },
      ),
    ]);

    return {
      access_token: at,
      exp_access_token: new Date(
        new Date().getTime() + 15 * 60 * 1000,
      ).toISOString(),
      refresh_token: rt,
      exp_refresh_token: new Date(
        new Date().getTime() + 3 * 24 * 60 * 60 * 1000,
      ).toISOString(),
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
