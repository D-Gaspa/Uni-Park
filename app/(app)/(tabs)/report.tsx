import React, { useState } from "react";
import {
    Alert,
    Button,
    Image,
    Keyboard,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    TouchableWithoutFeedback,
    useColorScheme,
    View
} from "react-native";
import Checkbox from "expo-checkbox";
import { Picker } from "@react-native-picker/picker";
import * as ImagePicker from "expo-image-picker";
import { sendReport } from "@/components/reportInteraction";
import { useSession } from "@/components/AuthContext";

const reportTypes = [
    "Violation Reports",
    "Maintenance Issues",
    "Safety Issues",
    "Suggestions for Improvement",
    "Feedback on Parking Enforcement",
];

export default function ReportScreen() {
    const { email } = useSession();
    const colorScheme = useColorScheme();
    const styles = Styles(colorScheme);

    const [form, setForm] = useState({
        title: "",
        typesOfReports: reportTypes[0],
        description: "",
        image: null,
        involvesYou: false,
    });

    const handleInputChange = (name, value) => {
        setForm({ ...form, [name]: value });
    };

    const handleSubmit = async () => {
        if (!email) {
            Alert.alert("Error", "Please log in to send a report.");
            return;
        }
        try {
            await sendReport({ ...form, email });
            Alert.alert("Success", "Report sent successfully.");
            setForm({
                title: "",
                typesOfReports: reportTypes[0],
                description: "",
                image: null,
                involvesYou: false,
            });
        } catch (error) {
            Alert.alert("Error", "Failed to send report: " + error);
        }
    };

    const handleImageOption = () => {
        Alert.alert(
            "Upload Photo",
            "Choose the method",
            [
                { text: "Camera", onPress: takePhoto },
                { text: "Library", onPress: pickImage },
                { text: "Cancel", style: "cancel" },
            ],
            { cancelable: true }
        );
    };

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.canceled) {
            setForm({...form, image: result.uri});
        }
    };

    const takePhoto = async () => {
        let result = await ImagePicker.launchCameraAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.canceled) {
            setForm({...form, image: result.uri});
        }
    };

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <ScrollView contentContainerStyle={styles.container}>
                <TextInput
                    style={styles.input}
                    placeholder="Title"
                    value={form.title}
                    onChangeText={(text) => handleInputChange("title", text)}
                />
                <Picker
                    selectedValue={form.typesOfReports}
                    style={styles.input}
                    onValueChange={(itemValue) => handleInputChange("typesOfReports", itemValue)}
                >
                    {reportTypes.map((type) => (
                        <Picker.Item key={type} label={type} value={type} />
                    ))}
                </Picker>
                <TextInput
                    style={[styles.input, styles.description]}
                    placeholder="Description"
                    value={form.description}
                    onChangeText={(text) => handleInputChange("description", text)}
                    multiline={true}
                />
                <View style={styles.checkboxContainer}>
                    <Checkbox
                        value={form.involvesYou}
                        onValueChange={(value) => handleInputChange("involvesYou", value)}
                        style={styles.checkbox}
                    />
                    <Text style={styles.checkboxLabel}>
                        Does this report involve you?
                    </Text>
                </View>
                <TouchableOpacity onPress={handleImageOption} style={styles.button}>
                    <Text style={styles.buttonText}>Add an image</Text>
                </TouchableOpacity>
                {form.image && (
                    <Image source={{ uri: form.image }} style={styles.image} />
                )}
                <Button title="Submit Report" onPress={handleSubmit} />
            </ScrollView>
        </TouchableWithoutFeedback>
    );
}

const Styles = (colorScheme) => StyleSheet.create({
    container: {
        flexGrow: 1,
        justifyContent: 'center', // Centers content vertically in the ScrollView
        alignItems: 'center', // Centers content horizontally
        padding: 20,
        backgroundColor: colorScheme === "dark" ? "#333" : "#f9f9f9",
    },
    input: {
        width: "90%",
        padding: 12,
        marginVertical: 8,
        borderWidth: 1,
        borderColor: colorScheme === "dark" ? "#aaa" : "#ddd",
        backgroundColor: colorScheme === "dark" ? "#555" : "#fff",
    },
    description: {
        height: 120,
        textAlignVertical: 'top',
    },
    checkboxContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    checkbox: {
        margin: 8,
    },
    checkboxLabel: {
        color: colorScheme === "dark" ? "#fff" : "#000",
    },
    button: {
        backgroundColor: "#0066cc",
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
        marginBottom: 10,
    },
    buttonText: {
        color: "#fff",
        fontWeight: 'bold',
    },
    image: {
        width: 200,
        height: 200,
        resizeMode: 'contain',
        alignSelf: 'center',
        marginBottom: 10,
    },
});
