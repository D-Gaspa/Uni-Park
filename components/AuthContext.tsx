import React from 'react';
import {getAuth, signInWithEmailAndPassword} from "firebase/auth";
import {useStorageState} from './useStorageState';
import {getPreferredTheme, getUserRole, setUserTheme} from "@/components/userRelatedInfo";

export const AuthContext = React.createContext<{
    signIn: (email: string, password: string) => Promise<boolean>,
    signOut: () => void;
    session?: string | null;
    isLoading: boolean;
    role?: string | null;
    email: string | null;
    theme?: string | null;
    setTheme: (theme: string) => void;
}>({
    signIn: () => Promise.resolve(false),
    signOut: () => null,
    session: null,
    isLoading: false,
    role: null,
    email: null,
    theme: null,
    setTheme: () => null,
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
    const [[, theme], setTheme] = useStorageState('theme');

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

            const role = await getUserRole(user.uid);
            setRole(role);

            const preferredTheme = await getPreferredTheme(user.uid);
            setTheme(preferredTheme);

            // Update the email
            updateEmail();

            return true;
        } catch (error) {
            console.error(error);
            return false;
        }
    };

    const updateTheme = (theme: string) => {
        // Update the theme in the state
        setTheme(theme);

        // Update the preferred theme in the database
        if (session) {
            setUserTheme(session, theme)
                .then(() => {
                    // Handle successful update here if needed
                })
                .catch((error) => {
                    // Handle any errors here
                    console.error("Failed to update theme:", error);
                });
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
                theme,
                setTheme: updateTheme,
            }}>
            {props.children}
        </AuthContext.Provider>
    );
}
