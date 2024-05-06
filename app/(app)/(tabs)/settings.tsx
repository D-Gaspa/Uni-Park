import React from 'react';
import {Button, Platform, StyleSheet, Text} from 'react-native';
import {useSession} from '@/components/AuthContext';
import {MaterialIcons} from '@expo/vector-icons';
import {useColorSchemeWithSession} from "@/components/useColorScheme";
import {Picker, useThemeColor} from "@/components/Themed";
import {View} from "@/components/Themed";

export default function SettingsScreen() {
    const {signOut, email, role, theme, setTheme} = useSession();
    const colorScheme = useColorSchemeWithSession();
    const styles = Styles(colorScheme);
    const textColor = useThemeColor({}, 'text');
    const labelColor = useThemeColor({}, 'label');
    const buttonBackground = useThemeColor({}, 'buttonExitBackground');

    return (
        <View style={styles.container}>
            {/* User Information Header */}
            <Text style={[styles.header, {color: textColor}]}>User Information</Text>

            {/* Email Display */}
            <View style={styles.settingItem}>
                <Text style={[styles.label, {color: labelColor}]}>Email:</Text>
                <Text style={[styles.value, {color: textColor}]}>{email}</Text>
            </View>

            {/* Role Display */}
            <View style={styles.settingItem}>
                <Text style={[styles.label, {color: labelColor}]}>Role:</Text>
                <Text style={[styles.value, {color: textColor}]}>{role}</Text>
            </View>

            {/* Separator */}
            <View style={styles.separator}/>

            {/* User Settings Header */}
            <Text style={[styles.header, {color: textColor}]}>User Settings</Text>

            {/* Theme Setting */}
            <View style={styles.settingItem}>
                <Text style={[styles.label, {color: labelColor}]}>Theme:</Text>
                <Picker
                    selectedValue={theme || 'light'}
                    style={styles.input}
                    itemStyle={{color: textColor}}
                    onValueChange={(itemValue) => {
                        if (itemValue !== null) {
                            setTheme(itemValue);
                        }
                    }}
                >
                    <Picker.Item label="Light" value="light"/>
                    <Picker.Item label="Blue" value="blue"/>
                    <Picker.Item label="Dark" value="dark"/>
                </Picker>
            </View>

            {/* Sign Out Button */}
            <View style={styles.buttonContainer}>
                <MaterialIcons name="logout" size={24} color={buttonBackground}/>
                <Button
                    title="Sign Out"
                    color={buttonBackground}
                    onPress={signOut}
                />
            </View>
        </View>
    );
}

const Styles = (colorScheme: string | null | undefined) => StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 20,
    },
    header: {
        alignSelf: 'center',
        fontSize: 18,
        fontWeight: 'bold',
        marginTop: 5,
        marginBottom: 5,
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
        borderRadius: Platform.OS === "ios" ? 10 : 0, // Rounded edges for iOS, none for Android
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
    },
    value: {
        fontSize: 16,
    },
    buttonContainer: {
        marginTop: 20,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center', // Center the button horizontally
    },
});
