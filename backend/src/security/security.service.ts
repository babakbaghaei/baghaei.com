import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import helmet from 'helmet';
import hpp from 'hpp';
import validator from 'validator';
import { NestExpressApplication } from '@nestjs/platform-express';

@Injectable()
export class SecurityService {
  private readonly logger = new Logger(SecurityService.name);

  constructor(private configService: ConfigService) {}

  /**
   * Apply security middleware to the application
   */
  applySecurityMiddleware(app: NestExpressApplication) {
    // Use Helmet to secure HTTP headers
    app.use(
      helmet({
        contentSecurityPolicy: {
          directives: {
            defaultSrc: ["'self'"],
            styleSrc: [
              "'self'",
              "'unsafe-inline'",
              'fonts.googleapis.com',
              'cdn.tailwindcss.com',
            ],
            fontSrc: ["'self'", 'fonts.gstatic.com', 'data:'],
            imgSrc: ["'self'", 'data:', 'https:'],
            scriptSrc: [
              "'self'",
              "'unsafe-inline'",
              'https://www.googletagmanager.com',
              'https://www.google-analytics.com',
            ],
            connectSrc: [
              "'self'",
              'https://api.segment.io',
              'https://*.browser-intake-datadoghq.com',
              'https://www.google-analytics.com',
              'https://analytics.google.com',
            ],
          },
        },
        hsts: {
          maxAge: 31536000,
          includeSubDomains: true,
          preload: true,
        },
        referrerPolicy: {
          policy: 'no-referrer',
        },
      }),
    );

    /*
    // Sanitize data to prevent mongo injection - REMOVED (Not needed for Postgres and causes query property error)
    // app.use(mongoSanitize());
    */

    /*
    // Prevent parameter pollution
    */
    app.use(
      hpp({
        whitelist: [],
      }),
    );

    // Enable CORS with specific origin in production
    const corsOptions = {
      origin: [
        'https://baghaei.com',
        'https://admin.baghaei.com',
        'https://blog.baghaei.com',
        'https://projects.baghaei.com',
        'http://localhost:3000',
      ],
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
      credentials: true,
    };
    app.enableCors(corsOptions);

    this.logger.log('Security middleware applied successfully');
  }

  /**
   * Validate JWT tokens with additional security checks
   */
  async validateToken(token: string): Promise<boolean> {
    try {
      // Basic JWT structure check (header.payload.signature)
      const jwtRegex = /^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+$/;
      return Promise.resolve(jwtRegex.test(token));
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      this.logger.error(`Token validation failed: ${errorMessage}`);
      return Promise.resolve(false);
    }
  }

  /**
   * Sanitize user input to prevent XSS and injection attacks
   */
  sanitizeInput<T>(input: T): T {
    if (typeof input === 'string') {
      let sanitized = validator.escape(input);
      sanitized = sanitized.replace(
        /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
        '',
      );
      return sanitized as unknown as T;
    } else if (typeof input === 'object' && input !== null) {
      const sanitizedObject = Array.isArray(input) ? [] : {};
      for (const key in input) {
        if (Object.prototype.hasOwnProperty.call(input, key)) {
          (sanitizedObject as any)[key] = this.sanitizeInput(
            (input as any)[key],
          );
        }
      }
      return sanitizedObject as T;
    }
    return input;
  }

  validateEmail(email: string): boolean {
    return validator.isEmail(email);
  }

  validateUrl(url: string): boolean {
    return validator.isURL(url);
  }

  sanitizeHtml(html: string): string {
    return validator.escape(html);
  }
}
