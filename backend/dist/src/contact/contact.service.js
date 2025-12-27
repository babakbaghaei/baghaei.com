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
var ContactService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContactService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const telegram_service_1 = require("../notifications/telegram.service");
const security_service_1 = require("../security/security.service");
let ContactService = ContactService_1 = class ContactService {
    prisma;
    telegramService;
    securityService;
    logger = new common_1.Logger(ContactService_1.name);
    constructor(prisma, telegramService, securityService) {
        this.prisma = prisma;
        this.telegramService = telegramService;
        this.securityService = securityService;
    }
    async create(createContactDto) {
        try {
            const sanitizedData = this.securityService.sanitizeInput(createContactDto);
            const message = await this.prisma.contactMessage.create({
                data: {
                    name: sanitizedData.name,
                    email: sanitizedData.email,
                    phone: sanitizedData.phone,
                    message: sanitizedData.message,
                },
            });
            this.logger.log(`New contact message received from ${sanitizedData.name}`);
            const telegramMsg = `
<b>🚀 درخواست همکاری جدید</b>
<b>نام:</b> ${sanitizedData.name}
<b>شماره:</b> ${sanitizedData.phone}
<b>ایمیل:</b> ${sanitizedData.email || 'ارائه نشده'}
<b>پیام:</b>
${sanitizedData.message}
      `;
            await this.telegramService.sendMessage(telegramMsg);
            return { success: true, messageId: message.id };
        }
        catch (error) {
            this.logger.error(`Failed to save contact message: ${error.message}`, error.stack);
            throw new common_1.InternalServerErrorException(`Could not save message: ${error.message}`);
        }
    }
};
exports.ContactService = ContactService;
exports.ContactService = ContactService = ContactService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        telegram_service_1.TelegramService,
        security_service_1.SecurityService])
], ContactService);
//# sourceMappingURL=contact.service.js.map