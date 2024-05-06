import {DarkTheme, DefaultTheme, ThemeProvider} from '@react-navigation/native';
import {Redirect, Stack} from 'expo-router';
import {useColorSchemeWithSession} from '@/components/useColorScheme';
import {useSession} from '@/components/AuthContext';
import {useFonts} from "expo-font";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import {useEffect, useState} from "react";
import * as SplashScreen from "expo-splash-screen";
import Colors from "@/constants/Colors";
import darkTheme from "@react-navigation/native/src/theming/DarkTheme";

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

const BlueTheme = {
    ...darkTheme,
    colors: {
        ...darkTheme.colors,
        card: Colors.blue.tabLayoutBackground,
        text: Colors.blue.text,
        notification: Colors.blue.warning,
    },
};

function AppLayoutNav() {
    const colorScheme = useColorSchemeWithSession();
    const [theme, setTheme] = useState(DefaultTheme); // Set initial theme to DefaultTheme

    useEffect(() => {
        // Update theme when colorScheme changes
        switch (colorScheme) {
            case 'dark':
                setTheme(DarkTheme);
                break;
            case 'blue':
                setTheme(BlueTheme);
                break;
            default:
                setTheme(DefaultTheme);
                break;
        }
    }, [colorScheme]);

    return (
        <ThemeProvider value={theme}>
            <Stack>
                <Stack.Screen name="(tabs)" options={{headerShown: false}}/>
                <Stack.Screen
                    name="faq"
                    options={{
                        presentation: 'modal',
                        title: 'FAQ',
                        headerTransparent: true,
                    }}
                />
            </Stack>
        </ThemeProvider>
    );
}