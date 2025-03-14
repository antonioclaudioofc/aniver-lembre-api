import { Inject, Injectable } from '@nestjs/common';
import * as admin from 'firebase-admin';

@Injectable()
export class FirebaseService {
  constructor(
    @Inject('FIREBASE_ADMIN') private readonly firebaseApp: admin.app.App,
  ) {}

  async getFirestore() {
    return await this.firebaseApp.firestore();
  }

  async getAuth() {
    return await this.firebaseApp.auth();
  }
}
