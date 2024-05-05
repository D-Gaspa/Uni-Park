import React from 'react';
import { StyleSheet, Button, Text, View } from 'react-native';
import { useSession } from '@/components/AuthContext';
import { MaterialIcons } from '@expo/vector-icons'; // Ensure you have @expo/vector-icons installed

export default function SettingsScreen() {
    const { signOut, email } = useSession();

    return (
        <View style={styles.container}>
            <Text style={styles.title}></Text>
            <View style={styles.settingItem}>
                <Text style={styles.label}>Email:</Text>
                <Text style={styles.value}>{email}</Text>
            </View>
            <View style={styles.buttonContainer}>
                <MaterialIcons name="logout" size={24} color="red" />
                <Button
                    title="Sign Out"
                    color="red"
                    onPress={signOut}
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center', // Centers everything vertically in the container
        padding: 20,
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#333',
        paddingVertical: 10,
        textAlign: 'center', // Center the title horizontally
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
        color: '#666',
    },
    value: {
        fontSize: 16,
        color: '#444',
    },
    buttonContainer: {
        marginTop: 20,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center', // Center the button horizontally
    },
});
