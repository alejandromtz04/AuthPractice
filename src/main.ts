import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {

  const app = await NestFactory.create(AppModule);
  await app.setGlobalPrefix('chatApi');
  await app.listen(3000);

  await app.enableCors({
    origin: 'http://AlmasZWebUWUSV.com', // this is an example
    methods: 'GET, POST, PUT, PATCH, DELETE', // allowed methods
    allowedHeaders: 'Content-Type, Accept', // allowed headers
    credentials: true, // allow cockies
    optionsSuccessStatus: 204 // succes response to options
  })
  
}
bootstrap();
