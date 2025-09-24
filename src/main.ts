// main.ts
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import cookieParser from 'cookie-parser';
import { patchNestJsSwagger } from 'nestjs-zod';
import envConfig from 'src/shared/config';
import { AppModule } from './app.module';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(cookieParser());
  // ✅ Swagger setup (optional if using @nestjs/swagger)
  patchNestJsSwagger();
  const config = new DocumentBuilder()
    .setTitle('Tira-checking API')
    .setDescription('Tira-checking API with JWT tokens')
    .setVersion('1.0')
    .addTag('Products', 'Product related endpoints')
    .addBearerAuth()
    // Thêm nhiều server để chọn
    .addServer(`http://localhost:${envConfig.PORT}`, 'Local development server')
    .addServer('https://api.tira.click', 'Production API')
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('api-docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
      tagsSorter: 'alpha',
      operationsSorter: 'alpha',
    },
    customSiteTitle: 'Auth API Documentation',
    customCss: '.swagger-ui .topbar { display: none }',
  });

  // CORS
  app.enableCors({
    origin: [
      `http://localhost:${envConfig.PORT}`,
      'http://localhost:3000',
      'https://api.tira.click/',
    ],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });
  const port = envConfig.PORT || 3000;
  await app.listen(port);

  console.log(`Application is running on: ${await app.getUrl()}`);
  console.log(
    `Swagger documentation available at: ${await app.getUrl()}/api-docs`,
  );
}

bootstrap();
