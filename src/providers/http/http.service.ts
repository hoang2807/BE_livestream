import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { firstValueFrom, lastValueFrom } from 'rxjs';
import * as FormData from 'form-data';

@Injectable()
export class HttpServiceCloud {
  constructor(private readonly httpService: HttpService) {}
  public async uploadFile(params) {
    try {
      const formData = new FormData();
      formData.append('file', params.file, { filename: params.fileName });
      formData.append('parentId', params.parentId);
      formData.append('relativePath', params.relativePath);
      const res = await firstValueFrom(
        this.httpService.post(
          this.httpService.axiosRef.defaults.baseURL + '/uploads',
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
              Authorization: `Bearer ${process.env.CLOUD_API_TOKEN}`,
            },
          },
        ),
      );
      return res.data;
    } catch (error) {
      console.log(error);
    }
  }
}
