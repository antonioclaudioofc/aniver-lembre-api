import { Injectable, UnauthorizedException } from '@nestjs/common';
import { FirebaseService } from 'src/firebase/firebase.service';
import { LoginAuthDto } from './dto/login-auth.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly firebaseService: FirebaseService,
    private jwtService: JwtService,
  ) {}

  async signUp(loginAuthDto: LoginAuthDto) {
    const authData: LoginAuthDto = {
      ...JSON.parse(JSON.stringify(loginAuthDto)),
    };

    const user = await this.firebaseService.createUser(authData);

    if (!user) {
      throw new UnauthorizedException();
    }

    const payload = { sub: user.uid, username: user.displayName };

    return { token: await this.jwtService.signAsync(payload) };
  }
}
