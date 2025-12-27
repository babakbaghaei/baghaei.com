import { PrismaService } from '../prisma/prisma.service';
import { CreateContactDto } from './dto/create-contact.dto';
import { TelegramService } from '../notifications/telegram.service';
import { SecurityService } from '../security/security.service';
export declare class ContactService {
    private prisma;
    private telegramService;
    private securityService;
    private readonly logger;
    constructor(prisma: PrismaService, telegramService: TelegramService, securityService: SecurityService);
    create(createContactDto: CreateContactDto): Promise<{
        success: boolean;
        messageId: number;
    }>;
}
