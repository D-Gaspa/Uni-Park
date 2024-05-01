import {doc, getDoc} from "firebase/firestore";
import {userRoles} from "@/backend/firebaseInit";

export async function getUserRole(user: string) {
    const docRef = doc(userRoles, "user-roles", user);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
        return docSnap.data().role; // returns "student", "teacher", or "admin"
    } else {
        console.log("No such document!");
        return null;
    }
}
