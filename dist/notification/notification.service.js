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
exports.NotificationService = void 0;
const common_1 = require("@nestjs/common");
const firebase_service_1 = require("../firebase/firebase.service");
let NotificationService = class NotificationService {
    constructor(firebaseService) {
        this.firebaseService = firebaseService;
    }
    async create(createNotificationDto, request) {
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
        }
        catch {
            throw new Error('Erro ao criar um notificação');
        }
    }
    async findAll(request) {
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
                    };
                });
            }
            else {
                return [];
            }
        }
        catch {
            throw new Error('Erro ao buscar as notificações');
        }
    }
    async findOne(id, request) {
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
                if (!data)
                    return null;
                return {
                    id,
                    ...data,
                };
            }
            else {
                return null;
            }
        }
        catch {
            throw new Error('Erro ao buscar a notificação');
        }
    }
    async update(id, updateNotificationDto, request) {
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
            const notificationUpdate = await notificationRef.get();
            return {
                id,
                ...notificationUpdate.data(),
            };
        }
        catch {
            throw new Error('Erro ao atualizar a notificação');
        }
    }
    async remove(id, request) {
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
        }
        catch {
            throw new Error('Erro ao excluir o contato');
        }
    }
};
exports.NotificationService = NotificationService;
exports.NotificationService = NotificationService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [firebase_service_1.FirebaseService])
], NotificationService);
//# sourceMappingURL=notification.service.js.map