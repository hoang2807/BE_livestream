import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { JwtModule } from '@nestjs/jwt';
import { AtStrategy, RtStrategy } from 'src/auth/strategies';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [JwtModule.register({}), HttpModule],
  providers: [UserService, RtStrategy, AtStrategy],
  controllers: [UserController],
})
export class UserModule {}
