import React from 'react';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import {Link, Tabs} from 'expo-router';
import {Pressable} from 'react-native';

import Colors from '@/constants/Colors';
import {useColorScheme} from '@/components/useColorScheme';
import {useClientOnlyValue} from '@/components/useClientOnlyValue';

// You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
function TabBarIcon(props: {
    name: React.ComponentProps<typeof FontAwesome>['name'];
    color: string;
}) {
    return <FontAwesome size={28} style={{marginBottom: -3}} {...props} />;
}

export default function TabLayout() {
    const colorScheme = useColorScheme();

    return (
        <Tabs
            screenOptions={{
                tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
                // Disable the static render of the header on web
                // to prevent a hydration error in React Navigation v6.
                headerShown: useClientOnlyValue(false, true),
            }}>
            <Tabs.Screen
                name="index"
                options={{
                    title: 'Home',
                    headerTitle: '',
                    tabBarIcon: ({color}) => <TabBarIcon name="home" color={color}/>,
                    headerTransparent: true,
                    headerLeft: () => (
                        <Link href="/qr" asChild>
                            <Pressable>
                                {({pressed}) => (
                                    <FontAwesome
                                        name="qrcode"
                                        size={40}
                                        color={Colors[colorScheme ?? 'light'].text}
                                        style={{marginLeft: 15, opacity: pressed ? 0.5 : 1}}
                                    />
                                )}
                            </Pressable>
                        </Link>
                    ),
                    headerRight: () => (
                        <Link href="/faq" asChild>
                            <Pressable>
                                {({pressed}) => (
                                    <FontAwesome
                                        name="question-circle-o"
                                        size={25}
                                        color={Colors[colorScheme ?? 'light'].text}
                                        style={{marginRight: 15, opacity: pressed ? 0.5 : 1}}
                                    />
                                )}
                            </Pressable>
                        </Link>
                    ),
                }}
            />
            <Tabs.Screen
                name="ticket"
                options={{
                    title: 'Ticket',
                    // headerTitle: '',
                    tabBarIcon: ({color}) => <TabBarIcon name="ticket" color={color}/>,
                    headerTransparent: true,
                    headerRight: () => (
                        <Link href="/faq" asChild>
                            <Pressable>
                                {({pressed}) => (
                                    <FontAwesome
                                        name="question-circle-o"
                                        size={25}
                                        color={Colors[colorScheme ?? 'light'].text}
                                        style={{marginRight: 15, opacity: pressed ? 0.5 : 1}}
                                    />
                                )}
                            </Pressable>
                        </Link>
                    ),
                }}
            />
            <Tabs.Screen
                name="report"
                options={{
                    title: 'Report',
                    headerTitle: 'Report Accident',
                    tabBarIcon: ({color}) => <TabBarIcon name="warning" color={color}/>,
                    headerTransparent: true,
                    headerRight: () => (
                        <Link href="/faq" asChild>
                            <Pressable>
                                {({pressed}) => (
                                    <FontAwesome
                                        name="question-circle-o"
                                        size={25}
                                        color={Colors[colorScheme ?? 'light'].text}
                                        style={{marginRight: 15, opacity: pressed ? 0.5 : 1}}
                                    />
                                )}
                            </Pressable>
                        </Link>
                    ),
                }}
            />
            <Tabs.Screen
                name="settings"
                options={{
                    title: 'Settings',
                    // headerTitle: '',
                    tabBarIcon: ({color}) => <TabBarIcon name="cog" color={color}/>,
                    headerTransparent: true,
                    headerRight: () => (
                        <Link href="/faq" asChild>
                            <Pressable>
                                {({pressed}) => (
                                    <FontAwesome
                                        name="question-circle-o"
                                        size={25}
                                        color={Colors[colorScheme ?? 'light'].text}
                                        style={{marginRight: 15, opacity: pressed ? 0.5 : 1}}
                                    />
                                )}
                            </Pressable>
                        </Link>
                    ),
                }}
            />
        </Tabs>
    );
}
