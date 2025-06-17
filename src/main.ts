import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const logger = new Logger('Bootstrap');

  try {
    const app = await NestFactory.create(AppModule, {
      logger: ['error', 'warn', 'log', 'debug', 'verbose'],
    });

    // Configuración de seguridad básica
    app.enableCors({
      origin: process.env.ALLOWED_ORIGINS?.split(',') || false,
      credentials: true,
    });

    const port = process.env.PORT ?? 3000;
    await app.listen(port);

    logger.log(`🚀 Bot iniciado en el puerto ${port}`);
    logger.log(`📊 Modo: ${process.env.NODE_ENV || 'development'}`);
  } catch (error) {
    logger.error('❌ Error al iniciar la aplicación:', error);
    process.exit(1);
  }
}

// Manejo de señales de terminación
process.on('SIGTERM', () => {
  Logger.log('SIGTERM recibido, cerrando aplicación...');
  process.exit(0);
});

process.on('SIGINT', () => {
  Logger.log('SIGINT recibido, cerrando aplicación...');
  process.exit(0);
});

bootstrap().catch((error) => {
  Logger.error('Error fatal durante el bootstrap:', error);
  process.exit(1);
});
