import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { FirebaseService } from '../firebase/firebase.service';
import { UserRecord } from 'firebase-admin/lib/auth/user-record';
import { UpdateUserDto } from './dto/update-user.dto';

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
          updatedAt: new Date(),
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

  async findOne(request: Request): Promise<CreateUserDto | null> {
    const firestore = this.firebaseService.getFirestore();

    const userId = request['user']?.uid;

    if (!userId) {
      throw new Error('Usuário não autenticado');
    }

    try {
      const userRef = await firestore.collection('users').doc(userId).get();

      if (userRef.exists) {
        const data = userRef.data();

        if (!data) return null;

        return {
          id: userId,
          ...data,
        } as CreateUserDto;
      } else {
        return null;
      }
    } catch {
      throw new Error('Erro ao buscar usuário');
    }
  }

  async update(
    updateUserDto: UpdateUserDto,
    request: Request,
  ): Promise<UserRecord> {
    const firestore = this.firebaseService.getFirestore();
    const auth = this.firebaseService.getAuth();

    try {
      const userId = request['user']?.uid;
      const userDoc = this.findOne(request);

      if (!userDoc || !userId) {
        throw new Error('Erro: Usuário não encontrado');
      }

      const userPromise = auth.updateUser(userId, {
        displayName: updateUserDto.name,
      });

      const userDocPromise = userPromise.then(() => {
        firestore
          .collection('users')
          .doc(userId)
          .update({
            ...updateUserDto,
            updatedAt: new Date(),
          });
      });

      const [user] = await Promise.all([userPromise, userDocPromise]);

      return user;
    } catch {
      throw new Error('Erro ao atualizar usuário');
    }
  }

  async remove(request: Request) {
    const firestore = this.firebaseService.getFirestore();
    const auth = this.firebaseService.getAuth();

    try {
      const userId = request['user']?.uid;
      const userDoc = await this.findOne(request);

      if (!userId || !userDoc) {
        throw new Error('Erro: Usuário não encontrado');
      }

      const userDocPromise = firestore.collection('users').doc(userId).delete();

      const userPromise = userDocPromise.then(() => {
        auth.deleteUser(userId);
      });
      await Promise.all([userDocPromise, userPromise]);

      return {
        message: 'Usuário excluido com sucesso!',
      };
    } catch {
      throw new Error('Erro ao excluir usuário');
    }
  }
}
