import { NestFactory } from '@nestjs/core';
import { MupGradjaniServiceModule } from './mup-gradjani-service.module';

async function bootstrap() {
  const app = await NestFactory.create(MupGradjaniServiceModule);
  await app.listen(process.env.port ?? 8081);
}
bootstrap();
