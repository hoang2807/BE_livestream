import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AtGuard } from './common/guards';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.setGlobalPrefix('api/v1');

  const config = new DocumentBuilder()
    .addBearerAuth()
    .setTitle('LiveStream')
    .setDescription('LiveStream API')
    .setVersion('1.0')
    .addTag('LiveStream')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/v1/swagger', app, document);

  app.useGlobalPipes(new ValidationPipe());
  // app.useGlobalGuards(new AtGuard());
  await app.listen(4000);
}
bootstrap();
