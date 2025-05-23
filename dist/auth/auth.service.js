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
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const firebase_service_1 = require("../firebase/firebase.service");
const jwt_1 = require("@nestjs/jwt");
let AuthService = class AuthService {
    constructor(firebaseService, jwtService) {
        this.firebaseService = firebaseService;
        this.jwtService = jwtService;
    }
    async signIn(loginAuthDto) {
        const auth = this.firebaseService.getAuth();
        try {
            const userRecord = await auth.getUserByEmail(loginAuthDto.email);
            const idToken = await this.verifyPassword(loginAuthDto.email, loginAuthDto.password);
            if (!idToken) {
                throw new common_1.UnauthorizedException('Email ou senha incorretos');
            }
            const payload = {
                uid: userRecord.uid,
                email: userRecord.email,
                name: userRecord.displayName,
            };
            const expiresIn = 5 * 24 * 60 * 60;
            const token = this.jwtService.sign(payload, { expiresIn });
            return { token, expiresIn };
        }
        catch (error) {
            if (error instanceof common_1.UnauthorizedException) {
                throw error;
            }
            if (error?.code === 'auth/user-not-found') {
                throw new common_1.UnauthorizedException('Email não encontrado!');
            }
            throw new common_1.InternalServerErrorException('Erro interno ao autenticar');
        }
    }
    async verifyPassword(email, password) {
        try {
            const apiKey = process.env.FIREBASE_WEB_API_KEY;
            const response = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${apiKey}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password, returnSecureToken: true }),
            });
            const data = await response.json();
            return data.idToken || null;
        }
        catch {
            return null;
        }
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [firebase_service_1.FirebaseService,
        jwt_1.JwtService])
], AuthService);
//# sourceMappingURL=auth.service.js.map