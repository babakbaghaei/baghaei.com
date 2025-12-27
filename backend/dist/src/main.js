"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const app_module_1 = require("./app.module");
const security_service_1 = require("./security/security.service");
const nestjs_pino_1 = require("nestjs-pino");
const all_exceptions_filter_1 = require("./common/filters/all-exceptions.filter");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.useLogger(app.get(nestjs_pino_1.Logger));
    const httpAdapterHost = app.get(core_1.HttpAdapterHost);
    app.useGlobalFilters(new all_exceptions_filter_1.AllExceptionsFilter(httpAdapterHost));
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        transform: true,
        forbidNonWhitelisted: true,
    }));
    const securityService = app.get(security_service_1.SecurityService);
    securityService.applySecurityMiddleware(app);
    app.setGlobalPrefix('api/v1');
    if (process.env.NODE_ENV !== 'production') {
        const config = new swagger_1.DocumentBuilder()
            .setTitle('Baghaei.com API')
            .setDescription('The Baghaei Tech Group API description')
            .setVersion('1.0')
            .addBearerAuth()
            .build();
        const document = swagger_1.SwaggerModule.createDocument(app, config);
        swagger_1.SwaggerModule.setup('api/docs', app, document);
    }
    const port = process.env.PORT || 8000;
    await app.listen(port);
    console.log(`Application is running on: http://localhost:${port}`);
    if (process.env.NODE_ENV !== 'production') {
        console.log(`Swagger documentation: http://localhost:${port}/api/docs`);
    }
}
bootstrap();
//# sourceMappingURL=main.js.map