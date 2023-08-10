import {
  BadRequestException,
  Body,
  HttpStatus,
  Injectable,
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
      },
    });

    if (!user) {
      throw new BadRequestException('ID invalid', {
        cause: new Error(),
        description: 'ID invalid',
      });
    }

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
    const { username, full_name, avatar_path, phone_number, address } = user;

    const params = {
      file: file.buffer,
      parentId: '',
      relativePath: `/livestream/avatar/${file.originalname}`,
      fileName: file.originalname,
    };

    await this.httpService.uploadFile(params);

    return {
      data: 'success',
      message: 'success',
      statusCode: HttpStatus.OK,
    };
  }
}
