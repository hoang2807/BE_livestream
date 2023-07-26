import { HttpService } from '@nestjs/axios';

export class HttpServiceCloud {
  constructor(private readonly httpService: HttpService) {}
  public async uploadFile(params) {
    return this.httpService.post('https://helurl.com/api/v1/uploads', params);
  }
}
