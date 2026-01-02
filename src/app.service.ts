import { Get, Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  @Get()
  getApiReady() {
    return {
      message: 'API READY!',
      documentation: `${process.env.APP_URL}/api/v1`,
      version: 'v1',
    };
  }
}
