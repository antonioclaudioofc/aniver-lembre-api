import {
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateContactDto } from './dto/create-contact.dto';
import { FirebaseService } from 'src/firebase/firebase.service';
import { UpdateContactDto } from './dto/update-contact.dto';
import { ContactGateway } from './contact.gateway';

@Injectable()
export class ContactService {
  private listeners = new Map<string, () => void>();

  constructor(
    private readonly firebaseService: FirebaseService,
    private readonly contactGateway: ContactGateway,
  ) {}

  async create(
    createContactDto: CreateContactDto,
    request: Request,
  ): Promise<CreateContactDto> {
    const firestore = this.firebaseService.getFirestore();

    const userId = request['user']?.uid;

    if (!userId) {
      throw new UnauthorizedException(
        'Você precisa estar autenticado para criar um contato',
      );
    }

    try {
      const contactData = {
        ...createContactDto,
        userId: userId,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const contactRef = await firestore
        .collection('contacts')
        .add(contactData);

      return {
        id: contactRef.id,
        ...contactData,
      };
    } catch (error) {
      throw new InternalServerErrorException(
        'Erro inesperado ao tentar salvar o contato. Tente novamente mais tarde.',
      );
    }
  }

  async findAll(request: Request): Promise<CreateContactDto[]> {
    const firestore = this.firebaseService.getFirestore();
    const userId = request['user']?.uid;

    if (!userId) {
      throw new UnauthorizedException(
        'Você precisa estar autenticado para visualizar os contatos',
      );
    }

    try {
      const contactRef = await firestore
        .collection('contacts')
        .where('userId', '==', userId)
        .get();

      const contacts = contactRef.docs.map((doc) => ({
        ...(doc.data() as CreateContactDto),
        id: doc.id,
      }));

      if (!this.listeners.has(userId)) {
        this.listenAllContact(userId);
      }

      return contacts;
    } catch (error) {
      throw new InternalServerErrorException(
        'Erro inesperado ao buscar os contatos. Tente novamente mais tarde.',
      );
    }
  }

  listenAllContact(userId: string) {
    const firestore = this.firebaseService.getFirestore();
    const contactRef = firestore
      .collection('contacts')
      .where('userId', '==', userId);

    const unsubscribe = contactRef.onSnapshot(
      (snapshot) => {
        const contacts = snapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }));

        this.contactGateway.sendUpdate(contacts);
      },
      (error) => {
        console.error('Erro ao escutar contatos:', error);
      },
    );

    this.listeners.set(userId, unsubscribe);
  }

  async findOne(
    id: string,
    request: Request,
  ): Promise<CreateContactDto | null> {
    const firestore = this.firebaseService.getFirestore();

    const userId = request['user']?.uid;

    if (!userId) {
      throw new Error('Usuário não autenticado');
    }

    try {
      const contactRef = await firestore.collection('contacts').doc(id).get();

      if (!contactRef.exists) {
        return null;
      }

      const data = contactRef.data();

      if (!data) {
        return null;
      }

      if (data.userId !== userId) {
        return null;
      }

      return {
        id,
        ...data,
      } as CreateContactDto;
    } catch (error) {
      throw new Error('Erro ao buscar o contato');
    }
  }

  async update(
    id: string,
    updateContactDto: UpdateContactDto,
    request: Request,
  ): Promise<CreateContactDto> {
    const firestore = this.firebaseService.getFirestore();

    try {
      const contact = await this.findOne(id, request);

      if (!contact) {
        throw new Error('Contato não encontrado');
      }

      const contactRef = firestore.collection('contacts').doc(id);

      await contactRef.update({
        ...updateContactDto,
        updatedAt: new Date(),
      });

      const updatedContact = await contactRef.get();

      const data = updatedContact.data();

      if (!data) {
        throw new Error('Erro ao obter os dados atualizados do contato');
      }

      return {
        id,
        ...data,
      } as CreateContactDto;
    } catch (error) {
      throw new Error('Erro ao atualizar o contato');
    }
  }

  async remove(id: string, request: Request) {
    const firestore = this.firebaseService.getFirestore();

    try {
      const contact = await this.findOne(id, request);

      if (!contact) {
        throw new Error('Contato não encontrado');
      }

      const contactRef = firestore.collection('contacts').doc(id);

      await contactRef.delete();

      return { message: 'Contato removido com sucesso' };
    } catch (error) {
      throw new Error('Erro ao excluir o contato');
    }
  }
}
