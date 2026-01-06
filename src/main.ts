import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const origin = 'http://localhost:3000';
  app.useGlobalPipes(new ValidationPipe());
  app.enableCors({
    origin,
    credentials: true,
    // methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    // allowedHeaders: ['Content-Type', 'Authorization'],
  });
  app.use(cookieParser());

  await app.listen(5000, '0.0.0.0');
  console.log(await app.getUrl());
}
bootstrap();
