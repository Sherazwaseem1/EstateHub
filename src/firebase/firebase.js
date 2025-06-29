// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import {
    getAuth,
    signInWithPopup,
    signInWithRedirect,
    GoogleAuthProvider,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
} from "firebase/auth";
import { getFirestore, doc, setDoc, getDoc } from "firebase/firestore";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyC8FmNobDaQPRAVhy2ZH2ETqm45mmpmUHI",
    authDomain: "estatehub-f5720.firebaseapp.com",
    projectId: "estatehub-f5720",
    storageBucket: "estatehub-f5720.appspot.com",
    messagingSenderId: "57097192457",
    appId: "1:57097192457:web:b777fe3a19c5ac0277a4d8"
  };
  

// Initialize Firebase
const FireBaseApp = initializeApp(firebaseConfig);


const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: "select_account" });
export const auth = getAuth();
export const signInWithPopUpGoogle = () => signInWithPopup(auth, googleProvider);
export const signInWithGooglleRedirect = () => signInWithRedirect(auth, googleProvider);
export const db = getFirestore();

export const createUserProfileFromAuth = async (userAuth,additionalInfo = {}) => {
    if (!userAuth) return;
    
    const userDocumentReference = doc(db, "users", userAuth.uid);
    console.log(userDocumentReference);
    const userSnapShot = await getDoc(userDocumentReference);
    console.log(userSnapShot);
    console.log(userSnapShot.exists());

    if (!userSnapShot.exists()) {
        const { displayName, email } = userAuth;
        const createdAt = new Date();
        try {
            await setDoc(userDocumentReference, {
                displayName,
                email,
                createdAt,
                ...additionalInfo,
            });
        } catch (error) {
            console.log("error creating user", error.message);
        }
    }
    return userDocumentReference;
}

export const createAuthUserWithEmailAndPassword = async (email,password) => {
    if (!email || !password) return;
    return await createUserWithEmailAndPassword(auth, email, password);
}

export const signAuthUserWithEmailAndPassword = async (email,password) => {
    if (!email || !password) return;
    return await signInWithEmailAndPassword(auth, email, password);
}

export const SignOutUser = async () => await signOut(auth);

export const onAuthStateChangedListener = (callback) => {
    onAuthStateChanged(auth, callback)
}


