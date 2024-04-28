import React from 'react';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import {Link, Tabs} from 'expo-router';
import {Linking, Pressable} from 'react-native';
import Colors from '@/constants/Colors';
import {useColorScheme} from '@/components/useColorScheme';
import {useClientOnlyValue} from '@/components/useClientOnlyValue';

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
                headerShown: useClientOnlyValue(false, true),
                tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
                tabBarShowLabel: false,
            }}>
            <Tabs.Screen
                name="index"
                options={{
                    title: 'Home',
                    headerTitle: '',
                    headerTransparent: true,
                    tabBarIcon: ({color}) => <TabBarIcon
                        name="home"
                        color={color}
                    />,
                    headerLeft: () => (
                        <Pressable onPress={() => Linking.openURL('https://aplicaciones.udlap.mx/accesos/Login.aspx')}>
                            {({pressed}) => (
                                <FontAwesome
                                    name="qrcode"
                                    size={40}
                                    color={Colors[colorScheme ?? 'light'].text}
                                    style={{marginLeft: 15, opacity: pressed ? 0.5 : 1}}
                                />
                            )}
                        </Pressable>
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
