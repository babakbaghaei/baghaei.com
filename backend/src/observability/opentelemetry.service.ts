import {
  Injectable,
  Logger,
  OnModuleInit,
  OnModuleDestroy,
} from '@nestjs/common';
import { JaegerExporter } from '@opentelemetry/exporter-jaeger';
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';
import { PrometheusExporter } from '@opentelemetry/exporter-prometheus';
import { PeriodicExportingMetricReader } from '@opentelemetry/sdk-metrics';
import { NodeSDK } from '@opentelemetry/sdk-node';
import { Resource } from '@opentelemetry/resources';
import {
  ATTR_SERVICE_NAME,
  ATTR_SERVICE_VERSION,
} from '@opentelemetry/semantic-conventions';

@Injectable()
export class OpenTelemetryService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(OpenTelemetryService.name);
  private sdk: NodeSDK;

  async onModuleInit() {
    // Configure OpenTelemetry SDK
    this.sdk = new NodeSDK({
      resource: new Resource({
        [ATTR_SERVICE_NAME]: process.env.SERVICE_NAME || 'baghaei-backend',
        [ATTR_SERVICE_VERSION]: process.env.SERVICE_VERSION || '1.0.0',
      }),
      metricReader: new PeriodicExportingMetricReader({
        exporter: new PrometheusExporter({
          port: 9464, // Default Prometheus metrics port
        }) as any,
      }),
      traceExporter: new JaegerExporter({
        host: process.env.JAEGER_HOST || 'localhost',
        port: 6832,
      }) as any,
      instrumentations: [getNodeAutoInstrumentations()],
    });

    try {
      this.sdk.start();
      this.logger.log('OpenTelemetry SDK started successfully');
    } catch (error) {
      this.logger.error(`Failed to start OpenTelemetry SDK: ${error.message}`);
    }
  }

  async onModuleDestroy() {
    try {
      if (this.sdk) {
        await this.sdk.shutdown();
        this.logger.log('OpenTelemetry SDK shut down successfully');
      }
    } catch (error) {
      this.logger.error(
        `Error shutting down OpenTelemetry SDK: ${error.message}`,
      );
    }
  }
}
