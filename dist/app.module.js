"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const user_module_1 = require("./user/user.module");
const firebase_service_1 = require("./firebase/firebase.service");
const firebase_module_1 = require("./firebase/firebase.module");
const config_1 = require("@nestjs/config");
const auth_module_1 = require("./auth/auth.module");
const contact_module_1 = require("./contact/contact.module");
const notification_module_1 = require("./notification/notification.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({ isGlobal: true }),
            user_module_1.UserModule,
            firebase_module_1.FirebaseModule,
            auth_module_1.AuthModule,
            contact_module_1.ContactModule,
            notification_module_1.NotificationModule,
        ],
        providers: [firebase_service_1.FirebaseService],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map