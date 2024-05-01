import { getApps, initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getReactNativePersistence, initializeAuth } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";

const firebaseConfig = {
  apiKey: "AIzaSyBk0FYGZ1a3lSpul6CmF2CFFl7Bhp3qoWE",
  authDomain: "uni-park-9ac04.firebaseapp.com",
  projectId: "uni-park-9ac04",
  storageBucket: "uni-park-9ac04.appspot.com",
  messagingSenderId: "255781547195",
  appId: "1:255781547195:web:8179da3dc2fc2fc7808c38d9e",
  measurementId: "G-BMKFLX250S"
};

let app;
if (!getApps().length) {
    app = initializeApp(firebaseConfig);
    if (Platform.OS !== "web") {
        initializeAuth(app, {
            persistence: getReactNativePersistence(AsyncStorage),
        });
    }
} else {
    app = getApps()[0];
}
export const auth = getAuth(app);
export const db = getDatabase(app);
export const userRoles = getFirestore(app);