import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const logger = new Logger('Bootstrap');

  // Configuración de CORS
  app.enableCors({
    origin: configService.get('CORS_ORIGIN') || '*',
    credentials: true,
  });

  // Prefijo global de API
  const apiPrefix = configService.get('API_PREFIX') || 'api';
  const apiVersion = configService.get('API_VERSION') || 'v1';
  app.setGlobalPrefix(`${apiPrefix}/${apiVersion}`);

  // Validación global
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // Filtros e interceptores globales
  app.useGlobalFilters(new AllExceptionsFilter());
  app.useGlobalInterceptors(
    new LoggingInterceptor(),
    new TransformInterceptor(),
  );

  // Configuración de Swagger
  const config = new DocumentBuilder()
    .setTitle('NegocioYA API')
    .setDescription(
      'API profesional para el sistema de gestión empresarial NegocioYA',
    )
    .setVersion('1.0')
    .addBearerAuth()
    .addTag('Autenticación', 'Endpoints de autenticación y autorización')
    .addTag('Usuarios', 'Gestión de usuarios del sistema')
    .addTag('Productos', 'Gestión de inventario y productos')
    .addTag('Clientes', 'Gestión de clientes')
    .addTag('Ventas', 'Registro y gestión de ventas')
    .addTag('Dashboard', 'Estadísticas y reportes')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document, {
    customSiteTitle: 'NegocioYA API Documentation',
    customCss: `
      .topbar { background-color: #10375C; }
      .swagger-ui .topbar-wrapper img { content: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 50"><text x="10" y="35" font-family="Arial" font-size="24" fill="%232AB7B7" font-weight="bold">NegocioYA</text></svg>'); }
    `,
  });

  const port = configService.get('PORT') || 3000;
  await app.listen(port);

  logger.log(`🚀 Aplicación iniciada en: http://localhost:${port}`);
  logger.log(`📚 Documentación disponible en: http://localhost:${port}/api/docs`);
  logger.log(`🎨 Identidad: Azul #10375C | Turquesa #2AB7B7`);
}

bootstrap();
