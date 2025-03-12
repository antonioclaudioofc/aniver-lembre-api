import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { FirebaseService } from './firebase/firebase.service';
import { FirebaseModule } from './firebase/firebase.module';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    UserModule,
    FirebaseModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService, FirebaseService],
})
export class AppModule {}
