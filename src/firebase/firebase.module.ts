// firebase.module.ts
import { Module, Global } from '@nestjs/common';
import { FirebaseService } from './firebase.service';
import admin from 'firebase-admin';

@Global()
@Module({
  providers: [FirebaseService],
  exports: [FirebaseService],
})
export class FirebaseModule {
  static configure(): any {
    process.env.GOOGLE_APPLICATION_CREDENTIALS;

    admin.initializeApp({
      credential: admin.credential.applicationDefault(),
      projectId: 'dritte-396514',
    });

    return {
      module: FirebaseModule,
      providers: [
        {
          provide: 'FirebaseAdmin',
          useValue: admin,
        },
      ],
      exports: ['FirebaseAdmin'],
    };
  }
}
