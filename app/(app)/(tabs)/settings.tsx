import React from 'react';
import {Button, StyleSheet, Text, View} from 'react-native';
import {useSession} from '@/components/AuthContext';
import {MaterialIcons} from '@expo/vector-icons';
import {useColorScheme} from "@/components/useColorScheme";

export default function SettingsScreen() {
    const {signOut, email, role} = useSession();
    const colorScheme = useColorScheme();
    const styles = Styles(colorScheme);

    return (
        <View style={styles.container}>
            {/* User Information Header */}
            <Text style={styles.header}>User Information</Text>

            {/* Email Display */}
            <View style={styles.settingItem}>
                <Text style={styles.label}>Email:</Text>
                <Text style={styles.value}>{email}</Text>
            </View>

            {/* Role Display */}
            <View style={styles.settingItem}>
                <Text style={styles.label}>Role:</Text>
                <Text style={styles.value}>{role}</Text>
            </View>

            {/* Sign Out Button */}
            <View style={styles.buttonContainer}>
                <MaterialIcons name="logout" size={24} color="red"/>
                <Button
                    title="Sign Out"
                    color="red"
                    onPress={signOut}
                />
            </View>
        </View>
    );
}

const Styles = (colorScheme: string | null | undefined) => StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center', // Centers everything vertically in the container
        padding: 20,
        backgroundColor: colorScheme === 'light' ? '#f9f9f9' : '#222',
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#333',
        paddingVertical: 10,
        textAlign: 'center', // Center the title horizontally
    },
    header: {
        alignSelf: 'center',
        fontSize: 18,
        fontWeight: 'bold',
        marginTop: 5,
        marginBottom: 5,
        color: colorScheme === "light" ? "black" : "white"
    },
    settingItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 15,
        marginHorizontal: 10,
    },
    label: {
        fontSize: 18,
        color: colorScheme === 'light' ? '#666' : '#ccc',
    },
    value: {
        fontSize: 16,
        color: colorScheme === 'light' ? '#333' : '#fff',
    },
    buttonContainer: {
        marginTop: 20,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center', // Center the button horizontally
    },
});
