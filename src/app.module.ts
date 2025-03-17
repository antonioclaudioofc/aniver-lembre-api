import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { FirebaseService } from './firebase/firebase.service';
import { FirebaseModule } from './firebase/firebase.module';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { ContactModule } from './contact/contact.module';
import { NotificationModule } from './notification/notification.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    UserModule,
    FirebaseModule,
    AuthModule,
    ContactModule,
    NotificationModule,
  ],
  providers: [FirebaseService],
})
export class AppModule {}
