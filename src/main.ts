import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.setGlobalPrefix('chatApi');
  await app.listen(3000 || 8000);
  
}
bootstrap();
