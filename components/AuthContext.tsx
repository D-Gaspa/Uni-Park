import React from 'react';
import {getAuth, signInWithEmailAndPassword} from "firebase/auth";
import {useStorageState} from './useStorageState';
import {getUserRole} from "@/backend/userRoles";

const AuthContext = React.createContext<{
    signIn: (email: string, password: string) => Promise<boolean>;
    signOut: () => void;
    session?: string | null;
    isLoading: boolean;
    role?: string | null;
    email: string | null;
}>({
    signIn: () => Promise.resolve(false),
    signOut: () => null,
    session: null,
    isLoading: false,
    role: null,
    email: null,
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
    const [[isLoading, session], setSession] = useStorageState('session');
    const auth = getAuth();
    const [[, role], setRole] = useStorageState('role');
    const [[, email], setEmail] = useStorageState('email');

    const updateEmail = () => {
        const auth = getAuth();
        const user = auth.currentUser;
        if (user) {
            setEmail(user.email);
        }
    };

    const signIn = async (email: string, password: string): Promise<boolean> => {
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
            setSession(user.uid);

            // Set the user's role
            const role = await getUserRole(user.uid);
            setRole(role);

            // Update the email
            updateEmail();

            return true;
        } catch (error) {
            console.error(error);
            return false;
        }
    };

    const signOut = () => {
        setSession(null);
        setRole(null);
    };

    return (
        <AuthContext.Provider
            value={{
                signIn,
                signOut,
                session,
                isLoading,
                role,
                email,
            }}>
            {props.children}
        </AuthContext.Provider>
    );
}