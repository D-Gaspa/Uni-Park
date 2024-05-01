import {onValue, ref, set} from "firebase/database";
import {useEffect, useState} from "react";
import {auth, db} from "@/firebase-config";

interface TicketTypes {
    [key: string]: string[];
}

export async function loadUserTicket(ticket: string, type: string) {
    const user = auth.currentUser?.uid;

    const ticketsRef = ref(db, `users/${user}/tickets/${type}`);

    try {
        await set(ticketsRef, {ticketId: ticket});
    } catch (error) {
        console.error("Failed to create new ticket:", error);
    }
}

export async function checkExistingTicket(type: string) {
    const user = auth.currentUser?.uid;

    const ticketRef = ref(db, `users/${user}/tickets/${type}`);
    let ticketExists = false;

    onValue(ticketRef, (snapshot) => {
        ticketExists = snapshot.exists();
    });

    return ticketExists;
}

export function useUserTickets() {
    const user = auth.currentUser?.uid;
    const [tickets, setTickets] = useState<TicketTypes | null>(null);

    useEffect(() => {
        const ticketsRef = ref(db, `users/${user}/tickets`);
        const unsubscribe = onValue(ticketsRef, (snapshot) => {
            const data = snapshot.val();
            const ticketTypes: TicketTypes = {};
            if (data) {
                for (const type in data) {
                    if (data.hasOwnProperty(type) && data[type].ticketId) {
                        ticketTypes[type] = [data[type].ticketId];
                    }
                }
            }
            setTickets(ticketTypes);
        });

        return () => {
            unsubscribe();  // Clean up the subscription
        };
    }, []);

    return tickets;
}
