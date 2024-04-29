import {FirebaseApp, initializeApp} from "firebase/app";
import {Database, getDatabase} from "firebase/database";
import {getReactNativePersistence, initializeAuth} from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {Platform} from "react-native";
import {firebaseConfig} from "@/firebase-config";
import {Firestore, getFirestore} from "firebase/firestore";

let app: FirebaseApp;
let db : Database;
let userRoles: Firestore;

export function initializeFirebase() {
    // Initialize Firebase
    app = initializeApp(firebaseConfig);
    db = getDatabase(app);
    userRoles = getFirestore(app);

    // Initialize Firebase Auth with AsyncStorage for Android and iOS
    if (Platform.OS !== "web") {
        initializeAuth(app, {
            persistence: getReactNativePersistence(AsyncStorage),
        });
    }
}

export {app, db, userRoles};