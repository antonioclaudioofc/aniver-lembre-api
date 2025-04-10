import { CreateUserDto } from './dto/create-user.dto';
import { FirebaseService } from '../firebase/firebase.service';
import { UserRecord } from 'firebase-admin/lib/auth/user-record';
import { UpdateUserDto } from './dto/update-user.dto';
export declare class UserService {
    private readonly firebaseService;
    constructor(firebaseService: FirebaseService);
    create(createUserDto: CreateUserDto): Promise<UserRecord>;
    findOne(request: Request): Promise<CreateUserDto | null>;
    update(updateUserDto: UpdateUserDto, request: Request): Promise<UserRecord>;
    remove(request: Request): Promise<{
        message: string;
    }>;
}
