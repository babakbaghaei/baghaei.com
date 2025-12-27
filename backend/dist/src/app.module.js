"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const config_1 = require("@nestjs/config");
const throttler_1 = require("@nestjs/throttler");
const nestjs_pino_1 = require("nestjs-pino");
const nestjs_prometheus_1 = require("@willsoto/nestjs-prometheus");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const prisma_module_1 = require("./prisma/prisma.module");
const projects_module_1 = require("./projects/projects.module");
const contact_module_1 = require("./contact/contact.module");
const auth_module_1 = require("./auth/auth.module");
const opentelemetry_module_1 = require("./observability/opentelemetry.module");
const security_module_1 = require("./security/security.module");
const health_module_1 = require("./health/health.module");
const services_module_1 = require("./services/services.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
            }),
            throttler_1.ThrottlerModule.forRoot([
                {
                    ttl: 60000,
                    limit: 60,
                },
            ]),
            nestjs_pino_1.LoggerModule.forRoot({
                pinoHttp: {
                    transport: process.env.NODE_ENV === 'production'
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
            nestjs_prometheus_1.PrometheusModule.register(),
            prisma_module_1.PrismaModule,
            projects_module_1.ProjectsModule,
            contact_module_1.ContactModule,
            auth_module_1.AuthModule,
            opentelemetry_module_1.OpenTelemetryModule,
            security_module_1.SecurityModule,
            health_module_1.HealthModule,
            services_module_1.ServicesModule,
        ],
        controllers: [app_controller_1.AppController],
        providers: [
            app_service_1.AppService,
            {
                provide: core_1.APP_GUARD,
                useClass: throttler_1.ThrottlerGuard,
            },
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map