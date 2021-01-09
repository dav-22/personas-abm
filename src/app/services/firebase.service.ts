import firebase from 'firebase/app';
import { environment } from '../../environments/environment';

export const firebaseApp = firebase.initializeApp(environment.firebaseConfig);
