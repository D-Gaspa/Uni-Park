import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, Button, Image, TouchableOpacity } from 'react-native';
import { useColorScheme } from 'react-native';
import * as ImagePicker from 'expo-image-picker';


export default function ReportScreen() {
    const colorScheme = useColorScheme();
    const styles = Styles(colorScheme);

    const [form, setForm] = useState({
        title: '',
        priority: '',
        description: '',
        image: null,
        email: 'user@example.com' // This should be dynamically fetched based on the user's session
    });

    const handleInputChange = (name: string, value: string) => {
        setForm({...form, [name]: value});
    };

    const handleSubmit = async () => {
        console.log(form); // Here you would normally handle the Firebase DB integration
        alert('Report submitted!');
    };

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        console.log(result);

        //if (!result.cancelled) {
          //  setForm({...form, image: result.uri});
        //}
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Report an Accident</Text>
            <TextInput
                style={styles.input}
                placeholder="Title"
                value={form.title}
                onChangeText={(text) => handleInputChange('title', text)}
            />
            <TextInput
                style={styles.input}
                placeholder="Priority Level"
                value={form.priority}
                onChangeText={(text) => handleInputChange('priority', text)}
            />
            <TextInput
                style={[styles.input, styles.description]}
                placeholder="Description"
                value={form.description}
                onChangeText={(text) => handleInputChange('description', text)}
                multiline={true}
            />
            <TouchableOpacity onPress={pickImage} style={styles.button}>
                <Text style={styles.buttonText}>Pick an image</Text>
            </TouchableOpacity>
            {form.image && <Image source={{ uri: form.image }} style={styles.image} />}
            <Button title="Submit Report" onPress={handleSubmit} />
        </View>
    );
};

const Styles = (colorScheme: string | null | undefined) => StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colorScheme === 'dark' ? '#000' : '#fff',
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        color: colorScheme === 'dark' ? '#fff' : '#000',
    },
    input: {
        width: '80%',
        padding: 10,
        marginVertical: 10,
        borderWidth: 1,
        borderColor: colorScheme === 'dark' ? '#fff' : '#000',
        backgroundColor: colorScheme === 'dark' ? '#555' : '#eee',
        color: colorScheme === 'dark' ? '#fff' : '#000',
    },
    description: {
        height: 100,
    },
    button: {
        backgroundColor: '#007BFF',
        padding: 10,
        margin: 10,
    },
    buttonText: {
        color: '#fff',
    },
    image: {
        width: 100,
        height: 100,
        margin: 10,
    },
});