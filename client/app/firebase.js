// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { 
    getFirestore, 
    collection, 
    getDocs,
    addDoc,
    doc,
} from 'firebase/firestore/lite'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// create a file firebase_credentials.js in the root directory
// the credentials can be obtained from firebase after creating a project
import firebaseConfig from "../firebase_credentials";

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app)

export const getUsers = async () => {
    const users = await getDocs(collection(db, "users")).then(snapshot => 
        snapshot.docs.map(doc => doc.data())
    )
    return users
}

export const addMsg = async msg => {
    const docRef = await addDoc(collection(db, "messages"), msg)
}

export default db