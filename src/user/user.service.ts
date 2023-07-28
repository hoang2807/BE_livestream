import { BadRequestException, HttpStatus, Injectable } from '@nestjs/common';
import { ResponseType } from 'src/auth/types';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(private prismaService: PrismaService) {}

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
}
