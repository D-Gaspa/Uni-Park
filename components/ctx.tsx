import React from 'react';
import {getAuth, signInWithEmailAndPassword} from "firebase/auth";
import {useStorageState} from './useStorageState';

const AuthContext = React.createContext<{
    signIn: (email: string, password: string) => Promise<boolean>;
    signOut: () => void;
    session?: string | null;
    isLoading: boolean;
}>({
    signIn: () => Promise.resolve(false),
    signOut: () => null,
    session: null,
    isLoading: false,
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

    const signIn = async (email: string, password: string): Promise<boolean> => {
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
            setSession(user.uid);
            return true;
        } catch (error) {
            console.error(error);
            return false;
        }
    };


    const signOut = () => {
        setSession(null);
    };

    return (
        <AuthContext.Provider
            value={{
                signIn,
                signOut,
                session,
                isLoading,
            }}>
            {props.children}
        </AuthContext.Provider>
    );
}