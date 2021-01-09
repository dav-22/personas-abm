import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs/internal/Observable';
import { Persona } from '../models/persona.model';
import { firebaseApp } from './firebase.service';
import firebase from 'firebase/app';

const db = firebase.firestore(firebaseApp);
@Injectable({
  providedIn: 'root',
})
export class PaisService {
  TAG: string = 'paises';

  constructor(private firestore: AngularFirestore) {}

  getAll() {
    const entities: Persona[] = [];
    return this.firestore.collection(this.TAG).snapshotChanges();
  }
}
