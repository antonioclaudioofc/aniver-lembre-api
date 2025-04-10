import { AuthService } from './auth.service';
import { LoginAuthDto } from './dto/login-auth.dto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    signIn(loginAuthDto: LoginAuthDto): Promise<{
        token: string;
        expiresIn: number;
    }>;
}
