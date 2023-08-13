import {
  BadRequestException,
  Body,
  HttpStatus,
  Injectable,
  UnprocessableEntityException,
  UploadedFile,
} from '@nestjs/common';
import { ResponseType } from 'src/auth/types';
import { PrismaService } from 'src/prisma/prisma.service';
import { HttpServiceCloud } from 'src/providers/http/http.service';
import { UserDto } from './dto/user.dto';

@Injectable()
export class UserService {
  constructor(
    private prismaService: PrismaService,
    private readonly httpService: HttpServiceCloud,
  ) {}

  async getUserById(id: string): Promise<ResponseType> {
    const user_id: number = parseInt(id);
    const user = await this.prismaService.user.findUnique({
      where: {
        id: user_id,
      },
      select: {
        id: true,
        createAt: true,
        updateAt: true,
        username: true,
        full_name: true,
        email: true,
        phone_number: true,
        address: true,
        avatar_path: true,
      },
    });

    if (!user)
      throw new BadRequestException('ID invalid', {
        cause: new Error(),
        description: 'ID invalid',
      });

    return {
      data: user,
      message: 'success',
      statusCode: HttpStatus.OK,
    };
  }

  async updateUser(
    id: number,
    @UploadedFile() file: Express.Multer.File,
    @Body() user: UserDto,
  ): Promise<ResponseType> {
    const { username, full_name, phone_number, address } = user;

    const params = {
      file: file.buffer,
      parentId: '',
      relativePath: `/livestream/avatar/${file.originalname}`,
      fileName: file.originalname,
    };

    const userExits = await this.prismaService.user.findUnique({
      where: {
        id,
      },
    });

    // check if id invalid
    if (!userExits)
      throw new BadRequestException('ID invalid', {
        cause: new Error(),
        description: 'ID invalid',
      });

    const count = await this.prismaService.user.count({
      where: {
        username: username,
      },
    });

    if (!(userExits.username === username && count === 1))
      throw new UnprocessableEntityException('Username exits', {
        cause: new Error(),
        description: 'Username exits',
      });

    const data = await this.httpService.uploadFile(params);
    console.log('84', `file-entries/${data.fileEntry.id}/shareable-link`);
    await this.prismaService.user.update({
      where: {
        id,
      },
      data: {
        avatar_path: `file-entries/${data.fileEntry.id}/shareable-link`,
      },
    });

    return {
      data: 'success',
      message: 'Update user success',
      statusCode: HttpStatus.OK,
    };
  }

  async deleteUser(id: number): Promise<ResponseType> {
    const userExits = await this.prismaService.user.findUnique({
      where: {
        id,
      },
    });

    if (!userExits)
      throw new BadRequestException('ID invalid', {
        cause: new Error(),
        description: 'ID invalid',
      });

    await this.prismaService.user.delete({
      where: {
        id,
      },
    });

    return {
      data: 'success',
      message: 'Delete user success',
      statusCode: HttpStatus.OK,
    };
  }
}
