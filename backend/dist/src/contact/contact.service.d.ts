import { CreateContactDto } from './dto/create-contact.dto';
import { PrismaService } from '../prisma/prisma.service';
import { SecurityService } from '../security/security.service';
import { Queue } from 'bullmq';
export declare class ContactService {
    private prisma;
    private securityService;
    private notificationsQueue;
    constructor(prisma: PrismaService, securityService: SecurityService, notificationsQueue: Queue);
    create(createContactDto: CreateContactDto): Promise<{
        name: string;
        email: string | null;
        phone: string;
        message: string;
        isRead: boolean;
        createdAt: Date;
        id: number;
    }>;
    findAll(): Promise<{
        name: string;
        email: string | null;
        phone: string;
        message: string;
        isRead: boolean;
        createdAt: Date;
        id: number;
    }[]>;
}
