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

  async signIn(
    loginAuthDto: LoginAuthDto,
  ): Promise<{ token: string; expiresIn: number }> {
    const auth = await this.firebaseService.getAuth();

    try {
      const userRecord = await auth.getUserByEmail(loginAuthDto.email);

      const idToken = await this.verifyPassword(
        loginAuthDto.email,
        loginAuthDto.password,
      );

      if (!idToken)
        throw new UnauthorizedException('Email ou senha incorreta!');

      const payload = {
        uid: userRecord.uid,
        email: userRecord.email,
        name: userRecord.displayName,
      };

      const expiresIn = 5 * 24 * 60 * 60;
      const token = this.jwtService.sign(payload, { expiresIn });
      
      return { token, expiresIn };
    } catch (error) {
      throw new UnauthorizedException('Email ou senha incorreta!');
    }
  }

  private async verifyPassword(
    email: string,
    password: string,
  ): Promise<string | null> {
    try {
      const apiKey = process.env.FIREBASE_WEB_API_KEY;
      const response = await fetch(
        `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password, returnSecureToken: true }),
        },
      );

      const data = await response.json();
      return data.idToken || null;
    } catch {
      return null;
    }
  }
}
