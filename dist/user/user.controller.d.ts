import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
export declare class UserController {
    private readonly userService;
    constructor(userService: UserService);
    create(createUserDto: CreateUserDto): Promise<import("firebase-admin/lib/auth/user-record").UserRecord>;
    findOne(request: any): Promise<CreateUserDto | null>;
    update(updateUserDto: UpdateUserDto, request: any): Promise<import("firebase-admin/lib/auth/user-record").UserRecord>;
    remove(request: any): Promise<{
        message: string;
    }>;
}
