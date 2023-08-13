import {
  Body,
  Controller,
  Delete,
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

  @ApiParam({ name: 'id', type: Number })
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  getUserById(@Param('id') id: string): Promise<ResponseType> {
    console.log(typeof id);
    return this.userService.getUserById(id);
  }

  @ApiParam({ name: 'id', type: Number })
  @UseInterceptors(FileInterceptor('avatar'))
  @Put(':id')
  @HttpCode(HttpStatus.OK)
  async updateUser(
    @Param('id') id,
    @UploadedFile() file: Express.Multer.File,
    @Body() user: UserDto,
  ): Promise<any> {
    return this.userService.updateUser(parseInt(id), file, user);
  }

  @ApiParam({ name: 'id', type: Number })
  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async deleteUser(@Param('id') id): Promise<ResponseType> {
    return this.userService.deleteUser(parseInt(id));
  }
}
