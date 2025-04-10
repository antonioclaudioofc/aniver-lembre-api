import { ContactService } from './contact.service';
import { CreateContactDto } from './dto/create-contact.dto';
import { UpdateContactDto } from './dto/update-contact.dto';
export declare class ContactController {
    private readonly contactService;
    constructor(contactService: ContactService);
    create(createContactDto: CreateContactDto, request: any): Promise<CreateContactDto>;
    findAll(request: any): Promise<CreateContactDto[]>;
    findOne(id: string, request: any): Promise<CreateContactDto | null>;
    update(id: string, updateContactDto: UpdateContactDto, request: any): Promise<CreateContactDto>;
    remove(id: string, request: any): Promise<{
        message: string;
    }>;
}
