import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Put,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { UserService } from './user.service';
import { ResponseType } from 'src/auth/types';
import {
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';

import { UserDto } from './dto/user.dto';

@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(private userService: UserService) {
    this.userService = userService;
  }

  @ApiParam({ name: 'id', type: Number })
  @ApiOperation({ summary: 'Get user by id' })
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  getUserById(@Param('id') id: string): Promise<ResponseType> {
    console.log(typeof id);
    return this.userService.getUserById(id);
  }

  @ApiParam({ name: 'id', type: Number })
  @ApiOperation({ summary: 'Update user by id' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        avatar: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @UseInterceptors(FileInterceptor('avatar'))
  @Put(':id')
  @HttpCode(HttpStatus.OK)
  async updateUser(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
    @Body() user: UserDto,
  ): Promise<ResponseType> {
    return this.userService.updateUser(parseInt(id), file, user);
  }

  @ApiParam({ name: 'id', type: Number })
  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async deleteUser(@Param('id') id): Promise<ResponseType> {
    return this.userService.deleteUser(parseInt(id));
  }

  @Get('avatar')
  @ApiOperation({ summary: 'Get avatar by url' })
  @HttpCode(HttpStatus.OK)
  getUrlAvatarUser(@Body() user): ResponseType {
    return this.userService.getUrlAvatarUser(user.avatar_path);
  }
}
