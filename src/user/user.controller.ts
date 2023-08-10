import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { UserService } from './user.service';
import { ResponseType } from 'src/auth/types';
import { ApiParam } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { UserDto } from './dto/user.dto';

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

  @UseInterceptors(FileInterceptor('avatar'))
  @Put(':id')
  @HttpCode(HttpStatus.CREATED)
  async updateUser(
    @Param('id') id: number,
    @UploadedFile() file: Express.Multer.File,
    @Body() user: UserDto,
  ): Promise<any> {
    return this.userService.updateUser(id, file, user);
  }
}
