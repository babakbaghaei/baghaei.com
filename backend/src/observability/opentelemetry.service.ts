import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { JaegerExporter } from '@opentelemetry/exporter-jaeger';
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';
import { PrometheusExporter } from '@opentelemetry/exporter-prometheus';
import { PeriodicExportingMetricReader } from '@opentelemetry/sdk-metrics';
import { NodeSDK } from '@opentelemetry/sdk-node';
import { Resource } from '@opentelemetry/resources';
import { SemanticResourceAttributes } from '@opentelemetry/semantic-conventions';

@Injectable()
export class OpenTelemetryService implements OnModuleInit {
  private readonly logger = new Logger(OpenTelemetryService.name);
  private sdk: NodeSDK;

  async onModuleInit() {
    // Configure OpenTelemetry SDK
    this.sdk = new NodeSDK({
      resource: new Resource({
        [SemanticResourceAttributes.SERVICE_NAME]: process.env.SERVICE_NAME || 'baghaei-backend',
        [SemanticResourceAttributes.SERVICE_VERSION]: process.env.SERVICE_VERSION || '1.0.0',
      }),
      metricReader: new PeriodicExportingMetricReader({
        exporter: new PrometheusExporter({
          port: 9464, // Default Prometheus metrics port
        }),
      }),
      // For development, we'll also export to Jaeger for tracing
      // In production, you might want to use OTLP exporters
      traceExporter: new JaegerExporter({
        host: process.env.JAEGER_HOST || 'localhost',
        port: parseInt(process.env.JAEGER_PORT || '6832'),
      }),
      instrumentations: [getNodeAutoInstrumentations()],
    });

    try {
      await this.sdk.start();
      this.logger.log('OpenTelemetry SDK started successfully');
    } catch (error) {
      this.logger.error(`Failed to start OpenTelemetry SDK: ${error.message}`);
    }
  }

  async onModuleDestroy() {
    try {
      await this.sdk?.shutdown();
      this.logger.log('OpenTelemetry SDK shut down successfully');
    } catch (error) {
      this.logger.error(`Error shutting down OpenTelemetry SDK: ${error.message}`);
    }
  }
}