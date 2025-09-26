import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const origin = 'http://localhost:3000';
  app.useGlobalPipes(new ValidationPipe());
  app.enableCors({
    origin: true, // Permite todas as origens para teste
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Cookie', '*'],
  });
  app.use(cookieParser());

  await app.listen(process.env.PORT ?? 5000);
}
bootstrap();
