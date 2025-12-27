import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { LoggerModule } from 'nestjs-pino';
import { PrometheusModule } from '@willsoto/nestjs-prometheus';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { ProjectsModule } from './projects/projects.module';
import { ContactModule } from './contact/contact.module';
import { AuthModule } from './auth/auth.module';
import { OpenTelemetryModule } from './observability/opentelemetry.module';
import { SecurityModule } from './security/security.module';
import { HealthModule } from './health/health.module';
import { ServicesModule } from './services/services.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 60, // Increased to 60 req/min for better UX
      },
    ]),
    LoggerModule.forRoot({
      pinoHttp: {
        transport:
          process.env.NODE_ENV === 'production'
            ? {
                target: 'pino/file',
                options: { destination: './logs/app.log', mkdir: true },
              }
            : {
                target: 'pino-pretty',
                options: { colorize: true, singleLine: true },
              },
        level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
      },
    }),
    PrometheusModule.register(),
    PrismaModule,
    ProjectsModule,
    ContactModule,
    AuthModule,
    OpenTelemetryModule,
    SecurityModule,
    HealthModule,
    ServicesModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
