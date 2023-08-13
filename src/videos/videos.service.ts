import { Body, HttpStatus, Injectable, UploadedFile } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { HttpServiceCloud } from 'src/providers/http/http.service';
import { CloudParamsType } from 'src/type/cloud_param.type';
import { ResponseType } from 'src/type/response.type';
import { VideoUploadDto } from 'src/videos/dto/video.upload.dto';

@Injectable()
export class VideosService {
  constructor(
    private prismaService: PrismaService,
    private httpService: HttpServiceCloud,
  ) {}
  async uploadVideo(
    userId: number,
    @Body() video: VideoUploadDto,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<ResponseType> {
    const { title, category } = video;

    // const params: CloudParamsType = {
    //   file: file.buffer,
    //   parentId: '',

    // };

    const response = {
      data: '',
      message: '',
      statusCode: HttpStatus.OK,
    };

    return response;
  }
}
