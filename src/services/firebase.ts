import * as firebase from 'firebase/app';

import { 
  GoogleAuthProvider,
  getAuth,
  onAuthStateChanged,
  signInWithPopup,
} from 'firebase/auth';
import { ref, getDatabase, set, push, get } from 'firebase/database';

const firebaseConfig = {
    apiKey: import.meta.env.VITE_API_KEY,
    authDomain: import.meta.env.VITE_AUTH_DOMAIN,
    databaseURL: import.meta.env.VITE_DATABASE_URL,
    projectId: import.meta.env.VITE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_APP_ID
  };


const app = firebase.initializeApp(firebaseConfig);

const auth = getAuth(app);
const database = getDatabase();

const onAuthStateChange = onAuthStateChanged;
const googleProvider = new GoogleAuthProvider();
const signInWithGoogle = async () => {
    const res = await signInWithPopup(auth, googleProvider);
    return res.user;
}

export { firebase, auth, database, signInWithGoogle, onAuthStateChange, set, ref, push, get }


