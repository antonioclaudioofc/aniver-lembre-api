"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FirebaseModule = void 0;
const common_1 = require("@nestjs/common");
const admin = require("firebase-admin");
const firebase_service_1 = require("./firebase.service");
let FirebaseModule = class FirebaseModule {
};
exports.FirebaseModule = FirebaseModule;
exports.FirebaseModule = FirebaseModule = __decorate([
    (0, common_1.Global)(),
    (0, common_1.Module)({
        providers: [
            {
                provide: 'FIREBASE_ADMIN',
                useFactory: () => {
                    if (!process.env.FIREBASE_CREDENTIALS) {
                        throw new Error('FIREBASE_CREDENTIALS não está definido no .env');
                    }
                    const firebaseConfig = JSON.parse(process.env.FIREBASE_CREDENTIALS);
                    return admin.initializeApp({
                        credential: admin.credential.cert({
                            projectId: firebaseConfig.project_id,
                            clientEmail: firebaseConfig.client_email,
                            privateKey: firebaseConfig.private_key.replace(/\\n/g, '\n'),
                        }),
                    });
                },
            },
            firebase_service_1.FirebaseService,
        ],
        exports: ['FIREBASE_ADMIN', firebase_service_1.FirebaseService],
    })
], FirebaseModule);
//# sourceMappingURL=firebase.module.js.map