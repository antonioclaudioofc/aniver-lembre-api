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
exports.UserService = void 0;
const common_1 = require("@nestjs/common");
const firebase_service_1 = require("../firebase/firebase.service");
let UserService = class UserService {
    constructor(firebaseService) {
        this.firebaseService = firebaseService;
    }
    async create(createUserDto) {
        const firestore = this.firebaseService.getFirestore();
        const auth = this.firebaseService.getAuth();
        try {
            const userPromise = auth.createUser({
                email: createUserDto.email,
                password: createUserDto.password,
                displayName: createUserDto.name,
            });
            const userDocPromise = userPromise.then((user) => firestore.collection('users').doc(user.uid).set({
                email: user.email,
                name: user.displayName,
                createdAt: new Date(),
                updatedAt: new Date(),
            }));
            const [user] = await Promise.all([userPromise, userDocPromise]);
            return user;
        }
        catch (error) {
            if (error?.userRecord?.uid) {
                await auth.deleteUser(error.userRecord.uid);
            }
            if (error.code) {
                switch (error.code) {
                    case 'auth/email-already-exists':
                        throw new common_1.ConflictException('Este e-mail já está em uso');
                    case 'auth/invalid-email':
                        throw new common_1.BadRequestException('O e-mail fornecido é inválido');
                    case 'auth/invalid-password':
                        throw new common_1.BadRequestException('A senha deve conter pelo menos 6 caracteres');
                    default:
                        throw new common_1.InternalServerErrorException('Erro ao criar usuário. Tente novamente.');
                }
            }
            throw new common_1.InternalServerErrorException('Erro ao criar usuário no Firebase');
        }
    }
    async findOne(request) {
        const firestore = this.firebaseService.getFirestore();
        const userId = request['user']?.uid;
        if (!userId) {
            throw new common_1.UnauthorizedException('Usuário não autenticado');
        }
        try {
            const userRef = await firestore.collection('users').doc(userId).get();
            if (!userRef.exists) {
                throw new common_1.NotFoundException('Usuário não encontrado');
            }
            const data = userRef.data();
            if (!data) {
                throw new common_1.InternalServerErrorException('Dados do usuário estão corrompidos ou ausentes');
            }
            return {
                id: userId,
                ...data,
            };
        }
        catch (error) {
            if (error instanceof common_1.HttpException) {
                throw error;
            }
            throw new common_1.InternalServerErrorException('Erro ao buscar usuário');
        }
    }
    async update(updateUserDto, request) {
        const firestore = this.firebaseService.getFirestore();
        const auth = this.firebaseService.getAuth();
        const userId = request['user']?.uid;
        if (!userId) {
            throw new common_1.UnauthorizedException('Usuário não autenticado');
        }
        try {
            const userDoc = await this.findOne(request);
            if (!userDoc) {
                throw new common_1.NotFoundException('Usuário não encontrado');
            }
            const userPromise = auth.updateUser(userId, {
                displayName: updateUserDto.name,
            });
            const userDocPromise = userPromise.then(() => firestore
                .collection('users')
                .doc(userId)
                .update({
                ...updateUserDto,
                updatedAt: new Date(),
            }));
            const [user] = await Promise.all([userPromise, userDocPromise]);
            return user;
        }
        catch (error) {
            if (error instanceof common_1.HttpException) {
                throw error;
            }
            if (error?.code) {
                switch (error.code) {
                    case 'auth/user-not-found':
                        throw new common_1.NotFoundException('Usuário não encontrado no Firebase');
                    case 'auth/invalid-display-name':
                        throw new common_1.BadRequestException('Nome inválido');
                    default:
                        break;
                }
            }
            throw new common_1.InternalServerErrorException('Erro ao atualizar usuário');
        }
    }
    async remove(request) {
        const firestore = this.firebaseService.getFirestore();
        const auth = this.firebaseService.getAuth();
        const userId = request['user']?.uid;
        if (!userId) {
            throw new common_1.UnauthorizedException('Usuário não autenticado');
        }
        try {
            const userDoc = await this.findOne(request);
            if (!userDoc) {
                throw new common_1.NotFoundException('Usuário não encontrado');
            }
            const userDocPromise = firestore.collection('users').doc(userId).delete();
            const userPromise = auth.deleteUser(userId);
            await Promise.all([userDocPromise, userPromise]);
            return {
                message: 'Usuário excluído com sucesso!',
            };
        }
        catch (error) {
            if (error instanceof common_1.HttpException) {
                throw error;
            }
            if (error?.code === 'auth/user-not-found') {
                throw new common_1.NotFoundException('Usuário não encontrado no Firebase Auth');
            }
            throw new common_1.InternalServerErrorException('Erro ao excluir usuário');
        }
    }
};
exports.UserService = UserService;
exports.UserService = UserService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [firebase_service_1.FirebaseService])
], UserService);
//# sourceMappingURL=user.service.js.map