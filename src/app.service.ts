import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getApiReady(): string {
    return 'API READY!';
  }
}
