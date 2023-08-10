import { Module } from '@nestjs/common';
import { VideosController } from './videos.controller';
// import { VideosService } from './videos.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  controllers: [VideosController],
  // providers: [VideosService],
})
export class VideosModule {}
