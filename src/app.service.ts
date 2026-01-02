import { Get, Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  @Get()
  getApiReady() {
    return {
      message: 'API READY!',
      documentation: `http://localhost:5000/api/v1/docs`,
      version: 'v1',
    };
  }
}
