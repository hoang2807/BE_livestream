import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';

@Controller('videos')
export class VideosController {
  @Get('upload')
  @HttpCode(HttpStatus.CREATED)
  async uploadVideo() {
    return true;
  }
}
