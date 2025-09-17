import { NestFactory } from '@nestjs/core';
import { ZavodZaStatistikuServiceModule } from './zavod-za-statistiku-service.module';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    ZavodZaStatistikuServiceModule,
    {
      transport: Transport.TCP,
      options: {
        host: 'zavod-service',
        port: 3002,
      },
    },
  );

  // Omogućiti CORS za development
  await app.listen();
  console.log(`Zavod Za Statistiku Service is running on zavod-service`);
}
void bootstrap();
