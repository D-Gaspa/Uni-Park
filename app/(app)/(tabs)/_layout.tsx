import React from 'react';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import {Link, Tabs} from 'expo-router';
import {Linking, Pressable} from 'react-native';
import Colors from '@/constants/Colors';
import {useColorScheme} from '@/components/useColorScheme';
import {useClientOnlyValue} from '@/components/useClientOnlyValue';

const constantStrings = {
    url: 'https://aplicaciones.udlap.mx/accesos/Login.aspx',
};

function TabBarIcon(props: {
    name: React.ComponentProps<typeof FontAwesome>['name'];
    color: string;
}) {
    return <FontAwesome size={28} style={{marginBottom: -3}} {...props} />;
}

export default function TabLayout() {
    const colorScheme = useColorScheme();

// Define common options for headerRight
    const headerRight = () => (
        <Link href="/faq" asChild>
            <Pressable>
                {({pressed}) => (
                    <FontAwesome
                        name="question-circle-o"
                        size={25}
                        color={Colors[(colorScheme ?? 'light') as 'light' | 'dark' | 'dim'].text}
                        style={{marginRight: 15, opacity: pressed ? 0.5 : 1}}
                    />
                )}
            </Pressable>
        </Link>
    );

    return (
        <Tabs
            screenOptions={{
                headerShown: useClientOnlyValue(true),
                tabBarActiveTintColor: Colors[(colorScheme) as 'light' | 'dark' | 'dim'].tint,
                tabBarShowLabel: false,
            }}
        >
            {/* Home Screen */}
            <Tabs.Screen
                name="index"
                options={{
                    title: 'Home',
                    headerTitle: '',
                    headerTransparent: true,
                    tabBarIcon: ({color}) => <TabBarIcon name="home" color={color}/>,
                    headerLeft: () => (
                        <Pressable onPress={() => Linking.openURL(constantStrings.url)}>
                            {({pressed}) => (
                                <FontAwesome
                                    name="qrcode"
                                    size={40}
                                    color={Colors[(colorScheme ?? 'light') as 'light' | 'dark' | 'dim'].text}
                                    style={{marginLeft: 15, opacity: pressed ? 0.5 : 1}}
                                />
                            )}
                        </Pressable>
                    ),
                    headerRight,
                }}
            />

            {/* Ticket Screen */}
            <Tabs.Screen
                name="ticket"
                options={{
                    title: 'Ticket',
                    tabBarIcon: ({color}) => <TabBarIcon name="ticket" color={color}/>,
                    headerTransparent: true,
                    headerRight,
                }}
            />

            {/* Report Screen */}
            <Tabs.Screen
                name="report"
                options={{
                    title: 'Report',
                    headerTitle: 'Report Accident',
                    tabBarIcon: ({color}) => <TabBarIcon name="warning" color={color}/>,
                    headerTransparent: true,
                    headerRight,
                }}
            />

            {/* Settings Screen */}
            <Tabs.Screen
                name="settings"
                options={{
                    title: 'Settings',
                    tabBarIcon: ({color}) => <TabBarIcon name="cog" color={color}/>,
                    headerTransparent: true,
                    headerRight,
                }}
            />
        </Tabs>
    );
}
