import { Inject, Injectable } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { CreateRequest } from 'firebase-admin/lib/auth/auth-config';
import { UserRecord } from 'firebase-admin/lib/auth/user-record';

@Injectable()
export class FirebaseService {
  constructor(
    @Inject('FIREBASE_ADMIN') private readonly firebaseApp: admin.app.App,
  ) {}

  async getFirestore() {
    return this.firebaseApp.firestore();
  }

  async getAuth() {
    return this.firebaseApp.auth();
  }

  async createUser(props: CreateRequest): Promise<UserRecord> {
    return (await this.getAuth()).createUser(props);
  }
}
