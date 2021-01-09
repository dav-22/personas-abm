import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs/internal/Observable';
import { Persona } from '../models/persona.model';
import { firebaseApp } from '../services/firebase.service';
import firebase from 'firebase/app';

const db = firebase.firestore(firebaseApp);
@Injectable({
  providedIn: 'root',
})
export class PersonaService {
  TAG: string = 'personas';

  constructor(private firestore: AngularFirestore) {}

  getAll() {
    return this.firestore.collection(this.TAG).snapshotChanges();
  }

  getAllAnother() {
    const persona = [];
    return db.collection(this.TAG).get();
  }

  getById(id: string) {
    return db.collection(this.TAG).doc(id).get();
  }

  add(persona: Persona) {
    return db.collection(this.TAG).add(persona);
  }

  delete(id: string) {
    return db.collection(this.TAG).doc(id).delete();
  }

  update(id: string, persona: Persona) {
    return db.collection(this.TAG).doc(id).update(persona);
  }
}
