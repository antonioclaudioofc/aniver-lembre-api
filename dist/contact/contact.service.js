"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContactService = void 0;
const common_1 = require("@nestjs/common");
const firebase_service_1 = require("../firebase/firebase.service");
const contact_gateway_1 = require("./contact.gateway");
let ContactService = class ContactService {
    constructor(firebaseService, contactGateway) {
        this.firebaseService = firebaseService;
        this.contactGateway = contactGateway;
        this.listeners = new Map();
    }
    async create(createContactDto, request) {
        const firestore = this.firebaseService.getFirestore();
        const userId = request['user']?.uid;
        if (!userId) {
            throw new common_1.UnauthorizedException('Você precisa estar autenticado para criar um contato');
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
        }
        catch (error) {
            throw new common_1.InternalServerErrorException('Erro inesperado ao tentar salvar o contato. Tente novamente mais tarde.');
        }
    }
    async findAll(request) {
        const firestore = this.firebaseService.getFirestore();
        const userId = request['user']?.uid;
        if (!userId) {
            throw new common_1.UnauthorizedException('Você precisa estar autenticado para visualizar os contatos');
        }
        try {
            const contactRef = await firestore
                .collection('contacts')
                .where('userId', '==', userId)
                .get();
            const contacts = contactRef.docs.map((doc) => ({
                ...doc.data(),
                id: doc.id,
            }));
            if (!this.listeners.has(userId)) {
                this.listenAllContact(userId);
            }
            return contacts;
        }
        catch (error) {
            throw new common_1.InternalServerErrorException('Erro inesperado ao buscar os contatos. Tente novamente mais tarde.');
        }
    }
    listenAllContact(userId) {
        const firestore = this.firebaseService.getFirestore();
        const contactRef = firestore
            .collection('contacts')
            .where('userId', '==', userId);
        const unsubscribe = contactRef.onSnapshot((snapshot) => {
            const contacts = snapshot.docs.map((doc) => ({
                ...doc.data(),
                id: doc.id,
            }));
            this.contactGateway.sendUpdate(contacts);
        }, (error) => {
            console.error('Erro ao escutar contatos:', error);
        });
        this.listeners.set(userId, unsubscribe);
    }
    async findOne(id, request) {
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
            };
        }
        catch (error) {
            throw new Error('Erro ao buscar o contato');
        }
    }
    async update(id, updateContactDto, request) {
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
            };
        }
        catch (error) {
            throw new Error('Erro ao atualizar o contato');
        }
    }
    async remove(id, request) {
        const firestore = this.firebaseService.getFirestore();
        try {
            const contact = await this.findOne(id, request);
            if (!contact) {
                throw new Error('Contato não encontrado');
            }
            const contactRef = firestore.collection('contacts').doc(id);
            await contactRef.delete();
            return { message: 'Contato removido com sucesso' };
        }
        catch (error) {
            throw new Error('Erro ao excluir o contato');
        }
    }
};
exports.ContactService = ContactService;
exports.ContactService = ContactService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [firebase_service_1.FirebaseService,
        contact_gateway_1.ContactGateway])
], ContactService);
//# sourceMappingURL=contact.service.js.map