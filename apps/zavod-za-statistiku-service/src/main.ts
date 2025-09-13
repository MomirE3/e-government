import { NestFactory } from '@nestjs/core';
import { ZavodZaStatistikuServiceModule } from './zavod-za-statistiku-service.module';

async function bootstrap() {
  const app = await NestFactory.create(ZavodZaStatistikuServiceModule);

  // Omogućiti CORS za development
  app.enableCors();

  const port = process.env.PORT ?? 3000;
  await app.listen(port);
  console.log(`Zavod za statistiku Service is running on port ${port}`);
}
void bootstrap();
