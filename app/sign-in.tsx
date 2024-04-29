import {Linking, StyleSheet, TextInput, TouchableOpacity} from 'react-native';
import {Text, useThemeColor, View} from '@/components/Themed';
import {useSession} from '@/components/AuthContext';
import React from "react";
import {router} from "expo-router";

export default function SignIn() {
    const {signIn} = useSession();
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');
    const textColor = useThemeColor({light: 'black', dark: 'white'}, 'text');
    const backgroundColor = useThemeColor({light: 'white', dark: 'black'}, 'background');
    const [error, setError] = React.useState('');

    const handleSignIn = async () => {
        const success = await signIn(email, password);
        if (success) {
            // Navigate to home screen
            router.replace('/');
        } else {
            // Display error message and do not navigate
            setError('Failed to sign in. Please check your credentials.');
        }
    };

    return (
        <View style={[styles.container, {backgroundColor}]}>
            <TextInput
                style={[styles.input, {color: textColor}]}
                value={email}
                onChangeText={setEmail}
                placeholder="Email"
                placeholderTextColor={textColor}
            />
            <TextInput
                style={[styles.input, {color: textColor}]}
                value={password}
                onChangeText={setPassword}
                placeholder="Password"
                secureTextEntry
                placeholderTextColor={textColor}
            />
            {error ? <Text style={styles.errorText}>{error}</Text> : null}
            <TouchableOpacity style={styles.button} onPress={handleSignIn}>
                <Text style={styles.buttonText}>Sign In</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => Linking.openURL('https://inscripciones.udlap.mx/desbloqueoCuenta')}>
                <Text style={[styles.forgotPassword, {color: textColor}]}>Forgot password?</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    input: {
        width: '85%',
        padding: 10,
        marginVertical: 10,
        borderWidth: 1,
        borderRadius: 5,
    },
    button: {
        backgroundColor: '#1E90FF',
        padding: 10,
        borderRadius: 5,
        marginTop: 10,
        width: '85%',
        alignItems: 'center',
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
    },
    forgotPassword: {
        marginTop: 15,
        textDecorationLine: 'underline',
    },
    errorText: {
        color: 'red',
        marginBottom: 10,
    },
});