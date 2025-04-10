import { FirebaseService } from 'src/firebase/firebase.service';
import { LoginAuthDto } from './dto/login-auth.dto';
import { JwtService } from '@nestjs/jwt';
export declare class AuthService {
    private readonly firebaseService;
    private jwtService;
    constructor(firebaseService: FirebaseService, jwtService: JwtService);
    signIn(loginAuthDto: LoginAuthDto): Promise<{
        token: string;
        expiresIn: number;
    }>;
    private verifyPassword;
}
