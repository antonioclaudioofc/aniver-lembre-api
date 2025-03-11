import { Global, Module } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { FirebaseService } from './firebase.service';

@Global()
@Module({
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
    FirebaseService,
  ],
  exports: ['FIREBASE_ADMIN', FirebaseService],
})
export class FirebaseModule {}
