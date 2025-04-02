import { Injectable } from '@nestjs/common';
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
      throw new Error('Usuário não autenticado');
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
    } catch {
      throw new Error('Erro ao criar um contato');
    }
  }

  async findAll(request: Request): Promise<CreateContactDto[]> {
    const firestore = this.firebaseService.getFirestore();
    const userId = request['user']?.uid;

    if (!userId) {
      throw new Error('Usuário não autenticado');
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
    } catch {
      throw new Error('Erro ao buscar os contatos');
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

      if (contactRef.exists && contactRef.data()?.userId === userId) {
        const data = contactRef.data();

        if (!data) return null;

        return {
          id,
          ...data,
        } as CreateContactDto;
      } else {
        return null;
      }
    } catch {
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
        throw new Error('Erro: Contato não encontrado');
      }

      const contactRef = firestore.collection('contacts').doc(id);

      await contactRef.update({
        ...updateContactDto,
      });

      const updateContact = await contactRef.get();

      return {
        id,
        ...updateContact.data(),
      } as CreateContactDto;
    } catch {
      throw new Error('Erro ao atualizar o contato');
    }
  }

  async remove(id: string, request: Request) {
    const firestore = this.firebaseService.getFirestore();

    try {
      const contact = await this.findOne(id, request);

      if (!contact) {
        throw new Error('Erro: Contato não encontrado');
      }

      const contactRef = firestore.collection('contacts').doc(id);

      await contactRef.delete();

      return { message: 'Contato removido com sucesso' };
    } catch {
      throw new Error('Erro ao excluir o contato');
    }
  }
}
