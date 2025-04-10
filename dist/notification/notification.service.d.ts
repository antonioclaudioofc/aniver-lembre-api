import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { FirebaseService } from 'src/firebase/firebase.service';
export declare class NotificationService {
    private readonly firebaseService;
    constructor(firebaseService: FirebaseService);
    create(createNotificationDto: CreateNotificationDto, request: Request): Promise<CreateNotificationDto>;
    findAll(request: Request): Promise<CreateNotificationDto[] | []>;
    findOne(id: string, request: Request): Promise<CreateNotificationDto | null>;
    update(id: string, updateNotificationDto: UpdateNotificationDto, request: Request): Promise<CreateNotificationDto>;
    remove(id: string, request: Request): Promise<{
        message: string;
    }>;
}
