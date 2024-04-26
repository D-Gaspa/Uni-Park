import {DarkTheme, DefaultTheme, ThemeProvider} from '@react-navigation/native';
import {Redirect, Stack} from 'expo-router';
import {useColorScheme} from '@/components/useColorScheme';
import {useSession} from '@/components/AuthContext.tsx';
import {useFonts} from "expo-font";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import {useEffect} from "react";
import * as SplashScreen from "expo-splash-screen";

export const unstable_settings = {
    // Ensure that reloading on any modal keeps a back button present.
    initialRouteName: '(tabs)',
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync().then(r => r);

export default function AppLayout() {
    const {session} = useSession();

    const [loaded, error] = useFonts({
        SpaceMono: require('@/assets/fonts/SpaceMono-Regular.ttf'),
        ...FontAwesome.font,
    });

    useEffect(() => {
        if (error) throw error;
    }, [error]);

    useEffect(() => {
        if (loaded) {
            SplashScreen.hideAsync().then(r => r);
        }
    }, [loaded]);

    if (!loaded) {
        return null;
    }

    if (!session) {
        return <Redirect href="/sign-in"/>;
    }

    return <AppLayoutNav/>;
}

function AppLayoutNav() {
    const colorScheme = useColorScheme();

    return (
        <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
            <Stack>
                <Stack.Screen name="(tabs)" options={{headerShown: false}}/>
                <Stack.Screen
                    name="qr"
                    options={{
                        presentation: 'modal',
                        title: 'QR Code',
                        // headerTitle: '',
                        headerTransparent: true,
                    }}
                />
                <Stack.Screen
                    name="faq"
                    options={{
                        presentation: 'modal',
                        title: 'FAQ',
                        // headerTitle: '',
                        headerTransparent: true,
                    }}
                />
            </Stack>
        </ThemeProvider>
    );
}