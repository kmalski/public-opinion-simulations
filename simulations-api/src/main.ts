import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { CORS } from './config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: CORS.origin,
    methods: CORS.httpMethods
  });
  await app.listen(4000);
}
bootstrap();
