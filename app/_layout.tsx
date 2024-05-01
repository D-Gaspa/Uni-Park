import {Slot} from "expo-router";
import {SessionProvider} from "@/components/AuthContext";
import {useColorScheme} from "@/components/useColorScheme";
import {DarkTheme, DefaultTheme, ThemeProvider} from "@react-navigation/native";
// import {initializeFirebase} from "@/backend/firebaseInit";

export {
    // Catch any errors thrown by the Layout component.
    ErrorBoundary,
} from "expo-router";



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
