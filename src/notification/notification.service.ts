import { Injectable } from '@nestjs/common';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { FirebaseService } from 'src/firebase/firebase.service';

@Injectable()
export class NotificationService {
  constructor(private readonly firebaseService: FirebaseService) {}

  async create(
    createNotificationDto: CreateNotificationDto,
    request: Request,
  ): Promise<CreateNotificationDto> {
    const firestore = this.firebaseService.getFirestore();

    const userId = request['user']?.uid;

    if (!userId) {
      throw new Error('Usuário não autenticado');
    }

    try {
      const notificationData = {
        ...createNotificationDto,
        userId: userId,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const notificationRef = await firestore
        .collection('notifications')
        .add(notificationData);

      return {
        id: notificationRef.id,
        ...notificationData,
      };
    } catch {
      throw new Error('Erro ao criar um notificação');
    }
  }

  async findAll(request: Request): Promise<CreateNotificationDto[] | []> {
    const firestore = this.firebaseService.getFirestore();

    const userId = request['user']?.uid;

    if (!userId) {
      throw new Error('Usuário não autenticado');
    }

    try {
      const notificationRef = await firestore
        .collection('notifications')
        .where('userId', '==', userId)
        .get();

      if (!notificationRef.empty) {
        return notificationRef.docs.map((doc) => {
          const data = doc.data();

          return {
            ...data,
            id: doc.id,
          } as CreateNotificationDto;
        });
      } else {
        return [];
      }
    } catch {
      throw new Error('Erro ao buscar as notificações');
    }
  }

  async findOne(
    id: string,
    request: Request,
  ): Promise<CreateNotificationDto | []> {
    const firestore = this.firebaseService.getFirestore();

    const userId = request['user']?.uid;

    if (!userId) {
      throw new Error('Usuário não autenticado');
    }

    try {
      const notificationRef = await firestore
        .collection('notifications')
        .doc(id)
        .get();

      if (notificationRef.exists && notificationRef.data()?.userId === userId) {
        const data = notificationRef.data();

        if (!data) return [];

        return {
          id,
          ...data,
        } as CreateNotificationDto;
      } else {
        return [];
      }
    } catch {
      throw new Error('Erro ao buscar a notificação');
    }
  }

  async update(
    id: string,
    updateNotificationDto: UpdateNotificationDto,
    request: Request,
  ): Promise<CreateNotificationDto> {
    const firestore = this.firebaseService.getFirestore();

    try {
      const notification = await this.findOne(id, request);

      if (!notification) {
        throw new Error('Erro: Notificação não encontrada');
      }

      const notificationRef = firestore.collection('notifications').doc(id);

      await notificationRef.update({
        ...updateNotificationDto,
        updatedAt: new Date(),
      });

      return {
        id,
        ...updateNotificationDto,
      } as CreateNotificationDto;
    } catch {
      throw new Error('Erro ao atualizar a notificação');
    }
  }

  async remove(id: string, request: Request) {
    const firestore = this.firebaseService.getFirestore();

    try {
      const notification = await this.findOne(id, request);

      if (!notification) {
        throw new Error('Erro: Notificação não encontrada');
      }

      const notificationRef = firestore.collection('notifications').doc(id);

      await notificationRef.delete();

      return {
        message: 'Notificação removida com sucesso',
      };
    } catch {
      throw new Error('Erro ao excluir o contato');
    }
  }
}
