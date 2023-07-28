import { Controller, Get, HttpCode, HttpStatus, Param } from '@nestjs/common';
import { UserService } from './user.service';
import { ResponseType } from 'src/auth/types';
import { ApiParam } from '@nestjs/swagger';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {
    this.userService = userService;
  }

  @ApiParam({ name: 'id', type: String })
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  getUserById(@Param('id') id: string): Promise<ResponseType> {
    console.log(typeof id);
    return this.userService.getUserById(id);
  }
}
