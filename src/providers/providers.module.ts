import { HttpModule } from '@nestjs/axios';
import { Global, Module } from '@nestjs/common';
import { HttpServiceCloud } from './http/http.service';

@Global()
@Module({
  imports: [
    HttpModule.register({
      baseURL: process.env.CLOUD_API_URL,
    }),
  ],
  providers: [HttpServiceCloud],
  exports: [HttpServiceCloud],
})
export class ProvidersModule {}
