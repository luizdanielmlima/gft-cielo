import { Injectable } from '@angular/core';

import {
  AngularFirestore,
  AngularFirestoreDocument,
  AngularFirestoreCollection,
} from '@angular/fire/firestore';

import { CustomUser } from '../models/CustomUser.model';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  usersCollection: AngularFirestoreCollection<any>;

  constructor(private afs: AngularFirestore) {
    this.usersCollection = this.afs.collection('/users');
  }

  getUserID(): string {
    // Como esse app demo não possui login/signup...
    // ...retorna apenas o ID do usuário pré-cadastrado no BD do firestore que criei para a demonstração ;)
    return 'khgH4qf6iw0gs6xj44Rn';
  }

  getUserFromDB(uid: string): Promise<CustomUser> {
    return new Promise((resolve, reject) => {
      this.usersCollection
        .doc(uid)
        .get()
        .subscribe(
          (userDoc) => {
            const data = userDoc.data() as any;
            console.log('user data: ', data);
            resolve(data);
          },
          (err) => reject(err),
        );
    });
  }
}
