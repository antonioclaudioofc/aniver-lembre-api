import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { FirebaseService } from './firebase/firebase.service';
import { FirebaseModule } from './firebase/firebase.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    UserModule,
    FirebaseModule,
  ],
  controllers: [AppController],
  providers: [AppService, FirebaseService],
})
export class AppModule {}
