import React from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, Image } from 'react-native';

export default function TabFourScreen() {
    return (
        <View style={styles.container}>
            <Text style={styles.headerText}>Edit profile</Text>
            <View style={styles.profileImageContainer}>
            <Image
                source={require('/Users/maemazcort/Documents/UDLAP/6to/Software/Uni-Park/assets/images/icon.png')}
                style={styles.profileImage}
            />
            </View>
            <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Name</Text>
                <TextInput style={styles.input} placeholder="Tu nombre completo" />
                <Text style={styles.inputLabel}>ID</Text>
                <TextInput style={styles.input} placeholder="Tu ID" keyboardType="numeric" />
                <Text style={styles.inputLabel}>Telephone</Text>
                <TextInput style={styles.input} placeholder="Tu número de teléfono" keyboardType="phone-pad" />
            </View>
            <TouchableOpacity style={styles.saveButton}>
                <Text style={styles.saveButtonText}>Save</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
    headerText: {
        fontSize: 22,
        fontWeight: 'bold',
        marginTop: 30, 
        marginLeft: 20, 
    },
    profileImageContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 20, 
        marginBottom: 20,
    },
    profileImage: {
        width: 150, 
        height: 150,
        borderRadius: 60, 
    },
    inputContainer: {
        margin: 20,
    },
    inputLabel: {
        fontSize: 16,
        color: 'black',
        marginBottom: 5,
    },
    input: {
        borderWidth: 1,
        borderColor: 'grey',
        borderRadius: 5,
        padding: 10,
        marginBottom: 20,
    },
    saveButton: {
        backgroundColor: 'orange',
        borderRadius: 5,
        padding: 15,
        margin: 20,
        alignItems: 'center',
    },
    saveButtonText: {
        fontSize: 18,
        color: 'white',
        fontWeight: 'bold',
    },
    // Add any additional styles you need here
});
