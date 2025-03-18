import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { dataSource } from './shared/data-source';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { configService } from './config/config.service';
import { json, urlencoded } from 'express';
import * as session from 'express-session';

export async function bootstrap() {
  // dataSource
  //   .initialize()
  //   .then(() => {
  //     /* eslint-disable-next-line no-console */
  //     console.log('Data Source has been initialized!');
  //   })
  //   .catch((err) => {
  //     /* eslint-disable-next-line no-console */
  //     console.error('Error during Data Source initialization', err);
  //   });

  const app = await NestFactory.create(AppModule, { cors: true });
  app.setGlobalPrefix('api');
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );
  app.use(json({ limit: '50mb' }));
  app.use(
    urlencoded({ extended: true, limit: '50mb', parameterLimit: 1000000 }),
  );

  // Use express-session middleware for handling sessions
  app.use(
    session({
      secret: configService.getValue('SESSION_SECRET'),
      resave: false, // Recommended to set to false
      saveUninitialized: false, // Prevents session from being created without login
      cookie: { secure: false }, // set to true if using HTTPS in production
    }),
  );
  // Setup Swagger
  const config = new DocumentBuilder()
    .setTitle('Analytiks-Ai')
    .setDescription('API description')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  });
  // /Setup Swagger

  const port = configService.getValue('PORT');

  await app
    .useGlobalPipes(
      new ValidationPipe({
        forbidNonWhitelisted: true,
        whitelist: true,
      }),
    )
    .listen(port);
}
