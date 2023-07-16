import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class AuthLoginDto {
  @ApiProperty({})
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  email: string;

  @ApiProperty({})
  @IsNotEmpty()
  @IsString()
  password: string;
}
