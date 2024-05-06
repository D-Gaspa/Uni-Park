import React from 'react';
import {Button, Platform, StyleSheet, Text, View} from 'react-native';
import {useSession} from '@/components/AuthContext';
import {MaterialIcons} from '@expo/vector-icons';
import {useColorScheme} from "@/components/useColorScheme";
import {Picker} from "@react-native-picker/picker";

export default function SettingsScreen() {
    const {signOut, email, role, theme, setTheme} = useSession();
    const colorScheme = useColorScheme();
    const styles = Styles(colorScheme);

    // Print the theme to the console
    console.log(`Theme: ${theme}`);

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

            {/* Separator */}
            <View style={styles.separator}/>

            {/* User Settings Header */}
            <Text style={styles.header}>User Settings</Text>

            {/* Theme Setting */}
            <View style={styles.settingItem}>
                <Text style={styles.label}>Theme:</Text>
                <Picker
                    selectedValue={theme}
                    style={styles.input}
                    dropdownIconColor={colorScheme === "dark" ? "#fff" : "#000"}
                    onValueChange={(itemValue) => {
                        if (itemValue !== null) {
                            setTheme(itemValue);
                        }
                    }}
                >
                    <Picker.Item label="Light" value="light"/>
                    <Picker.Item label="Dim Dark" value="dim"/>
                    <Picker.Item label="Full Dark" value="dark"/>
                </Picker>
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
    separator: {
        width: "100%",
        height: 1,
        backgroundColor: colorScheme === "light" ? "#ccc" : "#666",
        marginVertical: 10,
    },
    input: {
        width: "80%",
        padding: 12,
        borderWidth: 1,
        borderColor: Platform.OS === "ios" ? colorScheme === "dark" ? "#aaa" : "#ddd" : "transparent",
        backgroundColor: colorScheme === "light" ? "#d1d1d1" : "#333",
        borderRadius: Platform.OS === "ios" ? 10 : 0, // Rounded edges for iOS, none for Android
        color: colorScheme === "dark" ? "#fff" : "#000",
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
