import {
  BadRequestException,
  ConflictException,
  HttpException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
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

      if (error.code) {
        switch (error.code) {
          case 'auth/email-already-exists':
            throw new ConflictException('Este e-mail já está em uso');
          case 'auth/invalid-email':
            throw new BadRequestException('O e-mail fornecido é inválido');
          case 'auth/invalid-password':
            throw new BadRequestException(
              'A senha deve conter pelo menos 6 caracteres',
            );
          default:
            throw new InternalServerErrorException(
              'Erro ao criar usuário. Tente novamente.',
            );
        }
      }

      throw new InternalServerErrorException(
        'Erro ao criar usuário no Firebase',
      );
    }
  }

  async findOne(request: Request): Promise<CreateUserDto | null> {
    const firestore = this.firebaseService.getFirestore();

    const userId = request['user']?.uid;

    if (!userId) {
      throw new UnauthorizedException('Usuário não autenticado');
    }

    try {
      const userRef = await firestore.collection('users').doc(userId).get();

      if (!userRef.exists) {
        throw new NotFoundException('Usuário não encontrado');
      }

      const data = userRef.data();

      if (!data) {
        throw new InternalServerErrorException(
          'Dados do usuário estão corrompidos ou ausentes',
        );
      }

      return {
        id: userId,
        ...data,
      } as CreateUserDto;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      throw new InternalServerErrorException('Erro ao buscar usuário');
    }
  }

  async update(
    updateUserDto: UpdateUserDto,
    request: Request,
  ): Promise<UserRecord> {
    const firestore = this.firebaseService.getFirestore();
    const auth = this.firebaseService.getAuth();

    const userId = request['user']?.uid;

    if (!userId) {
      throw new UnauthorizedException('Usuário não autenticado');
    }

    try {
      const userDoc = await this.findOne(request);

      if (!userDoc) {
        throw new NotFoundException('Usuário não encontrado');
      }

      const userPromise = auth.updateUser(userId, {
        displayName: updateUserDto.name,
      });

      const userDocPromise = userPromise.then(() =>
        firestore
          .collection('users')
          .doc(userId)
          .update({
            ...updateUserDto,
            updatedAt: new Date(),
          }),
      );

      const [user] = await Promise.all([userPromise, userDocPromise]);

      return user;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      if (error?.code) {
        switch (error.code) {
          case 'auth/user-not-found':
            throw new NotFoundException('Usuário não encontrado no Firebase');
          case 'auth/invalid-display-name':
            throw new BadRequestException('Nome inválido');
          default:
            break;
        }
      }

      throw new InternalServerErrorException('Erro ao atualizar usuário');
    }
  }

  async remove(request: Request) {
    const firestore = this.firebaseService.getFirestore();
    const auth = this.firebaseService.getAuth();

    const userId = request['user']?.uid;

    if (!userId) {
      throw new UnauthorizedException('Usuário não autenticado');
    }

    try {
      const userDoc = await this.findOne(request);

      if (!userDoc) {
        throw new NotFoundException('Usuário não encontrado');
      }

      const userDocPromise = firestore.collection('users').doc(userId).delete();
      const userPromise = auth.deleteUser(userId);

      await Promise.all([userDocPromise, userPromise]);

      return {
        message: 'Usuário excluído com sucesso!',
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      if (error?.code === 'auth/user-not-found') {
        throw new NotFoundException('Usuário não encontrado no Firebase Auth');
      }

      throw new InternalServerErrorException('Erro ao excluir usuário');
    }
  }
}
