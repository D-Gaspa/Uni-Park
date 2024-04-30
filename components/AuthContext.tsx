import React from 'react';
import {getAuth, signInWithEmailAndPassword} from "firebase/auth";
import {useStorageState} from './useStorageState';
import {getUserRole, getUserTickets} from "@/backend/userRoles";

export const AuthContext = React.createContext<{
    signIn: (email: string, password: string) => Promise<boolean>;
    signOut: () => void;
    session?: string | null;
    isLoading: boolean;
    role?: string | null;
    tickets?: string[] | null;
}>({
    signIn: () => Promise.resolve(false),
    signOut: () => null,
    session: null,
    isLoading: false,
    role: null,
    tickets: null,
});

export function useSession() {
    const value = React.useContext(AuthContext);
    if (process.env.NODE_ENV !== 'production') {
        if (!value) {
            throw new Error('useSession must be wrapped in a <SessionProvider />');
        }
    }
    return value;
}

export function SessionProvider(props: React.PropsWithChildren<{}>) {
    const [[isLoading, session], setSession] = useStorageState<string>('session', '');
    const auth = getAuth();
    const [[, role], setRole] = useStorageState<string>('role', '');
    const [[,tickets], setTickets] = useStorageState<string[]>('list_tickets', []); 

    const signIn = async (email: string, password: string): Promise<boolean> => {
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
            setSession(user.uid);

            const role = await getUserRole(user.uid);
            setRole(role);

            const tickets = await getUserTickets(user.uid);
            setTickets(tickets);

            return true;
        } catch (error) {
            console.error(error);
            return false;
        }
    };

    const signOut = () => {
        setSession(null);
        setRole(null);
        setTickets([]);
    };

    return (
        <AuthContext.Provider
            value={{
                signIn,
                signOut,
                session,
                isLoading,
                role,
                tickets
            }}>
            {props.children}
        </AuthContext.Provider>
    );
}
