import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags } from '@nestjs/swagger';
import { ResponseType } from 'src/type/response.type';
import { VideoUploadDto } from 'src/videos/dto/video.upload.dto';
import { VideosService } from 'src/videos/videos.service';

@ApiTags('Video')
@Controller('video')
export class VideosController {
  constructor(private videoService: VideosService) {
    this.videoService = videoService;
  }

  @Post('upload/:id')
  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(FileInterceptor('file'))
  async uploadVideo(
    @Body() video: VideoUploadDto,
    @Param() id: string,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<ResponseType> {
    return this.videoService.uploadVideo(parseInt(id), video, file);
  }
}
