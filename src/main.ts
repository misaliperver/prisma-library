import { ApplicationConfig, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common/pipes';
import { NestExpressApplication } from '@nestjs/platform-express';
import { OpenAPIObject, DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ApiServerConfig } from './apiserver.config';

function buildAPIDocumentation(app: NestExpressApplication): void {
  const title: string = 'IPoster';
  const description: string = 'IPoster API documentation';
  const version: string = '1.0.0';
  
  const options: Omit<OpenAPIObject, 'paths'> = new DocumentBuilder()
    .setTitle(title)
    .setDescription(description)
    .setVersion(version)
    .build();
  
  const document: OpenAPIObject = SwaggerModule.createDocument(app, options);
  
  SwaggerModule.setup(ApiServerConfig.DOC_PATH, app, document);
}

async function bootstrap() {
  const app: NestExpressApplication = await NestFactory.create<NestExpressApplication>(AppModule);

  app.useGlobalPipes(new ValidationPipe());

  buildAPIDocumentation(app);

  await app.listen(ApiServerConfig.PORT);

  console.log('Application url:', `${await app.getUrl()}`);
  console.log('Documentation url:', `${await app.getUrl()}/${ApiServerConfig.DOC_PATH}`)
}

bootstrap();
