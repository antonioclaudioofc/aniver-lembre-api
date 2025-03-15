import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { FirebaseService } from '../firebase/firebase.service';
import { UserRecord } from 'firebase-admin/lib/auth/user-record';

@Injectable()
export class UserService {
  constructor(private readonly firebaseService: FirebaseService) {}

  async create(createUserDto: CreateUserDto): Promise<UserRecord> {
    const firestore = this.firebaseService.getFirestore();
    const auth = this.firebaseService.getAuth();

    try {
      const userPromise = auth.createUser({
        email: createUserDto.email,
        password: createUserDto.password,
        displayName: createUserDto.name,
      });

      const userDocPromise = userPromise.then((user) =>
        firestore.collection('users').doc(user.uid).set({
          email: user.email,
          name: user.displayName,
          createdAt: new Date(),
        }),
      );

      const [user] = await Promise.all([userPromise, userDocPromise]);

      return user;
    } catch (error) {
      if (error?.userRecord?.uid) {
        await auth.deleteUser(error.userRecord.uid);
      }
      throw new Error('Erro ao criar usuário no Firebase');
    }
  }
}
