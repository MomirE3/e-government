import { NestFactory } from '@nestjs/core';
import { ZavodZaStatistikuServiceModule } from './zavod-za-statistiku-service.module';

async function bootstrap() {
  const app = await NestFactory.create(ZavodZaStatistikuServiceModule);
  await app.listen(process.env.port ?? 8082);
}
bootstrap();
