import { onValue, ref, set, remove } from "firebase/database";
import { db } from "@/backend/firebaseInit";
import { getAuth } from "firebase/auth";
import { useEffect, useState } from "react";

const auth = getAuth();
const user = auth.currentUser?.uid;

interface TicketTypes {
  [key: string]: string[];
}

export async function deleteUserTicket(type: string) {
  const ticketRef = ref(db, `users/${user}/tickets/${type}`);

  try {
    //await remove(ticketRef);
    console.log(`Successfully deleted the ticket of type: ${type}`);
  } catch (error) {
    console.error("Failed to delete ticket:", error);
  }
}

export async function loadUserTicket(ticket: string, type: string) {
  const ticketsRef = ref(db, `users/${user}/tickets/${type}`);

  try {
    await set(ticketsRef, { ticketId: ticket });
  } catch (error) {
    console.error("Failed to create new ticket:", error);
  }
}

export async function checkExistingTicket(type: string) {
  const ticketRef = ref(db, `users/${user}/tickets/${type}`);
  let ticketExists = false;

  onValue(ticketRef, (snapshot) => {
    ticketExists = snapshot.exists();
  });

  return ticketExists;
}

export function useUserTickets() {
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

export async function getUserCurrency() {
  const currencyRef = ref(db, `users/${user}/currency/`);
  let currency: string | null = null;

  onValue(currencyRef, (snapshot) => {
    currency = snapshot.val();
  });

  return currency;
}
