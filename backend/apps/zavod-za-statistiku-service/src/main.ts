import { NestFactory } from '@nestjs/core';
import { ZavodZaStatistikuServiceModule } from './zavod-za-statistiku-service.module';
import { join } from 'path';
import * as express from 'express';

async function bootstrap() {
  const app = await NestFactory.create(ZavodZaStatistikuServiceModule);

  app.enableCors();

  app.use('/survey', express.static(join(__dirname, '..', 'public', 'survey')));

  const port = process.env.PORT ?? 3000;
  await app.listen(port);
  console.log(`Zavod za statistiku Service is running on port ${port}`);
}
void bootstrap();
