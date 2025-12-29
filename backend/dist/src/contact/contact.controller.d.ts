import { ContactService } from './contact.service';
import { CreateContactDto } from './dto/create-contact.dto';
export declare class ContactController {
    private readonly contactService;
    constructor(contactService: ContactService);
    create(createContactDto: CreateContactDto): Promise<{
        name: string;
        email: string | null;
        phone: string;
        message: string;
        isRead: boolean;
        createdAt: Date;
        id: number;
    }>;
}
