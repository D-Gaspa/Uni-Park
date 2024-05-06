import React, {useState} from "react";
import {
    Alert,
    Button,
    Image,
    Keyboard, Platform,
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
import {Picker} from "@react-native-picker/picker";
import * as ImagePicker from "expo-image-picker";
import {sendReport} from "@/components/reportInteraction";
import {useSession} from "@/components/AuthContext";

export type FormState = {
    title: string;
    typesOfReports: string;
    description: string;
    image: string;
    involvesYou: boolean;
    email?: string;
    date?: string;
};

const reportTypes = [
    "Violation Reports",
    "Maintenance Issues",
    "Safety Issues",
    "Suggestions for Improvement",
    "Feedback on Parking Enforcement",
];

export default function ReportScreen() {
    const {email} = useSession();
    const colorScheme = useColorScheme();
    const styles = Styles(colorScheme);

    const [form, setForm] = useState({
        title: "",
        typesOfReports: reportTypes[0],
        description: "",
        image: "",
        involvesYou: false,
    });

    const handleInputChange = (name: string, value: string | boolean) => {
        setForm({...form, [name]: value});
    };

    const handleSubmit = async () => {
        if (!email) {
            Alert.alert("Error", "Please log in to send a report.");
            return;
        }
        try {
            await sendReport({...form}, email);
            Alert.alert("Success", "Report sent successfully.");
            setForm({
                title: "",
                typesOfReports: reportTypes[0],
                description: "",
                image: "",
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
                {text: "Camera", onPress: takePhoto},
                {text: "Library", onPress: pickImage},
                {text: "Cancel", style: "cancel"},
            ],
            {cancelable: true}
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
            setForm({...form, image: result.assets[0].uri});
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
            setForm({...form, image: result.assets[0].uri});
        }
    };

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <ScrollView contentContainerStyle={styles.container}>
                <Text style={styles.header}>Report an Issue</Text>
                {/* Title Input */}
                <TextInput
                    style={styles.input}
                    placeholder="Title ..."
                    placeholderTextColor={colorScheme === "dark" ? "#bbb" : "#666"}
                    value={form.title}
                    onChangeText={(text) => handleInputChange("title", text)}
                />

                {/* Report Type Picker */}
                <Picker
                    selectedValue={form.typesOfReports}
                    style={styles.input}
                    dropdownIconColor={colorScheme === "dark" ? "#fff" : "#000"}
                    onValueChange={(itemValue) => handleInputChange("typesOfReports", itemValue)}
                >
                    {reportTypes.map((type) => <Picker.Item key={type} label={type} value={type}/>)}
                </Picker>

                {/* Description Input */}
                <TextInput
                    style={[styles.input, styles.description]}
                    placeholderTextColor={colorScheme === "dark" ? "#bbb" : "#666"}
                    placeholder="Description ..."
                    value={form.description}
                    onChangeText={(text) => handleInputChange("description", text)}
                    multiline
                />

                {/* Involvement Checkbox */}
                <View style={styles.checkboxContainer}>
                    <Checkbox
                        value={form.involvesYou}
                        onValueChange={(value) => handleInputChange("involvesYou", value)}
                        style={styles.checkbox}
                    />
                    <Text style={styles.checkboxLabel}>Does this report involve you?</Text>
                </View>

                {/* Image Upload Button */}
                <TouchableOpacity onPress={handleImageOption} style={styles.button}>
                    <Text style={styles.buttonText}>Add an image</Text>
                </TouchableOpacity>

                {/* Display Selected Image */}
                {form.image && <Image source={{uri: form.image}} style={styles.image}/>}

                {/* Submit Button */}
                <Button title="Submit Report" onPress={handleSubmit}/>
            </ScrollView>
        </TouchableWithoutFeedback>
    );
}

const Styles = (colorScheme: string | null | undefined) => StyleSheet.create({
    container: {
        flexGrow: 1,
        justifyContent: 'center', // Center content vertically in the ScrollView
        alignItems: 'center', // Center content horizontally
        padding: 20,
        backgroundColor: colorScheme === "dark" ? "#222" : "#f9f9f9",
    },
    header: {
        alignSelf: 'center',
        fontSize: 18,
        fontWeight: 'bold',
        marginTop: 50,
        marginBottom: 5,
        color: colorScheme === "light" ? "black" : "white"
    },
    input: {
        width: "90%",
        padding: 12,
        marginVertical: 8,
        borderWidth: 1,
        borderColor: Platform.OS === "ios" ? colorScheme === "dark" ? "#aaa" : "#ddd" : "transparent",
        backgroundColor: colorScheme === "light" ? "#d1d1d1" : "#333",
        borderRadius: Platform.OS === "ios" ? 10 : 0, // Rounded edges for iOS, none for Android
        color: colorScheme === "dark" ? "#fff" : "#000",
    },
    description: {
        color: colorScheme === "dark" ? "#fff" : "#000",
        height: 120,
        textAlignVertical: 'top',
        borderRadius: Platform.OS === "ios" ? 10 : 0, // Rounded edges for iOS, none for Android
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
        borderRadius: 5, // Rounded edges
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
        borderRadius: 10, // Rounded edges
    },
});
