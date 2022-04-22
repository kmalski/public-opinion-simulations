import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { json } from 'body-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(json({ limit: '50mb' }));
  app.enableCors({
    origin: [/localhost:[0-9]{4}/, /127\.0\.0\.1:[0-9]{4}/, /simulations-api:[0-9]{4}/, /\.malski\.pl$/],
    methods: ['GET', 'POST']
  });
  await app.listen(4000);
}
bootstrap();
