import { ContactService } from './contact.service';
import { CreateContactDto } from './dto/create-contact.dto';
export declare class ContactController {
    private readonly contactService;
    constructor(contactService: ContactService);
    create(createContactDto: CreateContactDto): Promise<{
        id: number;
        email: string | null;
        name: string;
        createdAt: Date;
        phone: string;
        message: string;
        isRead: boolean;
    }>;
}
