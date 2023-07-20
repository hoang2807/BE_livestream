import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class AuthSignupDto {
  @ApiProperty({})
  @IsNotEmpty()
  @IsString()
  username: string;

  @ApiProperty({})
  @IsNotEmpty()
  @IsString()
  full_name: string;

  @ApiProperty({})
  @IsNotEmpty()
  @IsString()
  password: string;

  @ApiProperty({})
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  email: string;

  @ApiProperty({})
  @IsNotEmpty()
  @IsString()
  phone_number: string;
}
