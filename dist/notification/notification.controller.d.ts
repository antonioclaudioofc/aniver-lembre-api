import { NotificationService } from './notification.service';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
export declare class NotificationController {
    private readonly notificationService;
    constructor(notificationService: NotificationService);
    create(createNotificationDto: CreateNotificationDto, request: any): Promise<CreateNotificationDto>;
    findAll(request: any): Promise<[] | CreateNotificationDto[]>;
    findOne(id: string, request: any): Promise<CreateNotificationDto | null>;
    update(id: string, updateNotificationDto: UpdateNotificationDto, request: any): Promise<CreateNotificationDto>;
    remove(id: string, request: any): Promise<{
        message: string;
    }>;
}
