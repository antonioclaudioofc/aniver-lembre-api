import * as admin from 'firebase-admin';
export declare class FirebaseService {
    private readonly firebaseApp;
    constructor(firebaseApp: admin.app.App);
    getFirestore(): admin.firestore.Firestore;
    getAuth(): import("firebase-admin/lib/auth/auth").Auth;
}
