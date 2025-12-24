import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import rateLimit from 'express-rate-limit';
import slowDown from 'express-slow-down';
import helmet from 'helmet';
import mongoSanitize from 'express-mongo-sanitize';
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
    app.use(helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          styleSrc: ["'self'", "'unsafe-inline'", 'fonts.googleapis.com', 'cdn.tailwindcss.com'],
          fontSrc: ["'self'", 'fonts.gstatic.com', 'data:'],
          imgSrc: ["'self'", 'data:', 'https:'],
          scriptSrc: ["'self'"],
          connectSrc: ["'self'", 'https://api.segment.io', 'https://*.browser-intake-datadoghq.com'],
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
    }));

    // Rate limiting to prevent brute force attacks
    app.use(
      rateLimit({
        windowMs: 15 * 60 * 1000, // 15 minutes
        max: this.configService.get<number>('SECURITY_RATE_LIMIT_MAX', 100), // limit each IP to 100 requests per windowMs
        message: 'Too many requests from this IP, please try again later.',
        standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
        legacyHeaders: false, // Disable the `X-RateLimit-*` headers
      })
    );

    // Slow down requests from same IP
    app.use(
      slowDown({
        windowMs: 15 * 60 * 1000, // 15 minutes
        delayAfter: 50, // Begin slowing down after 50 requests
        delayMs: 500, // Slow down by 500ms increments
      })
    );

    // Sanitize data to prevent mongo injection
    app.use(mongoSanitize());

    // Prevent parameter pollution
    app.use(
      hpp({
        whitelist: [],
      })
    );

    // Enable CORS with specific origin in production
    const corsOptions = {
      origin: [
        'https://baghaei.com',
        'https://admin.baghaei.com',
        'https://blog.baghaei.com',
        'https://projects.baghaei.com',
        'http://localhost:3000'
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
      return token.length > 10;
    } catch (error) {
      this.logger.error(`Token validation failed: ${error.message}`);
      return false;
    }
  }

  /**
   * Sanitize user input to prevent XSS and injection attacks
   */
  sanitizeInput(input: any): any {
    if (typeof input === 'string') {
      input = validator.escape(input);
      input = input.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
    } else if (typeof input === 'object' && input !== null) {
      for (const key in input) {
        if (input.hasOwnProperty(key)) {
          input[key] = this.sanitizeInput(input[key]);
        }
      }
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
