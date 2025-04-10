import { CreateContactDto } from './dto/create-contact.dto';
import { FirebaseService } from 'src/firebase/firebase.service';
import { UpdateContactDto } from './dto/update-contact.dto';
import { ContactGateway } from './contact.gateway';
export declare class ContactService {
    private readonly firebaseService;
    private readonly contactGateway;
    private listeners;
    constructor(firebaseService: FirebaseService, contactGateway: ContactGateway);
    create(createContactDto: CreateContactDto, request: Request): Promise<CreateContactDto>;
    findAll(request: Request): Promise<CreateContactDto[]>;
    listenAllContact(userId: string): void;
    findOne(id: string, request: Request): Promise<CreateContactDto | null>;
    update(id: string, updateContactDto: UpdateContactDto, request: Request): Promise<CreateContactDto>;
    remove(id: string, request: Request): Promise<{
        message: string;
    }>;
}
