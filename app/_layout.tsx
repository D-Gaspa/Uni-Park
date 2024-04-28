import {Slot} from "expo-router";
import {SessionProvider} from "@/components/AuthContext.tsx";
import {useColorScheme} from "@/components/useColorScheme";
import {DarkTheme, DefaultTheme, ThemeProvider} from "@react-navigation/native";
import {initializeAuth, getReactNativePersistence} from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {firebaseConfig} from "@/firebaseConfig";
import {initializeApp} from "firebase/app";
import {Platform} from "react-native";
import {getDatabase} from "firebase/database";

export {
    // Catch any errors thrown by the Layout component.
    ErrorBoundary,
} from "expo-router";

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Auth with AsyncStorage for Android and iOS
if (Platform.OS !== "web") {
    initializeAuth(app, {
        persistence: getReactNativePersistence(AsyncStorage),
    });
}

const db = getDatabase(app);

export {db};

export default function Root() {
    return (
        <ThemeProvider
            value={useColorScheme() === "dark" ? DarkTheme : DefaultTheme}
        >
            <SessionProvider>
                <Slot/>
            </SessionProvider>
        </ThemeProvider>
    );
}
