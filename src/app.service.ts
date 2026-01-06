import { Get, Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  @Get()
  getApiReady() {
    return {
      message: 'API READY!',
      documentation: `/api/v1/docs`,
      version: 'v1',
    };
  }
}
