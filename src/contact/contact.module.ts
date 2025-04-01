import { Module } from '@nestjs/common';
import { ContactService } from './contact.service';
import { ContactController } from './contact.controller';
import { FirebaseModule } from 'src/firebase/firebase.module';
import { ContactGateway } from './contact.gateway';

@Module({
  imports: [FirebaseModule],
  controllers: [ContactController],
  providers: [ContactService, ContactGateway],
})
export class ContactModule {}
