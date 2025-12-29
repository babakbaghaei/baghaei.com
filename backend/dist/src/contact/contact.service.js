"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContactService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const security_service_1 = require("../security/security.service");
const bullmq_1 = require("@nestjs/bullmq");
const bullmq_2 = require("bullmq");
let ContactService = class ContactService {
    prisma;
    securityService;
    notificationsQueue;
    constructor(prisma, securityService, notificationsQueue) {
        this.prisma = prisma;
        this.securityService = securityService;
        this.notificationsQueue = notificationsQueue;
    }
    async create(createContactDto) {
        const sanitizedData = this.securityService.sanitizeInput(createContactDto);
        const message = await this.prisma.contactMessage.create({
            data: sanitizedData,
        });
        await this.notificationsQueue.add('contact-message', {
            name: message.name,
            email: message.email,
            phone: message.phone,
            message: message.message,
        }, {
            attempts: 3,
            backoff: 5000,
            removeOnComplete: true,
        });
        return message;
    }
    async findAll() {
        return this.prisma.contactMessage.findMany({
            orderBy: { createdAt: 'desc' },
        });
    }
};
exports.ContactService = ContactService;
exports.ContactService = ContactService = __decorate([
    (0, common_1.Injectable)(),
    __param(2, (0, bullmq_1.InjectQueue)('notifications')),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        security_service_1.SecurityService, typeof (_a = typeof bullmq_2.Queue !== "undefined" && bullmq_2.Queue) === "function" ? _a : Object])
], ContactService);
//# sourceMappingURL=contact.service.js.map