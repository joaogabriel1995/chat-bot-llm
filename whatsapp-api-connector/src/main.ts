import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService)
  app.enableCors({
    origin: '*', // Substitua pelo domínio permitido
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  });
  await app.listen(configService.get<number>("SERVER_PORT"));
  console.info(`Application is running on ${await app.getUrl()}`);
}
bootstrap();
