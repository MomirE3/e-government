import { NestFactory } from '@nestjs/core';
import { MupGradjaniServiceModule } from './mup-gradjani-service.module';

async function bootstrap() {
  const app = await NestFactory.create(MupGradjaniServiceModule);

  // Omogućiti CORS za development
  app.enableCors();

  const port = process.env.PORT ?? 3000;
  await app.listen(port);
  console.log(`MUP Gradjani Service is running on port ${port}`);
}
void bootstrap();
