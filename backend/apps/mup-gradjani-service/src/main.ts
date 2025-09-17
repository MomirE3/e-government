import { NestFactory } from '@nestjs/core';
import { MupGradjaniServiceModule } from './mup-gradjani-service.module';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    MupGradjaniServiceModule,
    {
      transport: Transport.TCP,
      options: {
        host: 'mup-service',
        port: 3001,
      },
    },
  );

  // Omogućiti CORS za development
  await app.listen();
  console.log(`MUP Gradjani Service is running on mup-service`);
}
void bootstrap();
