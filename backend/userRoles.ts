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

export async function getUserTickets(user: string): Promise<string[] | null> {
    const docRef = doc(userRoles, "user-roles", user);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
        const list_tickets = docSnap.data().list_tickets;
        if (Array.isArray(list_tickets) && list_tickets.every(item => typeof item === 'string')) {
            return list_tickets; 
        } else {
            console.log("list_tickets is not an array of strings!");
            return null;
        }
    } else {
        console.log("No such document!");
        return null;
    }
}