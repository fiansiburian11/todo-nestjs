import { INestApplication } from '@nestjs/common';
import { SwaggerModule } from '@nestjs/swagger';
import { swaggerConfig } from './swagger.config';

export class SwaggerSetup {
  static setup(app: INestApplication) {
    const document = SwaggerModule.createDocument(app, swaggerConfig, {
      operationIdFactory: (controllerKey: string, methodKey: string) =>
        `${controllerKey}_${methodKey}`,
    });

    // Karena kamu pakai globalPrefix '/api/v1', maka URL docs jadi:
    // http://localhost:3000/api/v1/docs
    SwaggerModule.setup('/api/v1/docs', app, document, {
      swaggerOptions: { persistAuthorization: true },
    });
  }
}
