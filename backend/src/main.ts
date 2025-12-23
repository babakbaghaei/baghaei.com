import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as dotenv from 'dotenv';
import helmet from 'helmet';
import * as compression from 'compression';
import { OpenTelemetryService } from './observability/opentelemetry.service';
import { SecurityService } from './security/security.service';

// Load environment variables
dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Initialize OpenTelemetry
  const openTelemetryService = app.get(OpenTelemetryService);
  await openTelemetryService.onModuleInit();

  // Apply security middleware
  const securityService = app.get(SecurityService);
  securityService.applySecurityMiddleware(app);

  app.useGlobalPipes(new ValidationPipe());
  app.use(compression());

  const port = process.env.PORT || 3001;
  await app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });

  // Graceful shutdown
  process.on('SIGTERM', async () => {
    console.log('Shutting down gracefully...');
    await openTelemetryService.onModuleDestroy();
    await app.close();
  });

  process.on('SIGINT', async () => {
    console.log('Shutting down gracefully...');
    await openTelemetryService.onModuleDestroy();
    await app.close();
  });
}
bootstrap();
