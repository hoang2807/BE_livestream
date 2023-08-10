import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class UserDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  username: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  full_name: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  avatar_path: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  phone_number: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  address: string;
}
