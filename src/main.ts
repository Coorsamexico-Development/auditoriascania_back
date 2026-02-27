import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

// Forzar la zona horaria a la Ciudad de México globalmente para la aplicación o leerla de las variables de entorno
process.env.TZ = process.env.TZ || 'America/Mexico_City';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  await app.listen(process.env.PORT ?? 3001, '0.0.0.0');
}
bootstrap();
